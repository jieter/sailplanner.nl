<script>
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import "polyline-encoded";
    import "./geoUtil.js";

    import { beforeUpdate, onMount } from 'svelte';
    import { subscribe, update } from './store.js';
    import { roundn } from './formatting.js';

    let settings;
    let legs;

    subscribe(state => {
        settings = state.settings;
        legs = state.legs;
    });

    let container;
    let map;

    onMount(() => {
        map = L.map(container, {
            svgSprite: false,
            zoomControl: false,
			center: settings.map.center,
			zoom: settings.map.zoom
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
        legs.forEach(function (leg, i) {
            let layer;
            if (!map.hasLayer(layers[i])) {
                layers[i] = L.Polyline.fromEncoded(leg.path).addTo(map);
            }
            layer = layers[i];
            layer.setStyle({
                color: leg.color,
                weight: leg.highlighted ? (leg.width * 2) : leg.width
            });

            legs[i].dog = roundn(layer.getDistance(), 2);
        });
        update(state => {
            state.legs = legs;
            return state;
        });
    };
    const resize = () => {
        map.invalidateSize();
    };
</script>

<svelte:window on:resize="{resize}" />
<div bind:this="{container}" id="map"></div>
