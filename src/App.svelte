
<script>
    import Map from './Map.svelte';
    import LegsTable from './LegsTable.svelte';
    import marked from 'marked';
    import { asGeoJSON } from './exports.js';
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
        fetch('store/zomer2011.json')
        .then(response => response.json())
        .then(function (data) {
            let newState = transformFromLegacy(data);
            store.set(newState);
        });
    });

    function updateSettings() {
        store.update(state => {
            state.settings = settings;
            return state;
        });
    }

    function exportPlanner(exporter) {
        let contents = exporter(currentState);

        let tag = document.createElement('a');
        tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(contents))}`
        tag.target = '_blank';
        tag.download = 'sailplanner.geojson';
        tag.click();
    }

    function setAction(event) {
        console.log(event.type, event.detail);
        store.update(state => {
            legs[event.detail.leg][event.type] = event.detail.value;
            state.legs = legs;
            return state;
        });
    }

    function createNewLeg() {
        store.update(state => {
            legs.push({
                comment: '',
                departure: '10:00',
                edit: 'edit'
            })
            state.legs = legs;
            return state;
        })
    }

</script>
<div id="sidebar">
    <h1 id="header">Sailplanner</h1>
    <div id="comment">{@html marked(comment)}</div>
    <LegsTable on:new={createNewLeg}
               on:edit={setAction}
               on:highlight={setAction} />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="meansog">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input type="number" bind:value="{settings.average}" on:change="{updateSettings}" min="0" max="40" />&nbsp;kts<br />
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

        <button class="button" title="Various export methods" on:click={e => exportPlanner(asGeoJSON)}>Export</button>
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
