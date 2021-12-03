const express = require("express");
const authController = require("../controllers/auth");
const profileController = require("../controllers/profile");
const { param, body} = require("express-validator");

const router = express.Router();

//User profile entry point
router.get("/", authController.isLoggedIn, (req, res) => {
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
router.post("/myposts", authController.isLoggedIn, [
    body("name", "Name must be at least 3 symbols long").trim().escape().isLength({min: 3}),
    body("name", "Name can not be empty").notEmpty({ignore_whitespace: true}),
    body("content").trim()
], profileController.createPost, (req, res) => {
    sendQueryStatus(req, res);
});

router.get("/myposts/:id", authController.getLogin, [
    param("id", "id must be an integer").trim().isInt(),
], profileController.getUserPost, (req, res) => {
    sendDataToClient(req, res);
});

router.put("/myposts/:id", authController.isLoggedIn, [
    param("id", "id must be an integer").trim().isInt(),
    body("name", "Name must be at least 3 symbols long").trim().escape().isLength({min: 3}),
    body("name", "Name can not be empty").notEmpty({ignore_whitespace: true}),
    body("content").trim()
], profileController.updateUserPost, (req, res) => {
    sendQueryStatus(req, res);
});

router.delete("/myposts/:id", authController.isLoggedIn,  [
    param("id", "id must be an integer").trim().isInt(),
], profileController.deleteUserPost, (req, res) => {
    sendQueryStatus(req, res);
});

//User personal data CRUD (reading and updating only)
router.get("/information/:property", authController.getLogin, [
    param("property", "Property can not contain special characters").blacklist(" =<>$|+?,!{}").escape(),
], profileController.getUserProperty, (req, res) => {
    sendDataToClient(req, res);
});

router.put("/information/:property", authController.isLoggedIn, [
    param("property", "Property can not contain special characters").blacklist(" =<>$|+?,!{}").escape(),
    body("value", "Name can not contain special characters").trim().blacklist("=<>$+?,!{}").escape()
], profileController.updateUserProperty, (req, res) => {
    sendQueryStatus(req, res);
});

function sendDataToClient(req, res) {
    if(req.isSuccess){
        res.json({
            isSuccess: true,
            result: req.result
        });
    } else if(req.errors){
        res.json({
            isSuccess: false,
            errors: req.errors
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
    } else if(req.errors){
        res.json({
            isSuccess: false,
            errors: req.errors
        });
    } else {
        res.json({
            isSuccess: req.isSuccess
        });
    }
    res.end();
}

module.exports = router;