import { strict as assert } from 'assert';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/store.php';
const EXISTING_KEY = 'zomer2011';
const AUTH_TOKEN = '6ef207a08f04';
const MISSING_KEY = 'gibberish';

const legs = [{
    "departure": "10:00",
    "path": "qixlIdohFz@a`EawAmEaeGnmH{ufDlaqAqd@|x@kz@flA",
    "comment": "Hartlepool - Holy island",
    "color": "#0000ff",
    "width": 2,
    "dog": 59.66,
}];

describe('Sailplanner API', function() {
    describe('GET without a key', () => {
        it('should return a 500-response', async() => {
            let response = await fetch(API_URL);
            assert.equal(response.status, 500);

            let data = await response.json();
            assert.deepEqual(data, { success: false, message: 'No key provided' });
        });
    });
    describe('GET non-existant planner planner', () => {
        it('should return a 404-response', async() => {
            let response = await fetch(`${API_URL}?key=${MISSING_KEY}`);
            assert.equal(response.status, 404);

            let data = await response.json();
            assert.deepEqual(data, { success: false, message: 'File not found' });
        });
    });
    describe('GET existing planner', () => {
        it('should return the data without authToken', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`);
            assert.equal(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, undefined);
        });
        it('should include the authToken if requested with it', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                headers: {
                    'Authorization': `basic ${AUTH_TOKEN}`
                }
            });
            assert.equal(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, AUTH_TOKEN);
        });
        it('should remove the authToken if requested with an incorrect one', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                headers: { 'Authorization': 'basic gibberish' }
            });
            assert.equal(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, undefined);
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
            assert.equal(data.created.substring(0, 18), new Date().toISOString().substring(0, 18));
            assert.equal(data.created, data.modified);
            assert.equal(data.key.length, 12);
            assert.equal(data.key.length, 12);
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
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                method: 'POST',
                headers: { 'Authorization': `basic ${AUTH_TOKEN}` },
                body: JSON.stringify(state)
            });
            assert.equal(response.status, 200);

            let data = await response.json();
            assert.equal(data.key, EXISTING_KEY);
            assert.equal(data.authToken, AUTH_TOKEN);
            assert.equal(data.created, state.created);
            assert.equal(data.modified.substring(0, 18), new Date().toISOString().substring(0, 18));
            assert.equal(data.legs.length, state.legs.length);
        });
        it('should not update an existing planner if key in url and payload do not match', async() => {
            let illegalState = JSON.parse(JSON.stringify(state));
            illegalState['key'] = 'foo';

            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                method: 'POST',
                headers: { 'Authorization': `basic ${AUTH_TOKEN}` },
                body: JSON.stringify(illegalState)
            });
            assert.equal(response.status, 406);

            let data = await response.json();
            assert.deepEqual(data, { success: false, message: 'Key in payload is not equal to key in URL' });

        });
        it('should not update an existing planner if an incorrect authToken is used', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                method: 'POST',
                headers: { 'Authorization': 'basic gibberish' },
                body: JSON.stringify(state)
            });
            assert.equal(response.status, 401);

            let data = await response.json();
            assert.deepEqual(data, { success: false, message: 'Incorrect credentials' });
        });
    });

});