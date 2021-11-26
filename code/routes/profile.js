const express = require("express");
const authController = require("../controllers/auth");
const profileController = require("../controllers/profile")

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    //console.log(req.message);

    //if previous function passed data about user = user is logged in
    const user = req.user;
    if(user){
        res.render("profile", {
            user: user
        });
    } else{
        res.render("login", {
            message: "Please login first"
        });
    }
});

router.get("/information", authController.getLogin, profileController.getUserData, (req, res) => {
    if(req.isInformation){
        res.json({
            isInformation: true,
            user: req.user
        });
    } else{
        res.json({
            isInformation: false
        });
    }
    res.end();
});

module.exports = router;