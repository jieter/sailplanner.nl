<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let leg = {};

</script>

<fieldset class="settings">
    <legend>Edit leg</legend>

    <label>Comment:</label>
    <input type="text" class="wide" bind:value="{leg.comment}">
    <br>

    <label>Departure:</label>
    <input type="text" bind:value="{leg.departure}"><br>

    <label><button on:click={e => dispatch('delete', {})}>Delete</button></label>

    <button class="button" on:click={e => dispatch('save', {})}>Save leg</button>
</fieldset>
