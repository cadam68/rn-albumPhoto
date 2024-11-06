
module.exports = class Stats {

     constructor(stats={}) {
        this.nbPhotoSent=(stats&&stats.nbPhotoSent)?stats.nbPhotoSent:0;
        this.food=(stats&&stats.food)?stats.food:0;
        this.lastPhotoSentDate=(stats&&stats.lastPhotoSentDate)?stats.lastPhotoSentDate:null;
    }

    toString() {
        return `{nbPhotoSent = [${this.nbPhotoSent}], food = [${this.food}], lastPhotoSentDate = [${this.lastPhotoSentDate}]}`;
    }

}