<script>
    import * as L from 'leaflet';
    import 'leaflet-editable';
    import 'leaflet/dist/leaflet.css';
    import 'polyline-encoded';
    import './geoUtil.js';

    import { beforeUpdate, onMount } from 'svelte';
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
        })
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
        if (legs.length == 0) {
            layers.forEach(function (layer) {
                layer.removeFrom(map);
            });
        }
        let toDelete = undefined;
        legs.forEach(function (leg, i) {
            let style = {
                color: leg.color,
                weight: leg.highlight ? (leg.width * 2) : leg.width
            };

            if (!map.hasLayer(layers[i])) {
                if (leg.path) {
                    layers[i] = L.Polyline.fromEncoded(leg.path)
                } else if (leg.edit == 'edit') {
                    layers[i] = map.editTools.startPolyline(undefined, style);
                }
            }
            let layer = layers[i];
            layer.addTo(map);

            if (leg.delete) {
                layer.removeFrom(map);
                toDelete = i;
            } else if (leg.edit === 'edit') {
                layer.enableEdit(map);
            } else if (leg.edit === 'save') {
                legs[i].path = layer.encodePath();
                delete legs[i].edit;
                layer.disableEdit();
            }
            if (layer._latlngs.length > 1) {
                layer.setStyle(style);
            }
            legs[i].dog = roundn(layer.getDistance(), 2);
        });
        if (toDelete !== undefined) {
            legs.splice(toDelete, 1);
        }
        store.updateLegs(legs);
    };
    const resize = () => {
        map.invalidateSize();
    };
</script>

<svelte:window on:resize="{resize}" />
<div bind:this="{container}" id="map"></div>
