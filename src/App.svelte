<script>
import Map from './components/Map.svelte';
import Polyline from './components/Polyline.svelte';
import LegsTable from './components/LegsTable.svelte';
import Modal from './components/Modal.svelte';
import Url from './components/Url.svelte';
import Comment from './components/Comment.svelte';

import { asGeoJSON, asGPX, asKML } from './exports.js';
import { onMount } from 'svelte';
import store from './store.js';

import './planner.css';

let url;
let modal;

const modals = [
    ['prose/about.md', 'About / FAQ'],
    ['prose/quickstart.md', 'Quickstart'],
    ['prose/howto.md', 'Howto'],
];

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
    GeoJSON: asGeoJSON,
    GPX: asGPX,
    KML: asKML,
};

function exportPlanner(format) {
    const contents = exportFormats[format]($store, url);

    let tag = document.createElement('a');
    tag.href = `data:text/json;charset=utf-8,${encodeURIComponent(contents)}`;
    tag.target = '_blank';
    tag.download = `sailplanner.${format.toLowerCase()}`;
    tag.click();
}

$: {
    // console.log($store.isDirty);
    url = window.location.origin + window.location.pathname + '#' + $store.key;
}
</script>

<div id="sidebar">
    <h1>
        Sailplanner
        {#if $store.created}
            <small
                title="Created: {$store.created.substring(0, 16)} Last modified: {$store.modified.substring(0, 16)}"
            >{$store.created.substring(0, 10)}</small>
        {/if}
    </h1>
    <Comment />
    <LegsTable />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="average">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input name="average" type="number" bind:value={$store.settings.average} min="0" max="40" />&nbsp;kts<br />
    </fieldset>

    <fieldset class="settings">
        <legend>Sharing &amp; editing</legend>

        {#if $store.legacyUrl}
            <Url label="Legacy URL:" url={$store.legacyUrl}>
                {#if !$store.canEdit}
                    <p>
                        This is a legacy planner. Use the 'Copy' button below to transfer it to the current version. It
                        will receive a new url.
                    </p>
                {/if}
            </Url>
        {/if}
        {#if $store.key}
            <Url label="Read only URL:" {url} />
            {#if $store.authToken}
                <Url label="Editable URL:" url={`${url}|${$store.authToken}`} />
            {/if}
        {/if}
        {#if $store.legs.length > 0}
            <button class="button" title="Start over..." on:click={store.reset}>New</button>
            <button class="button" title="Copy this planner..." on:click={store.fork}>Copy</button>

            <button class="button dropdown" title="Various export methods">
                Export
                <div class="formats">
                    {#each Object.keys(exportFormats) as format}
                        <div class="button" on:click={(e) => exportPlanner(format)}>{format}</div>
                    {/each}
                </div>
            </button>
            {#if $store.canEdit}
                <button class="button pull-right" title="Save state planner to the server..." on:click={save}>
                    {#if !$store.isDirty}<span color="green">✓</span>{/if}
                    Save
                </button>
            {/if}
        {:else}
            <p>Start by adding your first leg.</p>
        {/if}
    </fieldset>

    <div class="links">
        {#each modals as [contents, label]}<button on:click={(e) => showModal(contents)}>{label}</button> |&nbsp;{/each}
        <a href="https://github.com/jieter/sailplanner.nl" target="_new">GitHub</a>
    </div>
    <div id="disclaimer">
        <h5>Disclaimer</h5>
        Altough I'm trying to provide a functional Sailplanner at all time, Sailplanner is provided
        <strong>as is</strong>, no guarantee can be made whatsoever.<br />
        Sailplanner is designed for planning purposes only and should not be used as a navigation aid.
    </div>

    <Modal bind:this={modal} />
</div>
<Map>
    {#each $store.legs as leg (leg)}
        <Polyline bind:leg />
    {/each}
</Map>

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
