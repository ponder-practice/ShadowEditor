/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports ArcgisElevationCoverage
 */
import Sector from '../geom/Sector';
import TiledElevationCoverage from '../globe/TiledElevationCoverage';
import WmsUrlBuilder from '../util/WmsUrlBuilder';
import ElevationImage from './ElevationImage';
import Logger from '../util/Logger';
import WWMath from '../util/WWMath';
import ArcgisElevationWorker from 'worker!./ArcgisElevationWorker.js';

/**
 * Constructs an Earth elevation coverage using Arcgis data.
 * @alias ArcgisElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
function ArcgisElevationCoverage() {
    // see: http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer
    TiledElevationCoverage.call(this, {
        coverageSector: new Sector(-WWMath.MAX_LAT, WWMath.MAX_LAT, -180, 180),
        resolution: 360 / 2 ** 16 / 256,
        retrievalImageFormat: "application/bil16",
        minElevation: -450,
        maxElevation: 8700,
        urlBuilder: new WmsUrlBuilder("http://localhost:2020/api/Map/Elev", "WorldElevation3D", "", "1.3.0")
    });

    this.displayName = "Arcgis Elevation Coverage";

    this.worker = new ArcgisElevationWorker();
    this.worker.onmessage = this.handleMessage.bind(this);
}

ArcgisElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

ArcgisElevationCoverage.prototype.retrieveTileImage = function (tile) {
    var z = tile.level.levelNumber;
    if (z !== 7 && z !== 11 && z !== 13) {
        this.loadElevationImage(tile, {
            width: 257,
            height: 257,
            pixelData: null
        });
        // Send an event to request a redraw.
        var e = document.createEvent('Event');
        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
        window.dispatchEvent(e);
        return;
    }
    if (this.currentRetrievals.indexOf(tile.tileKey) < 0) {
        if (this.currentRetrievals.length > this.retrievalQueueSize) {
            return;
        }

        this.worker.postMessage({
            tileKey: tile.tileKey,
            x: tile.column,
            y: tile.row,
            z: z
        });

        this.currentRetrievals.push(tile.tileKey);
    }
};

ArcgisElevationCoverage.prototype.handleMessage = function (evt) {
    let { result, tileKey, url, data, msg } = evt.data;
    this.removeFromCurrentRetrievals(tileKey);
    let tile = this.tileCache.entryForKey(tileKey);
    if (!tile) {
        // tile has been released
        return;
    }
    if (result === 'success') {
        Logger.log(Logger.LEVEL_INFO, "Elevations retrieval succeeded: " + url);
        this.loadElevationImage(tile, data);
        this.absentResourceList.unmarkResourceAbsent(tileKey);

        // Send an event to request a redraw.
        var e = document.createEvent('Event');
        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
        window.dispatchEvent(e);
    } else if (result === 'fail') {
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING,
            "Elevations retrieval failed (" + msg + "): " + url);
    } else if (result === 'error') {
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval failed: " + url);
    } else if (result === 'timeout') {
        this.absentResourceList.markResourceAbsent(tileKey);
        Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval timed out: " + url);
    }
};

// Intentionally not documented.
ArcgisElevationCoverage.prototype.loadElevationImage = function (tile, data) {
    var elevationImage = new ElevationImage(tile.sector, data.width, data.height);

    elevationImage.imageData = data.pixelData;

    if (elevationImage.imageData) {
        elevationImage.size = elevationImage.imageData.length * 4;
        elevationImage.findMinAndMaxElevation();
        this.imageCache.putEntry(tile.tileKey, elevationImage, elevationImage.size);
        this.timestamp = Date.now();
    }
};

export default ArcgisElevationCoverage;
