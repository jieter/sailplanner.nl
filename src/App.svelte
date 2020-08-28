
<script>
    import Map from './Map.svelte';
    import LegsTable from './LegsTable.svelte';
    import marked from 'marked';
    import { asGeoJSON, asGPX, asKML } from './exports.js';
    import { transformFromLegacy } from './legacy.js';
    import { onMount } from 'svelte';
    import store from './store.js';

    import './planner.css';

    let currentState;
    let comment;
    let legs;
    let settings;

    store.subscribe(state => {
        currentState = state;
        comment = state.comment;
        settings = state.settings;
        legs = state.legs;
    });

    onMount(() => {
        if (window.location.hash !== '') {
            let key = window.location.hash.substring(1);
            const headers = {};
            if (key.indexOf('|') > 0) {
                let authKey;
                [key, authKey] = key.split('|');
                headers['Authorization'] = `basic ${authKey}`;
            }

            fetch(`store/${key}.json`, {headers: headers})
                .then(response => response.json())
                .then(function (data) {
                    if (data.data) {
                        data = transformFromLegacy(data);
                    }
                    store.set(data);
                });
        }
    });
    const exportFormats = {
        'GeoJSON': asGeoJSON,
        'GPX': asGPX,
        'KML': asKML
    };
    function exportPlanner(format) {
        const contents = exportFormats[format](currentState);

        let tag = document.createElement('a');
        tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`
        tag.target = '_blank';
        tag.download = `sailplanner.${format.toLowerCase()}`;
        tag.click();
    }

    function setAction(event) {
        store.update(state => {
            legs[event.detail.leg][event.type] = event.detail.value;
            state.legs = legs;
            return state;
        });
    }
</script>
<div id="sidebar">
    <h1 id="header">Sailplanner</h1>
    <div id="comment">{@html marked(comment)}</div>
    <LegsTable on:new={e => store.createLeg()}
               on:edit={setAction}
               on:highlight={setAction}
               on:delete={setAction} />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="meansog">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input type="number" bind:value="{settings.average}" on:change="{e => store.updateSettings(settings)}" min="0" max="40" />&nbsp;kts<br />
    </fieldset>

    <fieldset class="settings">
        <legend>Sharing &amp; editing</legend>

        {#if currentState.legacyUrl}
            <div>
                <strong>Legacy URL:</strong> <a href="{currentState.legacyUrl}">{currentState.key}</a>
            </div>
            <br>
        {/if}

        <button class="button" title="Delete everything and start over..." on:click={store.reset}>New</button>

        <button class="button dropdown" title="Various export methods">
            Export
            <div class="formats">
                {#each Object.keys(exportFormats) as format}
                    <div class="button" on:click={e => exportPlanner(format)}>{format}</div>
                {/each}
            </div>

        </button>
        <!-- <a id="save" class="button pull-right" title="Save state planner to the server...">Save</a> -->
    </fieldset>

    <div id="other">
        <a id="page-about">About (NL)</a> |
        <a id="page-howto">Howto</a> |
        <a id="page-faq">FAQ</a>
    </div>
    <div id="disclaimer">
        <h5>Disclaimer</h5>
        Altough I'm trying to provide a functional Sailplanner at all time,
        Sailplanner is provided <strong>as is</strong>, no guarantee can be made whatsoever.<br>
        Sailplanner is designed for planning purposes only and should not be used as a navigation aid.
    </div>
</div>
<Map />

<style>
    .dropdown {
        position: relative;
        display: inline-block;
    }
    .dropdown::after { content: "▼"; }
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
