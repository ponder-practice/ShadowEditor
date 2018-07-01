﻿import SetGeometryValueCommand from '../../command/SetGeometryValueCommand';
import GeometryGeometryPanel from './GeometryGeometryPanel';
import BufferGeometryPanel from './BufferGeometryPanel';
import GeometryModifyPanel from './GeometryModifyPanel';

import BoxGeometryPanel from './BoxGeometryPanel';
import CircleGeometryPanel from './CircleGeometryPanel';
import CylinderGeometryPanel from './CylinderGeometryPanel';
import IcosahedronGeometryPanel from './IcosahedronGeometryPanel';
import LatheGeometryPanel from './LatheGeometryPanel';
import PlaneGeometryPanel from './PlaneGeometryPanel';
import SphereGeometryPanel from './SphereGeometryPanel';
import TeapotBufferGeometryPanel from './TeapotBufferGeometryPanel';
import TorusGeometryPanel from './TorusGeometryPanel';
import TorusKnotGeometryPanel from './TorusKnotGeometryPanel';

import UI from '../../ui/UI';

/**
 * @author mrdoob / http://mrdoob.com/
 */

const GeometryPanels = {
    'BoxGeometry': BoxGeometryPanel,
    'BoxBufferGeometry': BoxGeometryPanel,
    'CircleGeometry': CircleGeometryPanel,
    'CircleBufferGeometry': CircleGeometryPanel,
    'CylinderGeometry': CylinderGeometryPanel,
    'CylinderBufferGeometry': CylinderGeometryPanel,
    'IcosahedronGeometry': IcosahedronGeometryPanel,
    'IcosahedronBufferGeometry': IcosahedronGeometryPanel,
    'LatheGeometry': LatheGeometryPanel,
    'LatheBufferGeometry': LatheGeometryPanel,
    'PlaneGeometry': PlaneGeometryPanel,
    'PlaneBufferGeometry': PlaneGeometryPanel,
    'SphereGeometry': SphereGeometryPanel,
    'SphereBufferGeometry': SphereGeometryPanel,
    'TeapotGeometry': TeapotBufferGeometryPanel,
    'TeapotBufferGeometry': TeapotBufferGeometryPanel,
    'TorusGeometry': TorusGeometryPanel,
    'TorusBufferGeometry': TorusGeometryPanel,
    'TorusKnotGeometry': TorusKnotGeometryPanel,
    'TorusKnotBufferGeometry': TorusKnotGeometryPanel
};

function GeometryPanel(editor) {
    this.app = editor.app;
    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    // type

    var geometryTypeRow = new UI.Row();
    var geometryType = new UI.Text();

    geometryTypeRow.add(new UI.Text('类型').setWidth('90px'));
    geometryTypeRow.add(geometryType);

    container.add(geometryTypeRow);

    // uuid

    var geometryUUIDRow = new UI.Row();
    var geometryUUID = new UI.Input().setWidth('102px').setFontSize('12px').setDisabled(true);
    var geometryUUIDRenew = new UI.Button('新建').setMarginLeft('7px').onClick(function () {

        geometryUUID.setValue(THREE.Math.generateUUID());

        editor.execute(new SetGeometryValueCommand(editor.selected, 'uuid', geometryUUID.getValue()));

    });

    geometryUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    geometryUUIDRow.add(geometryUUID);
    geometryUUIDRow.add(geometryUUIDRenew);

    container.add(geometryUUIDRow);

    // name

    var geometryNameRow = new UI.Row();
    var geometryName = new UI.Input().setWidth('150px').setFontSize('12px').onChange(function () {

        editor.execute(new SetGeometryValueCommand(editor.selected, 'name', geometryName.getValue()));

    });

    geometryNameRow.add(new UI.Text('名称').setWidth('90px'));
    geometryNameRow.add(geometryName);

    container.add(geometryNameRow);

    // geometry

    container.dom.appendChild(new GeometryGeometryPanel(editor).dom);

    // buffergeometry

    container.dom.appendChild(new BufferGeometryPanel(editor).dom);

    // parameters

    var parameters = new UI.Span();
    container.add(parameters);


    //

    function build() {

        var object = editor.selected;

        if (object && object.geometry) {

            var geometry = object.geometry;

            container.setDisplay('block');

            geometryType.setValue(geometry.type);

            geometryUUID.setValue(geometry.uuid);
            geometryName.setValue(geometry.name);

            //

            parameters.clear();

            if (geometry.type === 'BufferGeometry' || geometry.type === 'Geometry') {
                parameters.dom.appendChild(new GeometryModifyPanel(editor, object).dom);
            } else if (GeometryPanels[geometry.type] !== undefined) {
                parameters.dom.appendChild(new GeometryPanels[geometry.type](editor, object).dom);
            }

        } else {

            container.setDisplay('none');

        }

    }

    this.app.on('objectSelected.GeometryPanel', function () {
        build();
    });

    this.app.on('geometryChanged.GeometryPanel', function () {
        build();
    });

    return container;

};

export default GeometryPanel;