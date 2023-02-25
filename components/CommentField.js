const commentFieldTemplate = document.createElement("template")

// Use <Link> to get col-* classes to shadow DOM
commentFieldTemplate.innerHTML = `
<link rel="stylesheet" type="text/css" href="main.css">

<style>

    .comment {
        margin: 10px;
        padding: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #DCDCDC;
    }

    .align-right {
        float: right;
    }

    .reply {
        background-color: #FFFFFF;
        color: #00325A;
        padding: 5px 10px;
        font-family: "Lucida Handwriting";
        font-size: 18px;
    }

    .reply:hover {
        background-color: #00325A;
        color: #FFFFFF;
    }

    .timestamp {
        color: #00325A;
        font-size: small;
    }

    .subtree {
        width: 95%;
        min-width: 40vw;
    }

</style>

<div>
    <div class="row comment">
        <div class="col-9">
            <slot name="commenttext">Default comment text</slot>
        </div>
        <div class="col-3">
            
            <div class="row">
                <div class="col-12">
                    <span class="align-right">
                        <slot name="userName" class="timestamp">Default name</slot>
                    </span>
                </div>

                <div class="col-12">
                    <span class="align-right">
                        <slot name="timestamp" class="timestamp">cas</slot>
                    </span>
                </div>

                <div class="col-12">
                    <span class="align-right">
                        <button class="reply" id="reply">Reply</button>
                    </span>
                </div>
            </div>

        </div>
    </div>

    <div class="subtree">
        <slot name="childcomment"></slot>
    </div>
</div>
`

class CommentField extends HTMLElement {
    constructor() {
        super()
        
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(commentFieldTemplate.content.cloneNode(true))
    }

    connectedCallback() {
        // set button click handler
        const button = this.shadowRoot.getElementById("reply")
        
        button.onclick = (event) => {
            addCommentToLocalStorage(event, this.id)
        }
    }
}

customElements.define("comment-field", CommentField)