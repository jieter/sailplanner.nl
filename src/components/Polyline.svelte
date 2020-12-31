<script>
import { onMount, onDestroy, getContext } from 'svelte';
import 'polyline-encoded';
import { roundn } from '../formatting.js';

const { getMap } = getContext('leaflet');
const map = getMap();

export let leg;

let layer = null;

const style = () => ({
    color: leg.color,
    weight: leg.highlight ? leg.width * 2 : leg.width,
});

const setStyle = () => {
    if (!layer || layer._latlngs.length == 0) {
        return;
    }
    layer.setStyle(style());
};

onMount(() => {
    if (leg.path) {
        layer = L.Polyline.fromEncoded(leg.path);
        setStyle();
        layer.addTo(map);
    }
});
onDestroy(() => {
    if (layer) {
        layer.remove();
    }
});

$: {
    if (!layer && leg.edit == 'edit') {
        layer = map.editTools.startPolyline(undefined, style());
    }
    if (layer) {
        setStyle();
        leg.path = layer.encodePath();
        leg.dog = roundn(layer.getDistance(), 2);

        if (leg.edit === 'edit') {
            layer.enableEdit(map);
            // One might expect this to work, but it results in an infinite loop.
            // map.fitBounds(layer.getBounds());
        } else if (leg.edit === 'save') {
            layer.disableEdit();
        }
    }
}
</script>
