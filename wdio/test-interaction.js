/* globals browser:true, expect:true, $:true */
const fs = require('fs');

const page = require('./page');

describe('Sailplanner.nl', () => {
    describe.skip('Without hash', () => {
        it('Quickstart should be visible once', async () => {
            await page.open();

            const modal = await page.modal;
            expect(modal).toHaveTextContaining('Welcome to sailplanner');
            (await page.modalCloseButton).click();

            expect(modal).not.toBeVisible();

            await page.open();
            expect(modal).not.toBeVisible();
            expect(modal).toHaveTextContaining('Welcome to sailplanner');
        });

        it('Allows adding a comment', async () => {
            await page.open();

            await (await page.addCommentButton).click();

            const textarea = await $('textarea');
            expect(textarea).toBeVisible();
            await textarea.setValue('Planning my next trip');

            (await $('button=Save comment')).click();

            expect(await $('#comment')).toHaveTextContaining('Planning my next trip');
        });

        it('Allows creating a new leg', async () => {
            await page.open();

            await (await page.createLegButton).click();

            const legSettings = await page.legSettings;
            const commentInput = await legSettings.$('[name="comment"]');
            await commentInput.setValue('IJmuiden - Newcastle');

            const map = await page.map;
            await map.moveTo();
            await map.click({ x: -30, y: 200 });
            await map.click({ x: -130, y: 200 });

            (await $('button=Save leg')).click();

            const table = await page.legsTable;
            expect(table).toHaveTextContaining('IJmuiden - Newcastle');
            expect(await table.$('//tr[2]/td[3]')).toHaveTextContaining('80.1');
            expect(await table.$('//tr[2]/td[4]')).toHaveTextContaining('16:02');
            expect(await table.$('//tr[2]/td[5]')).toHaveTextContaining('1d 2:02');

            await (await page.saveButton).click();

            const sharing = await (await $('legend=Sharing & editing')).parent;

            const readOnlyUrl = await sharing.$('//input[1]');
            expect(readOnlyUrl).toHaveTextContaining(page.baseUrl);

            const [url, fragment] = (await browser.getUrl()).split('#');
            const [key, authToken] = fragment.split('|');
            expect(url).toBe(page.baseUrl + '/');
            expect(key.length).toBe(12);
            expect(authToken.length).toBe(12);

            await browser.saveScreenshot('./screenshots/create-new-leg.png');

            // Open the saved planner without authToken, should be read-only
            await page.open(key);
            expect(await $('button=Save')).not.toBePresent();

            // Open the saved planner with the authToken, should be editable
            await page.open(fragment);
            expect(await $('button=Save')).toBePresent();
        });
    });

    describe.skip('With hash', () => {
        it('Loads an existing planner', async () => {
            await page.open('zomer2011');

            expect(await $('#comment')).toHaveTextContaining(
                'Zomerzeilen 2011. Rondje Noordzee met Schotland, Noorwegen en wellicht Denemarken.'
            );

            const sharing = await (await $('legend=Sharing & editing')).parent;

            const legacyUrl = await sharing.$('//input[1]');
            expect(legacyUrl).toHaveTextContaining('http://sailplanner.nl/view/key:zomer2011');

            await browser.saveScreenshot('./screenshots/zomer2011.png');

            // Fork the planner, add another
            await (await page.forkButton).click();

            await (await page.createLegButton).click();
            const legSettings = await page.legSettings;
            const commentInput = await legSettings.$('[name="comment"]');
            await commentInput.setValue('Boven Parijs');

            const map = await page.map;
            await map.moveTo();
            await map.click({ x: -30, y: 200 });
            await map.click({ x: -130, y: 200 });

            (await $('button=Save leg')).click();

            await (await page.saveButton).click();
            await browser.saveScreenshot('./screenshots/zomer2011-forked.png');
        });
    });
    describe('Exporting', async () => {
        const getDownloadedFile = async (ext) => {
            return fs.readFileSync(`/tmp/downloads/sailplanner.${ext}`);
        };
        it('to GeoJSON', async () => {
            await page.open('zomer2011');
            const exportButton = await $('button*=Export');
            await exportButton.moveTo();

            await (await $('div=GeoJSON')).click();
        });
        it('to GPX', async () => {
            await page.open('zomer2011');
            const exportButton = await $('button*=Export');
            await exportButton.moveTo();

            await (await $('div=GPX')).click();
            console.log(getDownloadedFile('gpx'));
        });
        it('to KML', async () => {
            await page.open('zomer2011');
            const exportButton = await $('button*=Export');
            await exportButton.moveTo();

            await (await $('div=KML')).click();

            await browser.pause(2000);
        });
    });
});
