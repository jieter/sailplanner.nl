import { writable } from 'svelte/store';
import { transformFromLegacy } from './legacy.js';

const EMPTY = {
    key: undefined,
    authToken: null,
    comment: '',
    settings: {
        average: 5,
        map: { center: [55.167423, 5.365761], zoom: 6 },
    },
    legs: [],
};

const EMPTY_LEG = {
    comment: '',
    color: '#ff0000',
    width: 2,
    departure: '10:00',
    edit: 'edit'
};

export const { subscribe, set, update } = writable(EMPTY);

let state;
subscribe(s => state = s);

const addLeg = leg => update(s => {
    s.legs = [...s.legs, leg];
    return s;
});

export const createLeg = () => {
    addLeg(Object.assign({}, EMPTY_LEG));
};

const reset = () => { set(EMPTY); };

export const updateSettings = (settings) => {
    update(s => {
        s.settings = settings;
        return s;
    });
};

export const updateLegs = (legs) => {
    update(s => {
        s.legs = legs;
        return s;
    });
};

export const fork = () => {
    update(s => {
        s.authToken = null;
        s.key = undefined;
        return s;
    });
};

const API_URL = 'store.php';

export const load = async(key, authToken) => {
    let url = `${API_URL}?key=${key}`;
    if (authToken) {
        url += `&authToken=${authToken}`;
    }

    let data = await fetch(url).then(response => {
        if (response.status == 404) {
            return fetch(`http://sailplanner.nl/getLegs/key:${key}`)
                .then(response => response.json())
                .then(data => transformFromLegacy(data));
        } else {
            return response.json();
        }
    });

    set(data);
};

export const save = async() => {
    let url;

    if (state.authToken) {
        url = `${API_URL}?key=${state.key}&authToken=${state.authToken}`;
    } else {
        url = API_URL;
    }
    let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    });
    if (response.status == 200) {
        set(await response.json());
        return `${state.key}|${state.authToken}`;
    } else {

        // Error!
        return false;
    }
};

export default {
    subscribe,
    set,
    update,
    reset,
    addLeg,
    createLeg,
    updateSettings,
    updateLegs,
    fork,
    save,
    load,
};