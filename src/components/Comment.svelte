<script>
    import marked from 'marked';
    import DOMPurify from 'dompurify';

    export let comment;
    export let canEdit = false;

    let editing = false;

    function toggleEdit() {
        editing = !editing;
    }
</script>

<div id="comment">
    {@html DOMPurify.sanitize(marked(comment))}
    {#if editing}
        <textarea bind:value={comment}></textarea>
        <button on:click={toggleEdit}>Save</button>
    {:else if canEdit}
        <button class="button" on:click={toggleEdit}>
            {#if !comment}
                Add
            {:else}
                Edit
            {/if} comment
        </button>
    {/if}
</div>
