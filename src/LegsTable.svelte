<script>
    import { beforeUpdate } from 'svelte';
    import { formatDuration, smartRound } from './formatting.js';
    import { subscribe } from './store.js';

    let settings;
    let legs;

    subscribe(state => {
        settings = state.settings;
        legs = state.legs;
    });
    let totals = 0;

    beforeUpdate(() => {
        let dog = legs.map(leg => leg.dog).reduce((a, b) => a + b, 0);
        if (isNaN(dog) || dog == 0) {
            totals = {dog: 0, ttg: 0};
        } else {
            totals = {
                dog: smartRound(dog),
                ttg: formatDuration(dog / settings.average)
            }
        }
    });
    function departure(time) {
        let hours, minutes;
        [hours, minutes] = time.split(':');

		return +hours + (+minutes / 60, 1);
	};
</script>

<table id="legs" class="zebra">
    <tr>
        <th class="start" title="Time of departure">Start</th>
        <th class="comment">Comment</th>
        <th class="dog" title="Distance over ground [NM]">DOG</th>
        <th class="ttg" title="Time to go">TTG</th>
        <th class="eta" title="Estimated time of arrival">ETA</th>
        <th class="color"></th>
    </tr>
    {#each legs as leg}
        <tr>
            <td class="start">{leg.departure}</td>
            <td class="comment">{leg.comment}</td>
            <td class="dog">{smartRound(leg.dog)}</td>
            <td class="ttg">{formatDuration(leg.dog / settings.average)}</td>
            <td class="eta">{formatDuration((leg.dog / settings.average) + departure(leg.departure))}</td>
            <td class="color" style="background-color: {leg.color};">&nbsp;</td>
        </tr>
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
</table>
