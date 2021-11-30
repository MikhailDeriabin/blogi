const db = require("../server_modules/db");

exports.searchPost = async (req, res, next) => {
    try{
        const searchName = req.query.name;
        const searchAuthor = req.query.author;

        if(searchName){
            await searchAndSendResult(req, "name", searchName);
        } else if(searchAuthor){
            await searchAndSendResult(req, "login", searchAuthor);
        } else{
            console.log("No name or author defined");
            req.isSuccess = false;
        }
    }catch(e){
        console.log(e);
        console.log("Problems with req object");
        req.isSuccess = false;
    }

    next();
}

async function searchAndSendResult(req, field, searchWord) {
    try{
        let selectQ = "SELECT name, content, date, login FROM posts WHERE name LIKE ?";
        if(field === "login")
            selectQ = "SELECT name, content, date, login FROM posts WHERE login LIKE ?";

        const result = await db.makeQuery(selectQ, `${searchWord}%`);
        req.isSuccess = true;
        req.result = result;
    }catch(e){
        console.log(e);
        console.log("Problems with DB");
        req.isSuccess = false;
    }
}