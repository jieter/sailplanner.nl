
<script>
    import Map from './Map.svelte';
    import LegsTable from './LegsTable.svelte';
    import marked from 'marked';
    import { transformFromLegacy } from './legacy.js';
    import { onMount } from 'svelte';
    import { setState, subscribe, update } from './store.js';

    import './planner.css';

    let comment;
    let legs;
    let settings;

    subscribe(state => {
        comment = state.comment;
        settings = state.settings;
        legs = state.legs;
    });

    onMount(() => {
        fetch('store/zomer2011.json')
        .then(response => response.json())
        .then(function (data) {
            let newState = transformFromLegacy(data);
            setState(newState);
        });
    });

    function updateSettings() {
        update(state => {
            state.settings = settings;
            return state;
        });
    }
</script>
<div id="sidebar">
    <h1 id="header">Sailplanner</h1>
    <div id="comment">{@html marked(comment)}</div>
    <LegsTable />

    <fieldset class="settings">
        <legend>Settings</legend>
        <label for="meansog">Average <abbr title="Speed Over Ground">SOG</abbr>:</label>
        <input type="number" bind:value="{settings.average}" on:change="{updateSettings}" min="0" max="40" />&nbsp;kts<br />
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
