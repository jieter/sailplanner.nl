<script>
import { asGeoJSON, asGPX, asKML } from '../exports.js';

export let options;
export let legs;
export let url;

const exportFormats = {
    GeoJSON: asGeoJSON,
    GPX: asGPX,
    KML: asKML,
};

function exportPlanner(format) {
    const data = Object.assign({}, $options);
    data.legs = $legs;

    const contents = exportFormats[format](data, url);

    let tag = document.createElement('a');
    tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`;
    tag.target = '_blank';
    tag.download = `sailplanner.${format.toLowerCase()}`;
    tag.click();
}
</script>

<button class="button dropdown" title="Various export methods">
    Export
    <div class="formats">
        {#each Object.keys(exportFormats) as format}
            <div class="button" on:click={(e) => exportPlanner(format)}>{format}</div>
        {/each}
    </div>
</button>

<style>
.dropdown {
    position: relative;
    display: inline-block;
}
.dropdown::after {
    content: '▼';
}
.dropdown:hover .formats {
    display: block;
}
.dropdown .formats {
    display: none;
    position: absolute;
    min-width: 40px;
    margin-top: 2px;
    margin-left: -4px;
    z-index: 1;
}
</style>
