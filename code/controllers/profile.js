const db = require("../server_modules/db");

exports.getUserData = async (req, res, next) => {
    const selectQ = "SELECT * FROM users_data WHERE login = ?";
    sendProfileData(req, next, selectQ);
}

exports.getUserPosts = async (req, res, next) => {
    const selectQ = "SELECT * FROM posts WHERE login = ?";
    sendProfileData(req, next, selectQ);
}

async function sendProfileData(req, next, selectQ) {
    try{
        const login = req.login;

        if(!verifyNotNull([login])){
            console.log("No login defined");
            req.isInformation = false;
            next();
        }
        try{
            const selectLoginQ = "SELECT login FROM users WHERE login = ?";
            const resp = await db.makeQuery(selectLoginQ, login);
            const isUserExist = resp.length !== 0;

            if(isUserExist){
                const result = await db.makeQuery(selectQ, login);
                req.result = result[0];
                req.isInformation = true;
            } else {
                console.log("User is not exist or login is wrong");
                req.isInformation = false;
            }
        }catch (e){
            console.log("Problems with DB connection");
            req.isInformation = false;
        }

    } catch (e){
        console.log("Problems with req object");
        req.isInformation = false;
    }

    next();
}

function verifyNotNull(strings){
    for(let i=0; i< strings.length; i++){
        if(!strings[i])
            return false;
    }
    return true;
}
