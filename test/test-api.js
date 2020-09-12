import { strict as assert } from 'assert';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/store.php';
const EXISTING_KEY = 'zomer2011';
const AUTH_TOKEN = '6ef207a08f04';
const MISSING_KEY = 'gibberish';


describe('Sailplanner API', function() {
    describe('GET without a key', () => {
        it('should return a 500-response', async() => {
            let response = await fetch(API_URL);
            assert.equal(response.status, 500);

            let data = await response.json();
            assert.deepEqual(data, { 'success': false, 'message': 'No key provided' });
        });
    });
    describe('GET non-existant planner planner', () => {
        it('should return a 404-response', async() => {
            let response = await fetch(`${API_URL}?key=${MISSING_KEY}`);
            assert.equal(response.status, 404);

            let data = await response.json();
            assert.deepEqual(data, { 'success': false, 'message': 'File not found' });
        });
    });
    describe('GET existing planner', () => {
        it('should return the data without authToken', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`);
            assert.deepEqual(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, undefined);
        });
        it('should include the authToken if requested with it', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                headers: {
                    'Authorization': `basic ${AUTH_TOKEN}`
                }
            });
            assert.deepEqual(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, AUTH_TOKEN);
        });
        it('should remove the authToken if requested with an incorrect one', async() => {
            let response = await fetch(`${API_URL}?key=${EXISTING_KEY}`, {
                headers: {
                    'Authorization': 'basic gibberish'
                }
            });
            assert.deepEqual(response.status, 200);

            let data = await response.json();
            assert.equal(data.authToken, undefined);
        });
    });
});