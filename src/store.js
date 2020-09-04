import { writable } from "svelte/store";

const EMPTY = {
    key: undefined,
    authKey: undefined,
    url: undefined,
    editUrl: undefined,
    comment: "",
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
}

export const { subscribe, set, update } = writable(EMPTY);

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
    })
}

export const updateLegs = (legs) => {
    update(s => {
        s.legs = legs;
        return s;
    })
}

export const fork = () => {
    update(s => {
        s.authKey = undefined;
        s.key = undefined;
        s.url = undefined;
        s.editUrl = undefined;
        return s;
    });
}

let state;
subscribe(s => state = s);

const API_URL = 'store.php'

export const save = async() => {
    let url;
    let headers = {
        'Content-Type': 'application/json'
    };

    if (state.authKey) {
        url = `${API_URL}?key=${state.key}`
        headers['Authorization'] = `basic ${state.authKey}`;
    } else {
        url = API_URL;
    }
    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(state)
    });
    if (response.status == 200) {
        set(await response.json());
        return true;
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
}