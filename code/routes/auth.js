const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");

const router = express.Router();

router.post("/register", [
    body("login", "Login can contain only letters and numbers and be at least 3 symbols long").isAlphanumeric().isLength({min: 3}),
    body("login", "Login can not be empty").notEmpty({ignore_whitespace: true}),
    body("password", "Password must contain at least 8 characters").blacklist(" ").isLength({min: 8}),
    body("password", "Password can not be empty").notEmpty({ignore_whitespace: true}),
    body("name", "Name can contain only letters").optional({checkFalsy: true}).isAlpha('en-US', {ignore: " "}),
    body("email", "Email must be in example@mail.com format").optional({checkFalsy: true}).blacklist(" ").escape().isEmail(),
    body("phone", "Phone must be 6-14 numbers long").optional({checkFalsy: true}).blacklist(" ").escape().isLength({min: 6, max: 14}),
    body("hobbies", "Hobbies field can contain only letters, numbers and ,").optional({checkFalsy: true}).escape()
], authController.register);

router.post("/login", [
    body("login", "Wrong login").isAlphanumeric().isLength({min: 3}),
    body("password", "Wrong password").blacklist(" ").notEmpty({ignore_whitespace: true})
], authController.login);
router.get("/logout", authController.logout);
module.exports = router;