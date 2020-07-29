import { writable } from "svelte/store";

const EMPTY = {
    comment: "",
    settings: {
        average: 5,
        map: { center: [55.167423, 5.365761], zoom: 6 },
    },
    legs: [],
};

export const { subscribe, set, update } = writable(EMPTY);

const addLeg = leg => update(state => {
    state.legs = [...state.legs, leg];
    return state;
});

export const updateLeg = (leg, i) => update(state => {
    state.legs[i] = leg;
    return state;
});
const reset = () => { set(EMPTY); };


export default {
    subscribe,
    set,
    update,
    reset,
    addLeg,
    updateLeg
}