<script>
import Map from './components/Map.svelte';
import Polyline from './components/Polyline.svelte';
import LegsTable from './components/LegsTable.svelte';
import Modal from './components/Modal.svelte';
import Url from './components/Url.svelte';
import Comment from './components/Comment.svelte';
import Disclaimer from './components/Disclaimer.svelte';
import Exports from './components/Exports.svelte';

import { onMount } from 'svelte';
import { legs, options, canEdit, isDirty, load, persist, reset, fork } from './store.js';

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
    load(key, authToken);
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
    let hash = await persist();

    if (hash) {
        window.location.hash = hash;
    }
}

function showModal(source) {
    modal.open(source);
}

$: {
    url = window.location.origin + window.location.pathname + '#' + $options.key;
}
</script>

<div id="sidebar">
    <h1>
        Sailplanner
        {#if $options.created}
            <small
                title="Created: {$options.created.substring(0, 16)} Last modified: {$options.modified.substring(0, 16)}"
                >{$options.created.substring(0, 10)}</small
            >
        {/if}
    </h1>
    <Comment />
    <LegsTable />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="average">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input name="average" type="number" bind:value={$options.settings.average} min="0" max="40" />&nbsp;kts<br />
    </fieldset>

    <fieldset class="settings">
        <legend>Sharing &amp; editing</legend>

        {#if $options.legacyUrl}
            <Url label="Legacy URL:" url={$options.legacyUrl}>
                {#if !$canEdit}
                    <p>
                        This is a legacy planner. Use the 'Copy' button below to transfer it to the current version. It
                        will receive a new url.
                    </p>
                {/if}
            </Url>
        {/if}
        {#if $options.key}
            <Url label="Read only URL:" {url} />
            {#if $options.authToken}
                <Url label="Editable URL:" url={`${url}|${$options.authToken}`} />
            {/if}
        {/if}
        {#if $legs.length > 0}
            <button class="button" title="Start over..." on:click={reset}>New</button>
            <button class="button" title="Copy this planner..." on:click={fork}>Copy</button>

            <Exports {legs} {options} {url} />
            {#if $canEdit}
                <button class="button pull-right" title="Save state planner to the server..." on:click={save}>
                    {#if !$isDirty}<span color="green">✓</span>{/if}
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
    <Disclaimer />

    <Modal bind:this={modal} />
</div>
<Map>
    {#each $legs as leg (leg)}
        <Polyline bind:leg />
    {/each}
</Map>

<style>
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
