<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let leg = {};

</script>

<fieldset class="settings">
    <legend>Edit leg</legend>
    <label for="edit-comment">Comment:</label>
    <input type="text" class="wide" bind:value="{leg.comment}">
    <br>

    <label for="edit-departure">Departure:</label>
    <input type="text" bind:value="{leg.departure}"><br>

    <!-- <label for="submit"><a class="knop" id="leg-delete">delete</a></label> -->

    <button class="button" on:click={e => dispatch('save', {})}>Save leg</button>
</fieldset>
