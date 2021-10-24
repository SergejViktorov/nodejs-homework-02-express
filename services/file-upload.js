const Jimp = require('jimp')
class UploadFileAvatar {
	constructor(destination) {
		this.destination = destination
	}
	async #transformAvatar(pathFile) {}
	async save(file, idUser) {}
}

module.exports = UploadFileAvatar
