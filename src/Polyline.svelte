<script>
    import { onMount, getContext } from 'svelte';
    import 'polyline-encoded';
    import { roundn } from './formatting.js';

    const { getMap } = getContext('leafletInstance');
    const map = getMap();

    export let leg;

    let layer = null;

    const style = () => ({
        color: leg.color,
        weight: leg.highlight ? (leg.width * 2) : leg.width
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
        } else if (leg.edit == 'edit') {
            layer = map.editTools.startPolyline(undefined, style());
        }

        layer.addTo(map);
        return () => layer.remove();
    });

    $: {
        if (layer) {
            setStyle();
            if (leg.edit === 'edit') {
                layer.enableEdit(map);
            } else if (leg.edit === 'save') {
                leg.path = layer.encodePath();
                layer.disableEdit();
            }
            leg.dog = roundn(layer.getDistance(), 2);
        }
    }
</script>
