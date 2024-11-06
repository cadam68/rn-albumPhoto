
module.exports = class BasicData {

    static Build(domain, label, value, mode) {
        return new BasicData({domain, label, value, mode});
    }

     constructor(basicData={}) {
        this.domain=basicData.domain;
        this.label=basicData.label;
        this.value=basicData.value;
        this.mode=['RO', 'RW'].indexOf(basicData.mode)!=-1?basicData.mode:'RO';
    }

    toString() {
        return `{domain = [${this.domain}], label = [${this.label}], value = [${this.value}], mode = [${this.mode}]}`;
    }

}