import { writable } from 'svelte/store';
import { transformFromLegacy } from './legacy.js';

const EMPTY = {
    key: undefined,
    authToken: null,
    canEdit: true,
    comment: '',
    settings: {
        average: 5,
        map: { center: [55.167423, 5.365761], zoom: 6 },
    },
    legs: [],
    isDirty: true,
};

const EMPTY_LEG = {
    comment: '',
    color: '#ff0000',
    width: 2,
    departure: '10:00',
    edit: 'edit',
};

export const { subscribe, set, update } = writable(EMPTY);

let state;
subscribe((s) => (state = s));

const addLeg = (leg) =>
    update((s) => {
        s.legs = [...s.legs, leg];
        return s;
    });

export const createLeg = () => {
    addLeg(Object.assign({}, EMPTY_LEG));
};

const reset = () => {
    set(EMPTY);
    window.location.hash = '';
};

export const updateSettings = (settings) => {
    update((s) => {
        s.settings = settings;
        s.isDirty = true;
        return s;
    });
};

export const updateLegs = (legs) => {
    update((s) => {
        s.legs = legs;
        s.isDirty = true;
        return s;
    });
};

export const fork = () => {
    update((s) => {
        s.authToken = null;
        s.key = undefined;
        s.isDirty = true;
        return s;
    });
    window.location.hash = '';
};

const API_URL = 'store.php';

export const load = async (key, authToken) => {
    let url = `${API_URL}?key=${key}`;
    if (authToken) {
        url += `&authToken=${authToken}`;
    }

    const data = await fetch(url).then((response) => {
        if (response.status == 404) {
            return fetch(`http://sailplanner.nl/getLegs/key:${key}`)
                .then((response) => response.json())
                .then((data) => transformFromLegacy(data));
        } else {
            let json = response.json();
            json.isDirty = false;
            json.canEdit = json.authToken || json.authToken === null;
            return json;
        }
    });

    set(data);
};

export const save = async () => {
    let url;

    if (state.authToken) {
        url = `${API_URL}?key=${state.key}&authToken=${state.authToken}`;
    } else {
        url = API_URL;
    }
    let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
    });
    if (response.status == 200) {
        let data = await response.json();
        data.isDirty = false;
        data.canEdit = true;
        set(data);
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
