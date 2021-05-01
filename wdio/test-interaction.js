/* globals browser:true, expect:true, $:true */

const page = require('./page');

describe('Sailplanner.nl', () => {
    describe('Without hash', () => {
        it('Quickstart should be visible once', async () => {
            await page.open();

            const modal = await page.modal;
            expect(modal).toHaveTextContaining('Welcome to sailplanner');
            (await page.modalCloseButton).click();

            expect(modal).not.toBeVisible();

            await page.open();
            expect(modal).not.toBeVisible();
            expect(modal).toHaveTextContaining('Welcome to sailplanner');
            console.log(modal.getText());
        });

        it('Allows adding a comment', async () => {
            await page.open();

            const button = await page.addCommentButton;
            await button.click();

            const textarea = await $('textarea');
            expect(textarea).toBeVisible();
            await textarea.setValue('Planning my next trip');

            (await $('button=Save comment')).click();

            const comment = await $('#comment');
            expect(comment).toHaveTextContaining('Planning my next trip');
        });

        it('Allows creating a new leg', async () => {
            await page.open();

            const createButton = await page.createLegButton;
            createButton.click();

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
            await browser.saveScreenshot('./table.png');

            const saveButton = await page.saveButton;
            await saveButton.click();

            const shareAndEdit = await (await $('legend=Sharing & editing')).parent;
        });
    });
});
