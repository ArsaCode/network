document.addEventListener("DOMContentLoaded", function() {
    loadview();
    document.querySelector("#navallposts").addEventListener("click", () => loadview);
    document.querySelector("#postform").addEventListener("submit", () => postForm(event));
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function loadview() {
    document.querySelector("#viewcontainer").textContent = ""
    const xhr = new XMLHttpRequest()
    const method = 'GET'
    const url = `/restapi/posts`
    xhr.responseType = 'json'
    xhr.open(method, url)
    xhr.onload = () => {
        const serverResponse = xhr.response
        console.log(serverResponse)
        var postslist = serverResponse
        for (var i = 0; i < postslist.length; i++) {
            renderPost(postslist[i])
        }
        document.querySelectorAll('#viewcontainer button').forEach(item => {
            item.addEventListener('click', () => {
                const action = event.target.id
                handleBtn(event, action)
            })
        });
    }
    xhr.send()
}
        
function renderPost(post) {
    const postDiv = document.createElement("div")
    postDiv.className = "card bg-primary my-3 mx-3"
    const postTitle = document.createElement("h5")
    postTitle.className = "card-header text-white"
    const postContent = document.createElement("div")
    postContent.className = "card-body bg-light"
    const postFooter = document.createElement("div")
    postFooter.id = `footerid${post.id}`
    postFooter.className = "card-footer bg-primary text-white"
    postFooter.textContent = `${post.likes.length} likes - Posted on ${post.timestamp}`
    postTitle.textContent = `@${post.author} posted :`
    const postContentP = document.createElement("p")
    postContentP.id = `postcontent${post.id}`
    postContentP.textContent = post.content
    postContent.appendChild(postContentP)
    renderBtn(post, postContent, 'primary', 'like')
    renderBtn(post, postContent, 'danger', 'delete')
    renderBtn(post, postContent, 'warning', 'edit')
    postDiv.appendChild(postTitle)
    postDiv.appendChild(postContent)
    postDiv.appendChild(postFooter)
    document.querySelector("#viewcontainer").appendChild(postDiv)
}
        
function renderBtn(post, div, btncolor, btntype) {
    const newBtn = document.createElement("button")
    newBtn.id = `${btntype}btn`
    newBtn.dataset.postid = post.id
    newBtn.className = `btn btn-${btncolor} mx-2`
    newBtn.textContent = `${btntype.charAt(0).toUpperCase() + btntype.slice(1)}`
    div.appendChild(newBtn)
}

function postForm(event) {
    event.preventDefault()
    const myForm = event.target
    const myFormData = new FormData(myForm)
    const xhr = new XMLHttpRequest()
    const method = "POST"
    const url = "/restapi/posts"
    xhr.responseType = 'json'
    xhr.open(method, url)
    xhr.onload = () => {
        if (xhr.status === 201) {
            const serverResponse = xhr.response
            console.log(serverResponse)
            loadview();
            myForm.reset()
        }
        else if (xhr.status === 400) {
            const errorMsg = xhr.response.content
            console.log(errorMsg)
            alert(errorMsg)
        }
        else if (xhr.status === 401) {
            const errorMsg = xhr.response.error
            alert(errorMsg)
        }
    }
    xhr.send(myFormData)
}
        
function handleBtn(event, action) {
    if (action === "likebtn") {
        const xhr = new XMLHttpRequest()
        const method = "PUT"
        const url = `/restapi/post/${event.target.dataset.postid}/like`
        xhr.responseType = 'json'
        xhr.open(method, url)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        const csrftoken = getCookie('csrftoken');
        xhr.setRequestHeader("X-CSRFToken", csrftoken)
        xhr.onload = () => {
            const serverResponse = xhr.response
            console.log(serverResponse)
            document.querySelector(`#footerid${serverResponse.id}`).textContent = `${serverResponse.likes.length} likes - Posted on ${serverResponse.timestamp}`
        }
        xhr.send()
    }

    else if (action === "deletebtn") {
        const xhr = new XMLHttpRequest()
        const method = "DELETE"
        const url = `/restapi/post/${event.target.dataset.postid}`
        xhr.responseType = 'json'
        xhr.open(method, url)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        const csrftoken = getCookie('csrftoken');
        xhr.setRequestHeader("X-CSRFToken", csrftoken)
        xhr.onload = () => {
            if (xhr.status === 403) {
                const serverResponse = xhr.response
                alert(serverResponse.error)
            }
            else {
                const serverResponse = xhr.response
                alert(serverResponse.message)
                loadview();
            }
        }
        xhr.send()
    }

    else if (action === "editbtn") {
        const newTextArea = document.createElement("textarea")  
        const postBody = document.querySelector(`#postcontent${event.target.dataset.postid}`)
        newTextArea.className = "form-control mb-2"
        newTextArea.name = "content"
        newTextArea.value = postBody.textContent
        postBody.parentNode.replaceChild(newTextArea, postBody)
        event.target.id = `confirmeditbtn${event.target.dataset.postid}`
        event.target.className = "btn btn-success mx-2"
        event.target.textContent = "Confirm edit"
        document.querySelector(`#confirmeditbtn${event.target.dataset.postid}`).addEventListener("click", () => {
            const xhr = new XMLHttpRequest()
            const method = "PUT"
            const url = `/restapi/post/${event.target.dataset.postid}`
            xhr.responseType = 'json'
            xhr.open(method, url)
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
            const csrftoken = getCookie('csrftoken');
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const serverResponse = xhr.response
                    console.log(serverResponse)
                    loadview();
                }
                else {
                    const serverResponse = xhr.response
                    alert(serverResponse.content)
                    loadview();
                }
            }
            xhr.send(JSON.stringify({"content": newTextArea.value}))
        })
    }
}