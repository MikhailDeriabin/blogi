const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    if(req.result){
        res.render("index", {
            isLogged: true,
            result: req.result
        });
    } else {
        res.render("index", {
            isLogged: false
        });
    }

});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;