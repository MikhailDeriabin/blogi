const express = require("express");
const {searchPost} = require("../controllers/posts");
const { query } = require("express-validator");

const router = express.Router();

router.get("/", [
    query("name").optional({checkFalsy: true}).trim().escape(),
    query("author").optional({checkFalsy: true}).trim().escape(),
    query("start").optional({checkFalsy: true}).trim().escape().isDate(),
    query("end").optional({checkFalsy: true}).trim().escape().isDate(),
], searchPost, (req, res) => {
    if(req.isSuccess){
        res.json({
            isSuccess: true,
            result: req.result
        });
    } else{
        res.json({
            isSuccess: false
        });
        console.log("Query was not successful");
    }
    res.end();
});

module.exports = router;