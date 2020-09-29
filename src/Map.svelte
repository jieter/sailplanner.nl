<script>
    import * as L from 'leaflet';
    import 'leaflet-editable';
    import 'leaflet/dist/leaflet.css';
    import './geoUtil.js';

    import { beforeUpdate, onMount, setContext } from 'svelte';
    import store from './store.js';
    import { roundn } from './formatting.js';

    let settings;
    let legs;

    store.subscribe(state => {
        settings = state.settings;
        legs = state.legs;
    });

    let container;
    let map;

    setContext('leafletInstance', {
        getMap: () => map
    });

    onMount(() => {
        map = L.map(container, {
            svgSprite: false,
            zoomControl: false,
            center: settings.map.center,
            zoom: settings.map.zoom,
            editable: true
        });
        map.on('zoomend moveend', e => {
            settings.map.zoom = map.getZoom();
            let center = map.getCenter();
            settings.map.center = [center.lat, center.lng];
            store.update(s => {
                s.settings = settings;
                return s;
            });
        });
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(map);

        L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png').addTo(map);

        resize();
    });

    // Keep map layers created in this array.
    let layers = [];
    $: {
        if (map) {
            map.setView(settings.map.center, settings.map.zoom);
        }
    };
    const resize = () => {
        map.invalidateSize();
    };
</script>

<div bind:this="{container}" class="map">
    <slot></slot>
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
