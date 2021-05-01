<script>
import marked from 'marked';

export let content = '';
export let source = '';
export let isOpen = false;

export async function open(newSource) {
    source = newSource;
    if (source) {
        fetch(source)
            .then((response) => response.text())
            .then((text) => {
                content = text;
                isOpen = true;
            });
    } else {
        isOpen = true;
    }
}
export function close() {
    isOpen = false;
}
</script>

<div class="modal" class:hidden={!isOpen}>
    <button class="close" on:click={close}>×</button>

    <div class="modal-body">
        {@html marked(content)}
    </div>
    <div class="modal-footer"><button on:click={close} class="button">Close</button></div>
</div>

<style>
.modal {
    position: fixed;
    top: 80px;
    left: 80px;
    width: 600px;
    overflow: auto;
    background-color: white;
    border: 1px solid #888;
    padding: 15px;
    border-radius: 2px;
    box-shadow: 7px 7px 5px #888;
    z-index: 9999;
    font-size: 13px;
    line-height: 1.5em;
}
.modal-body {
    overflow-x: scroll;
    max-height: 80vh;
}
.modal-footer {
    margin-top: 5px;
}
.close {
    position: absolute;
    display: block;
    top: 4px;
    right: 6px;
    font-size: 14px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: 0;
    padding: 2px 4px;
    background-color: transparent;
}
.close:hover {
    background-color: #eee;
}
.button {
    display: block;
    float: right;
    padding: 2px;
    text-decoration: none;
    text-align: center;
    font-size: 15px;
}
</style>
