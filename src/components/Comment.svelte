<script>
import marked from 'marked';
import DOMPurify from 'dompurify';

import { options, canEdit } from '../store.js';

let editing = false;

function toggleEdit() {
    editing = !editing;
}
</script>

<div id="comment">
    {@html DOMPurify.sanitize(marked($options.comment))}
    {#if editing}
        <textarea bind:value={$options.comment} />
        <button on:click={toggleEdit}>Save</button>
    {:else if $canEdit}
        <button class="button" on:click={toggleEdit}>
            {#if !$options.comment}Add{:else}Edit{/if}
            comment
        </button>
    {/if}
</div>
