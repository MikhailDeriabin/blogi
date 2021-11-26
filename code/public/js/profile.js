const getUserDataBtn = document.querySelector("#getUserData");
const getUserPostsBtn = document.querySelector("#getUserPosts");
const writePostBtn = document.querySelector("#writePost");

getUserDataBtn.addEventListener("click", async () => {
    const responseData = await getInformation("/profile/information");
    console.log(responseData.isInformation); //true = success, false = some error on the server side
    console.log(responseData.result);

    //TODO: display user information (it is in responseData variable)
});

getUserPostsBtn.addEventListener("click", async () => {
    const responseData = await getInformation("/profile/posts");
    console.log(responseData.isInformation); //true = success, false = some error on the server side
    console.log(responseData.result);

    //TODO: display user posts (it is in responseData variable)
});
/*
writePostBtn.addEventListener("click", async () => {
    createNewPostForm();


});

function createNewPostForm() {
    const form = document.createElement("form");
    form.action = "/profile/myposts";
    form.method = "POST";

    const nameLabel = createLabelInput("Name: ", "text", "name", "my awesome post", true);
    const submitBtn = document.createElement("button");

    submitBtn.type = "submit";

    form.appendChild(nameLabel);
    form.appendChild(submitBtn);

    document.appendChild(form);
}

function createLabelInput(txt, type, name, placeholder, isRequired) {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    if(isRequired) input.required = isRequired;

    label.innerHTML = txt + input;
    return label;
}
*/
async function getInformation(path) {
    const fetchOptions = {
        method: "GET"
    };

    const res = await fetch(path, fetchOptions);
    return await res.json();
}