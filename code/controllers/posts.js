const db = require("../server_modules/db");
const {validationResult} = require("express-validator");

/**
 * This function searches for all posts, based on query.
 * In case then client querying with name(name="user name") of posts or author(author="some author"), it will pass forward all past which name or author(= writer login) starts with specified value.
 * Also client can querying for posts created in specific date frame: starting from ending to (start="2021-03-01"&end="2021-03-12"), only starting from(start="2021-03-01") or only ending on(end="2021-03-12").
 * Function also prints helpful hints to server console in case of problems.
 * Operation status is true if query was successful, user is logged and no problems with Internet or database connection was occurred, if it is false the opposite.
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @param next next function for passing data forward
 * @returns Promise nothing, but passes forward object with operation status(isSuccess) and result array or only operation status if right parameter was not provided
 */
exports.searchPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
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
            }else if(!searchName && !searchAuthor && !startDate && !endDate){
                console.log("No name, author or date defined");
                req.isSuccess = false;
            }
        }catch(e){
            console.log(e);
            console.log("Problems with req object");
            req.isSuccess = false;
        }
    } else{
        console.log("Query parameters are wrong");
        req.isSuccess = false;
    }

    next();
}

/**
 * Function queries with name(name="user name") of posts or author(author="some author"), it will pass forward all pasts which name or author(= writer login) starts with specified value.
 * Function also prints helpful hints to server console in case of problems.
 * @param req request object from the previous function
 * @param field {string} name or author
 * @param searchWord {string} search word
 * @returns Promise nothing, but passes forward object with operation status(isSuccess boolean) and result array or only operation status if right parameter was not provided
 */
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

/**
 * Function searches for posts created in specific date frame: starting from ending to (start="2021-03-01"&end="2021-03-12"), only starting from(start="2021-03-01") or only ending on(end="2021-03-12").
 * Function also prints helpful hints to server console in case of problems.
 * @param req request object from the previous function
 * @param start {date} starting date
 * @param end {date} ending date
 * @returns Promise nothing, but passes forward object with operation status(isSuccess boolean) and result array or only operation status if right parameter was not provided
 */
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