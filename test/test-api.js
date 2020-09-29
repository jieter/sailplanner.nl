import { strict as assert } from 'assert';
import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/';
const API_URL = `${BASE_URL}store.php`;
const EXISTING_KEY = 'zomer2011';
const AUTH_TOKEN = '6ef207a08f04';
const MISSING_KEY = 'gibberish';

const legs = [{
    departure: '10:00',
    path: 'qixlIdohFz@a`EawAmEaeGnmH{ufDlaqAqd@|x@kz@flA',
    comment: 'Hartlepool - Holy island',
    color: '#0000ff',
    width: 2,
}];

describe(`Sailplanner API at url: ${API_URL}`, function() {
    describe('GET without a key', () => {
        it('should return a 500-response', async() => {
            let response = await fetch(API_URL);
            assert.strictEqual(response.status, 500);

            let data = await response.json();
            assert.deepStrictEqual(data, { success: false, message: 'No key provided' });
        });
    });
    describe('GET non-existant planner planner', () => {
        it('should return a 404-response', async() => {
            let response = await fetch(`${API_URL}?key=${MISSING_KEY}`);
            assert.strictEqual(response.status, 404);

            let data = await response.json();
            assert.deepStrictEqual(data, { success: false, message: 'File not found' });
        });
    });
    describe('GET existing planner', () => {
        it('should return the data without authToken', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`);
            assert.strictEqual(response.status, 200);

            let data = await response.json();
            assert.strictEqual(data.authToken, undefined);
        });
        it('should include the authToken if requested with it', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}&authToken=${AUTH_TOKEN}`);
            assert.strictEqual(response.status, 200);

            let data = await response.json();
            assert.strictEqual(data.authToken, AUTH_TOKEN);
        });
        it('should remove the authToken if requested with an incorrect one', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}&authToken=gibberish`);
            assert.strictEqual(response.status, 200);

            let data = await response.json();
            assert.strictEqual(data.authToken, undefined);
        });
    });

    describe('POST new planner', () => {
        const state = {
            comment: 'foo',
            settings: {},
            legs: legs,
        };

        it('should store a new planner and add an authToken to the response', async() => {
            let response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(state)
            });
            let data = await response.json();
            assert.strictEqual(data.created.substring(0, 16), new Date().toISOString().substring(0, 16));
            assert.strictEqual(data.created, data.modified);
            assert.strictEqual(data.key.length, 12);
            assert.strictEqual(data.key.length, 12);
        });
    });
    describe('POST existing planner', () => {
        const state = {
            key: EXISTING_KEY,
            authToken: AUTH_TOKEN,
            created: '2020-09-10T19:07:39+0000',
            modified: '2020-09-10T19:07:39+0000',
            settings: {},
            legs: legs,
        };
        it('should update an existing planner if the correct authToken is used', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}&authToken=${AUTH_TOKEN}`, {
                method: 'POST',
                body: JSON.stringify(state)
            });
            assert.strictEqual(response.status, 200);

            let data = await response.json();
            assert.strictEqual(data.key, EXISTING_KEY);
            assert.strictEqual(data.authToken, AUTH_TOKEN);
            assert.strictEqual(data.created, state.created);
            assert.strictEqual(data.modified.substring(0, 18), new Date().toISOString().substring(0, 18));
            assert.strictEqual(data.legs.length, state.legs.length);
        });
        it('should not update an existing planner if key in url and payload do not match', async() => {
            let illegalState = JSON.parse(JSON.stringify(state));
            illegalState['key'] = 'foo';

            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}&authToken=${AUTH_TOKEN}`, {
                method: 'POST',
                body: JSON.stringify(illegalState)
            });
            assert.strictEqual(response.status, 406);

            let data = await response.json();
            assert.deepStrictEqual(data, { success: false, message: 'Key in payload is not equal to key in URL' });

        });
        it('should not update an existing planner if an incorrect authToken is used', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}&authToken=gibberish`, {
                method: 'POST',
                body: JSON.stringify(state)
            });
            assert.strictEqual(response.status, 401);

            let data = await response.json();
            assert.deepStrictEqual(data, { success: false, message: 'Incorrect credentials' });
        });
    });

});