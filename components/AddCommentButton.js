const addCommentButtonTemplate = document.createElement("template")
addCommentButtonTemplate.innerHTML = `
<link rel="stylesheet" type="text/css" href="main.css">

<style>

    #addCommentButton {
        background-color: #FFFFFF;
        color: #DE5050;
        padding: 10px;
        margin: 10px;
        font-family: "Lucida Handwriting";
        font-size: 18px;
    }

    #addCommentButton:hover {
        background-color: #DE5050;
        color: #FFFFFF;
    }

</style>

<button id="addCommentButton">Add comment</button>
`

class AddCommentButton extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(addCommentButtonTemplate.content.cloneNode(true))
    }

    connectedCallback() {
        // set button click handler
        const button = this.shadowRoot.getElementById("addCommentButton");
        button.onclick = addCommentToLocalStorage
    }

}

customElements.define("add-comment-button", AddCommentButton)