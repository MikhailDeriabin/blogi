const db = require("../server_modules/db");

exports.getUserData = async (req, res, next) => {
    const selectQ = "SELECT * FROM users_data WHERE login = ?";
    sendProfileData(req, next, selectQ);
}

exports.getUserPosts = async (req, res, next) => {
    const selectQ = "SELECT * FROM posts WHERE login = ?";
    sendProfileData(req, next, selectQ);
}

exports.createPost = async (req, res, next) => {
    if(!req.result){
        console.log("User is not logged in");
        req.isSuccess = false;
        req.logout = true;
    } else{
        try{
            const login = req.result.login;
            const name = req.body.name;
            const content = req.body.content;

            if(!verifyNotNull([login, name])){
                console.log("No login or name defined");
                req.isSuccess = false;
                req.logout = false;
            } else{
                try{
                    const insertQ = "INSERT INTO posts (name, content, login) VALUES(?, ?, ?)";
                    const result = await db.makeQuery(insertQ, [name, content, login]);
                    if(result.affectedRows === 1){
                        req.isSuccess = true;
                        req.logout = false;
                    } else {
                        req.isSuccess = false;
                        req.logout = false;
                    }
                }catch (e){
                    console.log("Problems with DB connection");
                    req.isSuccess = false;
                    req.logout = false;
                }
            }
        }catch(e){
            console.log("Problems with req object");
            req.isSuccess = false;
            req.logout = false;
        }
    }

    next();
}

async function sendProfileData(req, next, selectQ) {
    try{
        const login = req.login;

        if(!verifyNotNull([login])){
            console.log("No login defined");
            req.isSuccess = false;
            next();
        }
        try{
            const selectLoginQ = "SELECT login FROM users WHERE login = ?";
            const resp = await db.makeQuery(selectLoginQ, login);
            const isUserExist = resp.length !== 0;

            if(isUserExist){
                req.result = await db.makeQuery(selectQ, login);
                req.isSuccess = true;
            } else {
                console.log("User is not exist or login is wrong");
                req.isSuccess = false;
            }
        }catch (e){
            console.log("Problems with DB connection");
            req.isSuccess = false;
        }

    } catch (e){
        console.log("Problems with req object");
        req.isSuccess = false;
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
