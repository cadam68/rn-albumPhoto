
module.exports = class Settings {

     constructor(settings={}) {
        this.userId=settings?settings.userId:null;
        this.imageSize=settings?settings.imageSize:null;
        this.category=settings?settings.category:null;
    }

    toString() {
        return `{userId = [${this.userId}], imageSize = [${this.imageSize}], category = [${this.category}]}`;
    }

}