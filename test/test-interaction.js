const page = require('./page');
const chai = require('chai');
var assert = chai.assert;

describe('Sailplanner.nl', () => {
    it('Quickstart should be visible', () => {
        page.open();

        expect(page.map).toBeExisting();
        expect(page.quickstart).toBeExisting();

        browser.saveScreenshot('./screenshots/quickstart.png');
        browser.debug();
    });
});
