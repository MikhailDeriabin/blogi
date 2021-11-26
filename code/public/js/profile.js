const getUserDataBtn = document.querySelector("#getUserData");

getUserDataBtn.addEventListener("click", async () => {
    const userData = await getInformation("/profile/information");
    console.log(userData);

    //TODO: display user information (it is in userData variable)
});

async function getInformation(path) {
    const fetchOptions = {
        method: "GET"
    };

    const res = await fetch(path, fetchOptions);
    return await res.json();
}