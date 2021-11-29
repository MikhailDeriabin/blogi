const getUserDataBtn = document.querySelector("#getUserData");
const getUserPostsBtn = document.querySelector("#getUserPosts");
const writePostBtn = document.querySelector("#writePost");
const userUIDiv = document.querySelector("#userUI");
const makeRequestBtn = document.querySelector("#makeRequest");

getUserDataBtn.addEventListener("click", async () => {
    const responseData = await getInformation("/profile/information");
    console.log(responseData.isSuccess); //true = success, false = some error on the server side
    console.log(responseData.result);

    //TODO: display user information (it is in responseData variable) or inform about error (responseData.isSuccess)

});

getUserPostsBtn.addEventListener("click", async () => {
    const responseData = await getInformation("/profile/myposts");
    console.log(responseData.isSuccess); //true = success, false = some error on the server side
    console.log(responseData.result);

    //TODO: display user posts (it is in responseData variable) or inform about error (responseData.isSuccess)

});

writePostBtn.addEventListener("click", async () => {
    createNewPostForm();
});

makeRequestBtn.addEventListener("click", async () => {
    //Examples of REST use:
    //const resp = await getInformation("/profile/myposts/11"); 11 - post id

    //const updateObj = {id: 11, name: "another change", content: "some new text"};
    //const resp = await updateInformation("/profile/myposts/11", updateObj); 11 - post id

    //const resp = await deletePost(11); 11 - post id

    //const resp = await getInformation("/profile/information/name"); name - user property(name, email etc. see DB or registration form)

    const updateObj = {value: "Andrew"};
    const resp = await updateInformation("/profile/information/name", updateObj);
    console.log(resp);
});

function createNewPostForm() {
    const form = document.createElement("form");
    const nameLabel = createLabelInput("Name: ", "text", "name", "my awesome post", false);
    const contentLabel = createLabelTextarea("", "content", 10, 70, "Content of your post", false);
    const submitBtn = document.createElement("button");

    submitBtn.type = "submit";
    submitBtn.textContent = "Create a new post!";

    form.appendChild(nameLabel);
    form.appendChild(contentLabel);
    form.appendChild(submitBtn);

    userUIDiv.appendChild(form);

    submitBtn.addEventListener("click", async (evt) => {
        evt.preventDefault();
        const postName = form.querySelector("input[type='text']").value;
        const postContent = form.querySelector("textarea").value;
        const dataObj = {
            name: postName,
            content: postContent
        }

        //true = everything ok, false = something wrong(not saved to DB)
        const responseData = await createPost(dataObj);
        console.log(responseData.isSuccess);

        //TODO: inform user was post saved or not. It can be found from responseData.isSuccess, see console

    });
}

function createLabelTextarea(txt, name, rows, cols, placeholder, isRequired) {
    const label = document.createElement("label");
    const textarea = document.createElement("textarea");

    textarea.name = name;
    textarea.rows = rows;
    textarea.cols = cols;
    textarea.placeholder = placeholder;
    if(isRequired) textarea.required = isRequired;

    label.for = name;
    label.textContent = txt;
    label.appendChild(textarea);
    return label;
}

function createLabelInput(txt, type, name, placeholder, isRequired) {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    if(isRequired) input.required = isRequired;

    label.for = name;
    label.textContent = txt;
    label.appendChild(input);
    return label;
}

async function getInformation(path) {
    const fetchOptions = {
        method: "GET"
    };
    try{
        const res = await fetch(path, fetchOptions);
        return await res.json();
    }catch(e){
        console.log(e);
        return {};
    }
}

async function createPost(data) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    try{
        const res = await fetch("/profile/myposts", fetchOptions);
        return await res.json();
    }
    catch(e){
        //if something wrong with cookies = probably user is not authorized
        console.log(e);
        window.location.href = "/login";
    }
}

async function updateInformation(path, data) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    try{
        const res = await fetch(path, fetchOptions);
        return await res.json();
    }
    catch(e){
        //if something wrong with cookies = probably user is not authorized
        console.log(e);
        window.location.href = "/login";
    }
}

async function deletePost(id) {
    const fetchOptions = {
        method: "DELETE"
    };
    try{
        const res = await fetch(`/profile/myposts/${id}`, fetchOptions);
        return await res.json();
    }
    catch(e){
        //if something wrong with cookies = probably user is not authorized
        console.log(e);
        window.location.href = "/login";
    }
}