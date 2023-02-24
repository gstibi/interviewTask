const IS_USER_LOGGED_IN = "isUserLoggedIn"

const renderOneComment = (commentId, commentObj, formattedDate) => {
    
    // Attach data to slots
    const timestampSlot = document.createElement("span")
    timestampSlot.innerText = formattedDate
    timestampSlot.setAttribute("slot", "timestamp")

    const commentTextSlot = document.createElement("slot")
    commentTextSlot.innerText = commentObj.comment
    commentTextSlot.setAttribute("slot", "commenttext")

    // Create new comment field and append slots and Id
    const newComment = document.createElement("comment-field")
    newComment.id = commentId
    newComment.append(commentTextSlot, timestampSlot)

    // Append new comment to desired place in comments container
    if(commentObj.depth === 1){
        // Comments with out parent are just added to the bottom
        const commentsContainer = document.getElementById("commentsContainer")
        commentsContainer.appendChild(newComment)

    } else {
        // Children with parent are appended to parents childcomment slot
        const parentComment = document.getElementById(commentObj.parentId)

        const commentSlot = document.createElement("div")
        commentSlot.appendChild(newComment)
        commentSlot.setAttribute("slot", "childcomment")

        parentComment.appendChild(commentSlot)
    }
    
}

const renderComments = () => {
    // Sort all comments so that oldest are on top
    const commentsIds = Object.keys(localStorage)
    commentsIds.sort((a, b) => a - b)
    
    // Render all comments
    commentsIds.forEach((commentId) => {
        const commentObj = JSON.parse(localStorage.getItem(commentId))
        const formattedDate = new Date(parseInt(commentId)).toLocaleString()
        
        renderOneComment(commentId, commentObj, formattedDate)
    })
}

const getJSON = async () => {
    const response = await fetch("words.json");
    const json = await response.json();

    const formattedWords = json.words.map((word) => word.toLocaleLowerCase())

    return formattedWords
}

const includesInappropriateWords = async (comment) => {
    // Get list of words to check and search comment
    const words = await getJSON()

    const formattedComment = comment.split(" ").join("").toLocaleLowerCase()

    const wordsIncluded = words.some((word) => {
        return formattedComment.includes(word)
    })

    return wordsIncluded
}

const addCommentToLocalStorage = async (event, parentId = "") => {
    // Ask for login
    const isUserLoggedIn = sessionStorage.getItem(IS_USER_LOGGED_IN)
    if(isUserLoggedIn === 'false'){
        const modal = document.getElementById("loginModal")
        modal.style.display = "block"
        return
    }

    // Ask for a comment
    const comment = prompt("Write your comment")

    if(comment === null || comment === ""){
        return
    }

    const containsInappropriateWords = await includesInappropriateWords(comment)
    
    if(containsInappropriateWords) {
        const modal = document.getElementById("inappropriateWordsModal")
        modal.style.display = "block"
        return
    }
    

    // Check depth of a parent. If there is no parent, default depth of new comment is 1
    const parentDepth = JSON.parse(localStorage.getItem(parentId))?.depth || 0
    const depth = parentDepth + 1

    // Create new entry in localstorage
    const id = Date.now()

    const data = {
        comment,
        parentId,
        depth
    }
    localStorage.setItem(id, JSON.stringify(data))

    // Reload page so new comments will appear
    location.reload()
}

const setupInappropriateWordsModal = (modalId) => {

    const modal = document.getElementById(modalId)
    const span = document.getElementById(`closeDialog-${modalId}`)

    // When the user clicks on (x), close the modal
    span.onclick = function(){
        modal.style.display = "none"
    }
}

const handleLogin = (event) => {
    event.preventDefault()

    const storedPwd = sessionStorage.getItem(event.target.name.value)

    if(storedPwd === event.target.password.value){
        sessionStorage.setItem(IS_USER_LOGGED_IN, true)
    }

    location.reload()
}

const setupLoginForm = () => {
    const form = document.getElementById("loginForm");
    form.addEventListener('submit', handleLogin);
}



window.onload = (event) => {

    // Initialize login
    if(sessionStorage.getItem(IS_USER_LOGGED_IN) === null){
        sessionStorage.setItem(IS_USER_LOGGED_IN, false)
        sessionStorage.setItem("admin", 123)
    }
    
    // Initialize modals
    const modalIds = ["inappropriateWordsModal", "loginModal"]
    modalIds.forEach((modalId) => setupInappropriateWordsModal(modalId))

    setupLoginForm()
    
    renderComments()
}




