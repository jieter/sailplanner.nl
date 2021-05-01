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

    get modal() {
        return $('.modal');
    }
    get modalCloseButton() {
        return $('.modal .close');
    }

    get createLegButton() {
        return $('button=Create leg');
    }
    get addCommentButton() {
        return $('button=Add comment');
    }

    get legSettings() {
        return $('.leg-settings');
    }

    get legsTable() {
        return $('.legs-table');
    }

    get saveButton() {
        return $('button=Save');
    }

    async clickMap(x, y) {
        const map = await this.map;
        await map.moveTo();
        await map.click({ button: 'left', x: x, y: y });
        await browser.pause(1000);
    }
}

module.exports = new Page();
