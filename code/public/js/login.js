const loginInput = document.querySelector("#login"),
    passwordInput = document.querySelector("#password"),
    enterBtn = document.querySelector("#enter"),
    resultDiv = document.querySelector("#result");

enterBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    tryEnter();
});

async function tryEnter() {
    const userLogin = loginInput.value;
    const userPassword = passwordInput.value;
    if((userLogin && userPassword) !== null && (userLogin && userPassword) !== ""){
        const userData = {
            login: userLogin,
            password: userPassword
        };

        const response = await sendData(userData);
        let loginStatus = 0;
        try{
            const responseObj = await response.json();
            // -1 = problems with DB, 0 = OK(should not come), 1 = user does not exists, 2 = password is wrong
            loginStatus = responseObj.loginStatus;
            showLoginResult(loginStatus);
        } catch(e){
            //if json did not arrived, then server send page to this address
            window.location.href = response.url;
        }
    }
    //TODO: handle wrong inputs
}

function sendData(data) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    return fetch("/auth", fetchOptions);
}

function showLoginResult(status){
    if(status === -1)
        resultDiv.textContent = "Problems with connection, try again later";
    else if(status === 1)
        resultDiv.textContent = "Login is wrong, check your input";
    else if(status === 2)
        resultDiv.textContent = "Password is wrong, check your input";
}
