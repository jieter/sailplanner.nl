<script>
    export let label;
    export let url;

    let input;

    function copy() {
        input.select();
        input.setSelectionRange(0, 99999);

        document.execCommand('copy');
    }
</script>

<div>
    <strong>{label}</strong>
    <slot></slot>
    <input type="text" class="url" value="{url}" on:click={copy} bind:this={input} />
    <a href="{url}" class="button" target="_blank" title="Open in new tab.">⤤</a>
</div>


<style>
    .url {
        font-size: 10px;
        width: 90%;
        padding: 2px 4px;
        background-color: #ffffc1;
        border: 1px solid #bbb;
        text-align: left;
        margin-bottom: 4px;
    }
</style>
