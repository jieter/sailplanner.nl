<script>
import { beforeUpdate } from 'svelte';

import LegEditor from './LegEditor.svelte';
import store from '../store.js';
import { formatDuration, smartRound } from '../formatting.js';

let totals;

beforeUpdate(() => {
    let dog = $store.legs.map((leg) => leg.dog).reduce((a, b) => a + b, 0);
    if (isNaN(dog) || dog == 0) {
        totals = { dog: 0, ttg: 0 };
    } else {
        totals = {
            dog: smartRound(dog),
            ttg: formatDuration(dog / $store.settings.average),
        };
    }
});

function departure(time) {
    let hours, minutes;
    [hours, minutes] = time.split(':');

    return +hours + +minutes / 60;
}

function highlight(index, value) {
    return () => {
        let leg = $store.legs[index];
        leg.highlight = value;
        $store.legs = $store.legs;
    };
}
function edit(index) {
    return () => {
        if ($store.canEdit) {
            let leg = $store.legs[index];
            leg.edit = leg.edit === 'edit' ? 'save' : 'edit';
            $store.legs = $store.legs;
        }
    };
}
function deleteLeg(index) {
    const legs = $store.legs;
    legs.splice(index, 1);
    $store.legs = legs;
}
</script>

<table class="legs-table">
    <tr>
        <th class="start" title="Time of departure">Start</th>
        <th class="comment">Comment</th>
        <th class="dog" title="Distance over ground [NM]">DOG</th>
        <th class="ttg" title="Time to go">TTG</th>
        <th class="eta" title="Estimated time of arrival">ETA</th>
        <th class="color" />
    </tr>
    {#each $store.legs as leg, index (leg)}
        <tr on:mouseenter={highlight(index, true)} on:mouseleave={highlight(index, false)} on:click={edit(index)}>
            <td class="start">{leg.departure}</td>
            <td class="comment">{leg.comment}</td>
            {#if leg.dog > 0}
                <td class="dog">{smartRound(leg.dog)}</td>
                <td class="ttg">{formatDuration(leg.dog / $store.settings.average)}</td>
                <td class="eta">{formatDuration(leg.dog / $store.settings.average + departure(leg.departure))}</td>
                <td class="color" style="background-color: {leg.color};">&nbsp;</td>
            {:else}
                <td colspan="3">—</td>
                <td />
            {/if}
        </tr>
        {#if $store.canEdit && leg.edit === 'edit'}
            <td colspan="5">
                <LegEditor bind:leg on:save={edit(index)} on:delete={() => deleteLeg(index)} />
            </td>
        {/if}
    {/each}
    {#if totals.dog > 0}
        <tr>
            <td colspan="2"><strong>Total:</strong></td>
            <td>{totals.dog}</td>
            <td>{totals.ttg}</td>
            <td />
            <td />
        </tr>
    {/if}
    {#if $store.canEdit}
        <tr>
            <td colspan="5" class="empty"><button class="button" on:click={store.createLeg}>Create leg</button></td>
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
