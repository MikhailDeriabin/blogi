const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    res.render("index", {
        user: req.user
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
    //console.log(req.message);

    //if previous function passed data about user = user is logged in
    if(req.user){
        res.render("profile", {
            user: req.user
        });
    } else{
        res.render("login", {
            message: "Please login first"
        });
    }

});

module.exports = router;