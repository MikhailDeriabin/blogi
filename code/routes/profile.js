const express = require("express");
const authController = require("../controllers/auth");
const profileController = require("../controllers/profile")

const router = express.Router();

//User profile entry point
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

router.get("/myposts", authController.getLogin, profileController.getUserPosts, (req, res) => {
    sendDataToClient(req, res);
});

//User post CRUD
router.post("/myposts", authController.isLoggedIn, profileController.createPost, (req, res) => {
    sendQueryStatus(req, res);
});

router.get("/myposts/:id", authController.getLogin, profileController.getUserPost, (req, res) => {
    sendDataToClient(req, res);
});

router.put("/myposts/:id", authController.isLoggedIn, profileController.updateUserPost, (req, res) => {
    sendQueryStatus(req, res);
});

router.delete("/myposts/:id", authController.isLoggedIn, profileController.deleteUserPost, (req, res) => {
    sendQueryStatus(req, res);
});

//User personal data CRUD (reading and updating only)
router.get("/information/:property", authController.getLogin, profileController.getUserProperty, (req, res) => {
    sendDataToClient(req, res);
});

router.put("/information/:property", authController.isLoggedIn, profileController.updateUserProperty, (req, res) => {
    sendQueryStatus(req, res);
});

function sendDataToClient(req, res) {
    if(req.isSuccess){
        res.json({
            isSuccess: true,
            result: req.result
        });
    } else{
        res.json({
            isSuccess: false
        });
    }
    res.end();
}

function sendQueryStatus(req, res){
    if(req.logout){
        res.redirect("/auth/logout");
    } else{
        res.json({
            isSuccess: req.isSuccess
        });
    }
    res.end();
}

module.exports = router;