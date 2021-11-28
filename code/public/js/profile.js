const getUserDataBtn = document.querySelector("#getUserData");
const getUserPostsBtn = document.querySelector("#getUserPosts");
const writePostBtn = document.querySelector("#writePost");
const userUIDiv = document.querySelector("#userUI");

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

function createNewPostForm() {
    const form = document.createElement("form");
    const nameLabel = createLabelInput("Name: ", "text", "name", "my awesome post", true);
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
        const responseData = await postInformation("/profile/myposts", dataObj);
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

    const res = await fetch(path, fetchOptions);
    return await res.json();
}

async function postInformation(path, data) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    const res = await fetch(path, fetchOptions);
    try{
        return await res.json();
    }
    catch(e){
        //if something wrong with cookies = probably user is not authorized
        console.log(e);
        window.location.href = "/login";
    }
}