import Command from './Command';

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newMaterial THREE.Material
 * @constructor
 */

function SetMaterialCommand(object, newMaterial) {

	Command.call(this);

	this.type = 'SetMaterialCommand';
	this.name = 'New Material';

	this.object = object;
	this.oldMaterial = (object !== undefined) ? object.material : undefined;
	this.newMaterial = newMaterial;

};

SetMaterialCommand.prototype = Object.create(Command.prototype);

Object.assign(SetMaterialCommand.prototype, {

	constructor: SetMaterialCommand,

	execute: function () {
		this.object.material = this.newMaterial;
		this.editor.app.call('materialChanged', this, this.newMaterial);
	},

	undo: function () {
		this.object.material = this.oldMaterial;
		this.editor.app.call('materialChanged', this, this.oldMaterial);
	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call(this);

		output.objectUuid = this.object.uuid;
		output.oldMaterial = this.oldMaterial.toJSON();
		output.newMaterial = this.newMaterial.toJSON();

		return output;

	},

	fromJSON: function (json) {

		Command.prototype.fromJSON.call(this, json);

		this.object = this.editor.objectByUuid(json.objectUuid);
		this.oldMaterial = parseMaterial(json.oldMaterial);
		this.newMaterial = parseMaterial(json.newMaterial);


		function parseMaterial(json) {

			var loader = new THREE.ObjectLoader();
			var images = loader.parseImages(json.images);
			var textures = loader.parseTextures(json.textures, images);
			var materials = loader.parseMaterials([json], textures);
			return materials[json.uuid];

		}

	}

});

export default SetMaterialCommand;
