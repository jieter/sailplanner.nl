
<script>
    import Map from './Map.svelte';
    import LegsTable from './LegsTable.svelte';
    import Modal from './Modal.svelte';
    import Url from './Url.svelte';

    import marked from 'marked';
    import DOMPurify from 'dompurify';
    import { asGeoJSON, asGPX, asKML } from './exports.js';
    import { transformFromLegacy } from './legacy.js';
    import { onMount } from 'svelte';
    import store from './store.js';

    import './planner.css';

    let currentState;
    let key;
    let authKey;
    let canEdit = true;
    let comment;
    let legs;
    let settings;

    let modal;

    store.subscribe(state => {
        currentState = state;
        comment = state.comment;
        settings = state.settings;
        legs = state.legs;
    });

    onMount(() => {
        if (window.location.hash == '') {
            showModal('prose/quickstart.md');
        } else {
            key = window.location.hash.substring(1);
            const headers = {};
            if (key.indexOf('|') > 0) {
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

                    canEdit = data.authKey !== undefined;
                    console.log(canEdit, data);
                });
        }
    });

    async function save() {
        let url = '/store/';
        let headers = {};

        if (authKey) {
            url = `store/${key}.json`
            headers['Authorization'] = `basic ${authKey}`;
        }
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });
        if (response.status == 200) {
            let data = await response.json();
            store.set(data);
            authKey = data.authKey;
        } else {
            // Error!

        }
    }

    function showModal(source) {
        modal.open(source);
        modal.open();
    }

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
    <div id="comment">{@html DOMPurify.sanitize(marked(comment))}</div>
    <LegsTable on:new={e => store.createLeg()}
               on:edit={setAction}
               on:highlight={setAction}
               on:delete={setAction}
               canEdit={canEdit} />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="meansog">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input type="number" bind:value="{settings.average}" on:change="{e => store.updateSettings(settings)}" min="0" max="40" />&nbsp;kts<br />
    </fieldset>

    <fieldset class="settings">
        <legend>Sharing &amp; editing</legend>

        {#if currentState.legacyUrl}
            <div>
                <strong>Legacy URL:</strong> <Url url={currentState.legacyUrl} />
            </div>
        {/if}
        {#if currentState.key}
            <div>
                <strong>Read only URL:</strong> <Url url={currentState.url} />
            </div>
            {#if canEdit}
                <div>
                    <strong>Editable URL:</strong> <Url url={currentState.editUrl} />
                </div>
            {/if}
        {/if}

        <button class="button" title="Start over..." on:click={store.reset}>New</button>

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
    </fieldset>

    <div id="other">
        <a href="#" on:click={e => showModal('prose/about.md')}>About / FAQ</a> |
        <a href="#" on:click={e => showModal('prose/quickstart.md')}>Quickstart</a> |
        <a href="#" on:click={e => showModal('prose/howto.md')}>Howto</a>
    </div>
    <div id="disclaimer">
        <h5>Disclaimer</h5>
        Altough I'm trying to provide a functional Sailplanner at all time,
        Sailplanner is provided <strong>as is</strong>, no guarantee can be made whatsoever.<br>
        Sailplanner is designed for planning purposes only and should not be used as a navigation aid.
    </div>

    <Modal bind:this={modal} />

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
