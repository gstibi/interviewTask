const navBarTemplate = document.createElement("template")
navBarTemplate.innerHTML = `
<style>
    nav {
        background-color: var(--nav-bar-background-color);
        color: var(--nav-bar-color);
        position: sticky;
        top: 0;
        width: 100%;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    li {
        float: right;
    }
      
    li a {
        display: block;
        text-align: center;
        color: white;
        padding: 14px 16px;
        text-decoration: none;
    }
      
    li a:hover {
        background-color: var(--nav-bar-background-color-hover);
    }
 
</style>

<nav>
    <ul>
        <li><a id="login" role="button">Log in</a></li>
        <li><a id="logout" role="button">Log out</a></li>
    </ul>
</nav>`

class NavBar extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"})
        shadow.append(navBarTemplate.content.cloneNode(true))
        
    }

    connectedCallback() {
        const loginButton = this.shadowRoot.getElementById("login")
        loginButton.onclick = this.loginClickHandler

        const logoutButton = this.shadowRoot.getElementById("logout")
        logoutButton.onclick = this.logoutClickHandler
    }

    loginClickHandler() {
        const modal = document.getElementById("loginModal")
        modal.style.display = "block"
    }

    logoutClickHandler() {
        sessionStorage.setItem("isUserLoggedIn", false)
        location.reload()
    }
}

customElements.define("nav-bar", NavBar)