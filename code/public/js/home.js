const resultDiv = document.querySelector("#result");

window.addEventListener("load", async () => {
    const fetchOptions = {
        method: "GET"
    };

    //TODO: get logged user name
    const response = await fetch("/user", fetchOptions);
    const responseObj = await response.json();

    resultDiv.textContent = "Your login should be " + responseObj.login;
});