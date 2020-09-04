
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

    let state;
    let canEdit = true;
    let comment;
    let legs;
    let settings;

    let modal;

    store.subscribe(s => {
        state = s;
        comment = s.comment;
        settings = s.settings;
        legs = s.legs;
    });

    onMount(() => {
        if (window.location.hash == '') {
            showModal('prose/quickstart.md');
        } else {
            let key = window.location.hash.substring(1);
            console.log(key);
            const headers = {};
            if (key.indexOf('|') > 0) {
                let authKey;
                [key, authKey] = key.split('|');
                headers['Authorization'] = `basic ${authKey}`;
            }

            fetch(`store.php?key=${key}`, {headers: headers})
                .then(response => {
                    if (response.status == 404) {
                        return fetch(`http://sailplanner.nl/getLegs/key:${key}`)
                            .then(response => response.json())
                            .then(data => transformFromLegacy(data))
                    } else {
                        return response.json();
                    }
                })
                .then(function (data) {
                    store.set(data);
                    canEdit = data.authKey !== undefined;
                    console.log(data.settings);
                });
        }
    });

    function fork() {
        store.fork();
        canEdit = true;
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
        const contents = exportFormats[format](state);

        let tag = document.createElement('a');
        tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`
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

        {#if state.legacyUrl}
            <div>
                <strong>Legacy URL:</strong>
                {#if !canEdit}
                    <p>
                        This is a legacy planner. Use the 'Copy' button below to transfer it to the current version.
                        It will receive a new url.
                    </p>
                {/if}
                <Url url={state.legacyUrl} />
            </div>
        {/if}
        {#if state.key}
            <div>
                <strong>Read only URL:</strong> <Url url={state.url} />
            </div>
            {#if canEdit}
                <div>
                    <strong>Editable URL:</strong> <Url url={state.editUrl} />
                </div>
            {/if}
        {/if}

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
            <button class="button pull-right" title="Save state planner to the server..." on:click={store.save}>Save</button>
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
