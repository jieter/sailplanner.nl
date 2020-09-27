
<script>
    import Map from './Map.svelte';
    import Polyline from './Polyline.svelte';
    import LegsTable from './LegsTable.svelte';
    import Modal from './Modal.svelte';
    import Url from './Url.svelte';
    import Comment from './Comment.svelte';


    import { asGeoJSON, asGPX, asKML } from './exports.js';
    import { onMount } from 'svelte';
    import store from './store.js';

    import './planner.css';

    let state;
    let comment;
    let legs;
    let settings;
    let canEdit;

    let url;
    let modal;

    store.subscribe(s => {
        state = s;
        comment = s.comment;
        settings = s.settings;
        legs = s.legs;
        canEdit = s.authToken || s.authToken === null;
    });

    async function loadFromHash() {
        let key = window.location.hash.substring(1);
        let authToken;

        if (key == '') {
            return;
        }

        const headers = {};
        if (key.indexOf('|') > 0) {
            [key, authToken] = key.split('|');
        }
        store.load(key, authToken);
    }

    onMount(() => {
        if (window.location.hash == '') {
            if (localStorage.getItem('quickstart-shown') != 'yes') {
                showModal('prose/quickstart.md');
                localStorage.setItem('quickstart-shown', 'yes');
            }
        } else {
            loadFromHash();
        }
        window.onhashchange = loadFromHash;
    });

    function fork() {
        store.fork();
        window.location.hash = '';
    }

    async function save() {
        let hash = await store.save();

        if (hash) {
            window.location.hash = hash;
        }
    }

    function showModal(source) {
        modal.open(source);
    }

    const exportFormats = {
        'GeoJSON': asGeoJSON,
        'GPX': asGPX,
        'KML': asKML
    };
    function exportPlanner(format) {
        const contents = exportFormats[format](state, url);

        let tag = document.createElement('a');
        tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`;
        tag.target = '_blank';
        tag.download = `sailplanner.${format.toLowerCase()}`;
        tag.click();
    }

    function setAction(event) {
        store.update(s => {
            legs[event.detail.leg][event.type] = event.detail.value;
            s.legs = legs;
            return s;
        });
    }

    $: {
        url = window.location.origin + window.location.pathname + '#' + state.key;
    }
</script>
<div id="sidebar">
    <h1 id="header">Sailplanner
        {#if state.created}
            <small title="Created: {state.created.substring(0, 16)} Last modified: {state.modified.substring(0, 16)}">{state.created.substring(0, 10)}</small>
        {/if}
    </h1>
    <Comment comment={comment} canEdit={canEdit} />
    <LegsTable on:new={e => store.createLeg()}
               on:edit={setAction}
               on:highlight={setAction}
               on:delete={setAction}
               canEdit={canEdit} />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="average">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input name="average" type="number" bind:value="{settings.average}" on:change="{e => store.updateSettings(settings)}" min="0" max="40" />&nbsp;kts<br />
    </fieldset>

    <fieldset class="settings">
        <legend>Sharing &amp; editing</legend>

        {#if state.legacyUrl}
            <Url label="Legacy URL:" url={state.legacyUrl}>
                {#if !canEdit}
                    <p>
                        This is a legacy planner. Use the 'Copy' button below to transfer it to the current version.
                        It will receive a new url.
                    </p>
                {/if}
            </Url>
        {/if}
        {#if state.key}
            <Url label="Read only URL:" url={url} />
            {#if state.authToken}
                <Url label="Editable URL:" url={`${url}|${state.authToken}`} />
            {/if}
        {/if}
        {#if legs.length > 0}
            <button class="button" title="Start over..." on:click={store.reset}>New</button>
            <button class="button" title="Copy this planner..." on:click={fork}>Copy</button>

            <button class="button dropdown" title="Various export methods">
                Export
                <div class="formats">
                    {#each Object.keys(exportFormats) as format}
                        <div class="button" on:click={e => exportPlanner(format)}>{format}</div>
                    {/each}
                </div>
            </button>
            {#if canEdit}
                <button class="button pull-right" title="Save state planner to the server..." on:click={save}>Save</button>
            {/if}
        {:else}
            <p>
                Start by adding your first leg.
            </p>
        {/if}

    </fieldset>

    <div class="links">
        <button on:click={e => showModal('prose/about.md')}>About / FAQ</button> |
        <button on:click={e => showModal('prose/quickstart.md')}>Quickstart</button> |
        <button on:click={e => showModal('prose/howto.md')}>Howto</button> |
        <a href="https://github.com/jieter/sailplanner.nl" target="_new">GitHub</a>
    </div>
    <div id="disclaimer">
        <h5>Disclaimer</h5>
        Altough I'm trying to provide a functional Sailplanner at all time,
        Sailplanner is provided <strong>as is</strong>, no guarantee can be made whatsoever.<br>
        Sailplanner is designed for planning purposes only and should not be used as a navigation aid.
    </div>

    <Modal bind:this={modal} />

</div>
<Map>
    {#each legs as leg (leg)}
        <Polyline leg={leg} />
    {/each}
</Map>

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

    .links button {
        display: inline;
        border: 0;
        background-color: transparent;
        color: #069;
        padding: 0;
        cursor: pointer;
        text-decoration: underline;
    }
    h1 small {
        color: #bbb;
        float: right;
    }
</style>
