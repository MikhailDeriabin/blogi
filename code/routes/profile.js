const express = require("express");
const authController = require("../controllers/auth");
const profileController = require("../controllers/profile")

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
    //console.log(req.message);

    //if previous function passed data about user = user is logged in
    const result = req.result;
    if(result){
        res.render("profile", {
            result: result
        });
    } else{
        res.render("login", {
            message: "Please login first"
        });
    }
});

router.get("/information", authController.getLogin, profileController.getUserData, (req, res) => {
    sendDataToClient(req, res);
});

router.get("/posts", authController.getLogin, profileController.getUserPosts, (req, res) => {
    sendDataToClient(req, res);
});

function sendDataToClient(req, res) {
    if(req.isInformation){
        res.json({
            isInformation: true,
            result: req.result
        });
    } else{
        res.json({
            isInformation: false
        });
    }
    res.end();
}

module.exports = router;