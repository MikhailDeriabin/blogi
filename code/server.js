const express = require('express');
const path = require("path");

const routes = require("./server_modules/routes");

//For generating links in console
const htmlFiles = ["login.html", "register.html"];

const app = express();
routes.router(app);

app.use(express.static(path.join(__dirname, "public")));

app.listen(8081, () => {
    displayLinks();
});

function displayLinks(){
    console.log();
    console.log("----------------------");
    for(let i=0; i<htmlFiles.length; i++){
        const name = htmlFiles[i].split(".")[0].toUpperCase();
        console.log(name + ": http://localhost:8081/" + htmlFiles[i]);
    }
    console.log("----------------------");
    console.log();
}