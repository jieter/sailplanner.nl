<script>
import * as L from 'leaflet';
import 'leaflet-editable';
import 'leaflet/dist/leaflet.css';
import { beforeUpdate, onMount, setContext } from 'svelte';

import '../geoUtil.js';
import { roundn } from '../formatting.js';

export let settings;
let container;
let map;

setContext('leaflet', {
    getMap: () => map,
});

onMount(() => {
    map = L.map(container, {
        center: settings.map.center,
        zoom: settings.map.zoom,
        editable: true,
    });
    map.on('zoomend moveend', (e) => {
        let center = map.getCenter();
        settings.map.center = [center.lat, center.lng];
        settings.map.zoom = map.getZoom();
    });
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(map);

    L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openseamap.org">OpenSeaMap</a>',
    }).addTo(map);

    map.invalidateSize();
});

$: {
    if (map) {
        map.setView(settings.map.center, settings.map.zoom);
    }
}
</script>

<div bind:this={container} class="map">
    <slot />
</div>

<style>
.map {
    left: 320px;
    right: 0px;
    top: 0px;
    position: absolute;
    bottom: 0px;
    border: 1px solid black;
}
</style>
