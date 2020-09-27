<script>
    import { beforeUpdate, createEventDispatcher } from 'svelte';
    import { formatDuration, smartRound } from './formatting.js';
    import { subscribe, update } from './store.js';
    import LegEditor from './LegEditor.svelte';

    const dispatch = createEventDispatcher();
    export let canEdit = false;

    let settings;
    let legs;
    let totals;

    subscribe(state => {
        settings = state.settings;
        legs = state.legs;
    });

    beforeUpdate(() => {
        let dog = legs.map(leg => leg.dog).reduce((a, b) => a + b, 0);
        if (isNaN(dog) || dog == 0) {
            totals = {dog: 0, ttg: 0};
        } else {
            totals = {
                dog: smartRound(dog),
                ttg: formatDuration(dog / settings.average)
            };
        }
    });

    function departure(time) {
        let hours, minutes;
        [hours, minutes] = time.split(':');

        return +hours + (+minutes / 60);
    }

    function edit(leg, i) {
        return e => {
            if (canEdit) {
                dispatch('edit', {leg: i, value: leg.edit === 'edit' ? 'save' : 'edit'});
            }
        };
    }
</script>

<table class="legs-table">
    <tr>
        <th class="start" title="Time of departure">Start</th>
        <th class="comment">Comment</th>
        <th class="dog" title="Distance over ground [NM]">DOG</th>
        <th class="ttg" title="Time to go">TTG</th>
        <th class="eta" title="Estimated time of arrival">ETA</th>
        <th class="color"></th>
    </tr>
    {#each legs as leg, i (leg)}
        <tr on:mouseenter={e => dispatch('highlight', {leg: i, value: true})}
            on:mouseleave={e => dispatch('highlight', {leg: i, value: false})}
            on:click={edit(leg, i)}
        >
            <td class="start">{leg.departure}</td>
            <td class="comment">{leg.comment}</td>
            {#if leg.dog > 0}
                <td class="dog">{smartRound(leg.dog)}</td>
                <td class="ttg">{formatDuration(leg.dog / settings.average)}</td>
                <td class="eta">{formatDuration((leg.dog / settings.average) + departure(leg.departure))}</td>
                <td class="color" style="background-color: {leg.color};">&nbsp;</td>
            {:else}
                <td colspan="4"></td>
            {/if}
        </tr>
        {#if leg.edit === 'edit' && canEdit}
            <td colspan="5">
                <LegEditor {leg}
                           on:save={e => dispatch('edit', {leg: i, value: 'save'})}
                           on:delete={e => dispatch('delete', {leg: i, value: true})}
                />
            </td>
        {/if}
    {/each}
    {#if legs.length > 0}
        <tr>
            <td colspan="2"><strong>Total:</strong></td>
            <td>{totals.dog}</td>
            <td>{totals.ttg}</td>
            <td></td>
            <td></td>
        </tr>
    {/if}
     {#if canEdit}
        <tr>
            <td colspan="5" class="empty">
                <button class="button" on:click={e => dispatch('new')}>Create leg</button>
            </td>
        </tr>
    {/if}
</table>

<style>
    .legs-table {
        border-collapse: collapse;
        font-size: 10px;
        width: 300px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }

    .legs-table th {
        border-bottom: 1px solid #ccc;
        padding: 5px 2px 2px 2px;
        background-color: #eee;
        border-right: 1px solid #ddd;
    }

    .legs-table tr td,
    .legs-table tfoot tr td {
        padding-left: 2px;
        padding-right: 2px;
        text-align: right;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        vertical-align: top;
    }

    .legs-table th.comment,
    .legs-table td.comment {
        text-align: left;
        width: 140px;
    }

    .legs-table th:last-child,
    .legs-table td:last-child {
        border-right: 0px;
    }
    .legs-table .empty {
        text-align: center;
        padding: 10px 10px;
    }
</style>
