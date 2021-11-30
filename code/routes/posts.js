const express = require("express");
const {searchPost} = require("../controllers/posts");

const router = express.Router();

router.get("/", searchPost, (req, res) => {
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