import * as pPost from "./modules/profile_post.js";
import * as pData from "./modules/profile_data.js";

const getUserDataBtn = document.querySelector("#getUserData");
const getUserPostsBtn = document.querySelector("#getUserPosts");
const writePostBtn = document.querySelector("#writePost");
const userUIDiv = document.querySelector("#userUI");
const makeRequestBtn = document.querySelector("#makeRequest");

getUserDataBtn.addEventListener("click", async () => {
    const responseData = await pData.readAllData();
    console.log(responseData);

    //TODO: display user information (it is in responseData variable) or inform about error (responseData.isSuccess)

});

getUserPostsBtn.addEventListener("click", async () => {
    const allPosts = await pPost.readAllPosts();
    console.log(allPosts);

    //TODO: display user posts (it is in responseData variable) or inform about error (responseData.isSuccess)

});

writePostBtn.addEventListener("click", async () => {
    createNewPostForm();
});

makeRequestBtn.addEventListener("click", async () => {
    //CRUD examples:
    //isSuccess field shows was operation successful or not,
    //in case then server can not define user or he is not logged in user will be redirected to login page

    //Posts:
    //const resp = await pPost.createPost("my new post", "text text");
    //const resp = await pPost.readPostById(13);
    //const resp = await pPost.updatePostById(12, "some name", "some content");
    //const resp = await pPost.deletePostById(12);

    //User personal data:
    //const resp = await pData.readPropertyByName("email");
    const resp = await pData.updatePropertyByName("email", "batman1@gmail.com");
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

        //true = everything ok, false = something wrong(not saved to DB)
        const responseData = await pPost.createPost(postName, postContent);
        console.log(responseData);

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