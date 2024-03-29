import { writable } from 'svelte/store';
import { transformFromLegacy } from './legacy.js';
import { get } from 'svelte/store';

const API_URL = 'store.php';

const createEmpty = () => ({
    key: undefined,
    authToken: null,
    comment: '',
    settings: {
        average: 5,
        map: { center: [55.167423, 5.365761], zoom: 6 },
    },
});

export const canEdit = writable(true);
export const isDirty = writable(true);

// canEdit.subscribe((s) => {
//     console.log(s);
// });
export const legs = writable([]);
export const options = writable(createEmpty());

export const createLeg = () => {
    const newLeg = {
        comment: '',
        color: '#ff0000',
        width: 2,
        departure: '10:00',
        edit: 'edit',
    };
    legs.update((currentLegs) => [...currentLegs, newLeg]);
};

export const reset = () => {
    options.set(createEmpty());
    legs.set([]);
    isDirty.set(false);
    canEdit.set(true);
    window.location.hash = '';
};

export const fork = () => {
    isDirty.set(true);
    canEdit.set(true);

    options.update((currentOptions) => {
        currentOptions.authToken = null;
        currentOptions.key = undefined;
        return currentOptions;
    });
    window.location.hash = '';
};

export const load = async (key, authToken) => {
    let url = `${API_URL}?key=${key}`;
    if (authToken) {
        url += `&authToken=${authToken}`;
    }

    const data = await fetch(url).then(async (response) => {
        if (response.status == 404) {
            return fetch(`http://sailplanner.nl/getLegs/key:${key}`)
                .then((response) => response.json())
                .then((data) => transformFromLegacy(data));
        } else {
            let json = await response.json();
            json.isDirty = false;
            console.log(json);
            json.canEdit = json.authToken || json.authToken === null;
            return json;
        }
    });

    if (!data) {
        reset();
        return;
    }

    canEdit.set(data.canEdit);
    isDirty.set(false);
    legs.set(data.legs);

    options.set(data);
};

export const persist = async () => {
    // Make sure the editing state is forgotten.
    const data = Object.assign({}, get(options));
    data.legs = get(legs).map((leg) => {
        delete leg.edit, leg.highlight;
        return leg;
    });

    let url;
    if (data.authToken) {
        url = `${API_URL}?key=${data.key}&authToken=${data.authToken}`;
    } else {
        url = API_URL;
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (response.status == 200) {
        let data = await response.json();
        isDirty.set(false);
        canEdit.set(true);

        legs.set(data.legs);
        delete data.legs;
        options.set(data);

        return `${data.key}|${data.authToken}`;
    } else {
        // Error!
        return false;
    }
};
