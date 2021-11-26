const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    res.render("index", {
        isLogged: true,
        user: req.user
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;