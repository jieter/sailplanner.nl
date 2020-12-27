<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let leg = {};

    const colors = [
        '#ff0000',
        '#ffbf00',
        '#ffff00',
        '#ffffff',
        '#999999',
        '#000000',
        '#006e2e',
        '#00ff00',
        '#7fffd4',
        '#0000ff',
        '#4b0082',
        '#ff00ff'
    ];

    function checkColor(hex) {
        const rgb = parseInt(hex.substring(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 90 ? 'white' : 'black';
    }
    const setColor = (color) => () => { leg.color = color; };
</script>

<fieldset class="settings">
    <legend>Edit leg</legend>

    <label for="comment">Comment:</label>
    <input type="text" class="wide" bind:value="{leg.comment}" name="comment">
    <br>

    <label for="departure">Departure:</label>
    <input type="text" bind:value="{leg.departure}" name="departure"><br>

    <label for="color">Color</label>
    <div style="width: 102px; float: left;" name="color">
        {#each colors as color}
            <div style="background-color: {color}; color: {checkColor(color)} " class:checked="{leg.color == color}" class="color" on:click={setColor(color)}>
                {#if leg.color == color}
                    ✓
                {/if}
            </div>
        {/each}
    </div>
    <br>

    <label><button on:click={e => dispatch('delete', {})}>Delete</button></label>

    <button class="button" on:click={e => dispatch('save', {})}>Save leg</button>
</fieldset>

<style>
    .color {
        float: left;
        width: 13px;
        height: 13px;
        cursor: pointer;
        overflow: hidden;
        border: 1px solid #666666;
        margin: 1px;
        text-align: center;

    }
</style>
