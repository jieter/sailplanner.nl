<script>
import marked from 'marked';
import DOMPurify from 'dompurify';

import store from '../store.js';

let editing = false;

function toggleEdit() {
    editing = !editing;
}
</script>

<div id="comment">
    {@html DOMPurify.sanitize(marked($store.comment))}
    {#if editing}
        <textarea bind:value={$store.comment} />
        <button on:click={toggleEdit}>Save</button>
    {:else if $store.canEdit}
        <button class="button" on:click={toggleEdit}>
            {#if !$store.comment}Add{:else}Edit{/if}
            comment
        </button>
    {/if}
</div>
