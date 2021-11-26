const db = require("../server_modules/db");

exports.getUserData = async (req, res, next) => {
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
                const selectAllQ = "SELECT * FROM users_data WHERE login = ?";
                const result = await db.makeQuery(selectAllQ, login);
                req.user = result[0];
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
