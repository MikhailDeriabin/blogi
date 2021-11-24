const express = require("express");
const session = require("express-session");
//const path = require("path");

const registration = require("./user_registration");
const auth = require("./user_auth");
const userInfo = require("./user_info");

const router = (app) => {
    app.use(express.json({limit : "10mb"}));
    app.use(session({
        secret: "stop hacking",
        resave: true,
        saveUninitialized: true
    }));

    app.post("/new-user", async (req, res) => {
        const result = await registration.handleRegistration(req.body);
        const respObj = {
            regStatus: result
        }
        res.json(respObj);
        res.end();
    });

    app.post("/auth", async (req, res) => {
        const result = await auth.handleAuthentication(req.body);

        if(result === 0){
            const login = req.body.login;
            req.session.isLogged = true;
            req.session.login = login;
            res.redirect("/home.html");
        } else{
            const respObj = {
                loginStatus: result
            }
            res.json(respObj);
        }

        res.end();
    });

    app.get("/user", async (req, res) => {
        if(req.session.isLogged){
            const login = req.session.login;
            const result = await userInfo.getUserInfo(login);
            res.json(result);
        } else {
            res.send("Please, login first");
        }
        res.end();
    });

}
/*
function sendFile(res, name){
    const fileLocation = path.resolve(name);
    console.log(fileLocation);
    res.sendFile(fileLocation);
}
 */

module.exports.router = router;