const db = require("../server_modules/db");

exports.searchPost = async (req, res, next) => {
    try{
        const searchName = req.query.name;
        const searchAuthor = req.query.author;

        const startDate = req.query.start;
        const endDate = req.query.end;

        if(searchName){
            await searchAndSendResult(req, "name", searchName);
        } else if(searchAuthor){
            await searchAndSendResult(req, "login", searchAuthor);
        } if(startDate || endDate){
            await searchByDateAndSendResult(req, startDate, endDate);
        }else{
            console.log("No name, author or date defined");
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

async function searchByDateAndSendResult(req, start, end) {
    try{
        const {q, params} = determineDateSelectQuery(start, end);
        const result = await db.makeQuery(q, params);
        req.isSuccess = true;
        req.result = result;
    }catch(e){
        console.log(e);
        console.log("Problems with DB");
        req.isSuccess = false;
    }
}

function determineDateSelectQuery(start, end) {
    let selectQ = "SELECT name, content, date, login FROM posts";
    let params = [];

    start = start ? addTimePart(start) : "";
    end = end ? addTimePart(end) : "";

    if (start && end){
        selectQ = "SELECT name, content, date, login FROM posts WHERE date BETWEEN ? AND ?";
        params = [start, end];
    } else if(start) {
        selectQ = "SELECT name, content, date, login FROM posts WHERE date >= ?";
        params = [start];
    }else if(end) {
        selectQ = "SELECT name, content, date, login FROM posts WHERE date <= ?";
        params = [end];
    }
    return {
        q: selectQ,
        params: params
    };
}

function addTimePart(date) {
    return date + "T00:00:00.000Z";
}