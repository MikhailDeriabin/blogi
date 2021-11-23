const loginInput = document.querySelector("#login"),
    passwordInput = document.querySelector("#password"),
    registerBtn = document.querySelector("#register"),
    resultDiv = document.querySelector("#result");

registerBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    tryRegister();
});

async function tryRegister() {
    const userLogin = loginInput.value;
    const userPassword = passwordInput.value;
    if((userLogin && userPassword) !== null && (userLogin && userPassword) !== ""){
        const userData = {
            login: userLogin,
            password: userPassword
        };

        const response = await fetchData(userData);
        const responseObj = await response.json();
        // -1 = problems with DB, 0 = OK, 1 = user already exists
        const regStatus = responseObj.regStatus;
        showRegResult(regStatus);
    }
    //TODO: handle wrong inputs
}

function fetchData(data) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    return fetch("/new-user", fetchOptions);
}

function showRegResult(status){
    if(status === -1)
        resultDiv.textContent = "User profile was not created: problems with DB";
    else if(status === 1)
        resultDiv.textContent = "User already exists, try another login";
    else if(status === 0)
        resultDiv.textContent = "User account was created";
}