class Page {
    constructor(baseUrl = false) {
        this.baseUrl = 'http://localhost:8000';
    }

    base(baseUrl) {
        this.baseUrl = baseUrl;
    }

    open(hash) {
        let url = this.baseUrl;
        if (hash) {
            url = `${url}#${hash}`;
        }
        return browser.url(url);
    }

    blur(element) {
        browser.execute((selector) => {
            document.querySelector(selector).blur();
        }, element.selector); //pass the selector to the execute function
    }

    get map() {
        return $('.leaflet-container');
    }

    clickCenterMap() {
        let map = this.map;
        let dimensions = map.getSize();
        map.moveTo(Math.round(dimensions.width / 2), Math.round(dimensions.height / 2));
        map.click();
    }
}

module.exports = new Page();
