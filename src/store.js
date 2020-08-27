import { writable } from "svelte/store";

const EMPTY = {
    comment: "",
    settings: {
        average: 5,
        map: { center: [55.167423, 5.365761], zoom: 6 },
    },
    legs: [],
};

const EMPTY_LEG = {
    comment: '',
    color: '#f00',
    width: 2,
    departure: '10:00',
    edit: 'edit'
}

export const { subscribe, set, update } = writable(EMPTY);

const addLeg = leg => update(state => {
    state.legs = [...state.legs, leg];
    return state;
});

export const createLeg = () => {
    addLeg(Object.assign({}, EMPTY_LEG));
};

const reset = () => { set(EMPTY); };

export const updateSettings = (settings) => {
    update(state => {
        state.settings = settings;
        return state;
    })
}

export const updateLegs = (legs) => {
    update(state => {
        state.legs = legs;
        return state;
    })
}

export default {
    subscribe,
    set,
    update,
    reset,
    addLeg,
    createLeg,
    updateSettings,
    updateLegs
}