const express = require('express');
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

//For generating links in console
const htmlFiles = ["login", "register", "profile"];

const app = express();

//make automatic routing
app.use(express.static(path.join(__dirname, "public")));
//For getting date of any form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));

app.listen(8081, () => {
    displayLinks();
});

function displayLinks(){
    console.log();
    console.log("----------------------");
    console.log("ROOT: http://localhost:8081/");
    for(let i=0; i<htmlFiles.length; i++){
        const name = htmlFiles[i].split(".")[0].toUpperCase();
        console.log(name + ": http://localhost:8081/" + htmlFiles[i]);
    }
    console.log("----------------------");
    console.log();
}