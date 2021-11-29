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
    try{
        const values = Object.values(req.body);
        const insertQ = "INSERT INTO posts (name, content, login) VALUES(?, ?, ?)";
        if(values){
            changeDBRow(req, res, next, insertQ, values);
            return;
        } else{
            console.log("No values or id defined");
            setChangeDBRowUnsuccessful(req);
        }
    }catch(e){
        console.log("Problems with req object");
        setChangeDBRowUnsuccessful(req);
    }

    next();
}

exports.getUserPost = (req, res, next) => {
    const postId = req.params.id;
    const selectQ = "SELECT * FROM posts WHERE (login = ? AND id = ?)";
    sendProfileData(req, next, selectQ, postId);
}

exports.updateUserPost = async (req, res, next) => {
    try {
        const postId = req.body.id;
        delete req.body.id;
        const values = req.body;
        const updateQ = "UPDATE posts SET ? WHERE id = ? AND login = ?";
        if(values && postId){
            changeDBRow(req, res, next, updateQ, [values, postId]);
            return;
        } else{
            console.log("No values or id defined");
            setChangeDBRowUnsuccessful(req);
        }
    }catch(e){
        console.log("Problems with req object");
        setChangeDBRowUnsuccessful(req);
    }

    next();
}

exports.deleteUserPost = (req, res, next) => {
    try {
        const postId = req.params.id;
        const deleteQ = "DELETE FROM posts WHERE id = ?";
        if(postId){
            changeDBRow(req, res, next, deleteQ, [postId]);
            return;
        } else{
            console.log("No id defined");
            setChangeDBRowUnsuccessful(req);
        }
    }catch(e){
        console.log("Problems with req object");
        setChangeDBRowUnsuccessful(req);
    }

    next();
}

exports.getUserProperty = (req, res, next) => {
    const property = req.params.property;
    const selectQ = `SELECT ${property} FROM users_data WHERE (login = ?)`;
    sendProfileData(req, next, selectQ, property);
}

exports.updateUserProperty = async (req, res, next) => {
    try {
        const property = req.params.property;
        const value = req.body.value;
        const updateQ = `UPDATE users_data SET ${property} = ? WHERE login = ?`;
        if(property && value){
            changeDBRow(req, res, next, updateQ, [value]);
            return;
        } else{
            console.log("No value or id defined");
            setChangeDBRowUnsuccessful(req);
        }
    }catch(e){
        console.log("Problems with req object");
        setChangeDBRowUnsuccessful(req);
    }

    next();
}

async function sendProfileData(req, next, selectQ, param) {
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

            let params = [login];
            if(param){
                params.push(param);
            }

            if(isUserExist){
                req.result = await db.makeQuery(selectQ, params);
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

async function changeDBRow(req, res, next, sqlQ, params) {
    if(!req.result){
        console.log("User is not logged in");
        req.isSuccess = false;
        req.logout = true;
    } else{
        try{
            const login = req.result.login;
            if(!verifyNotNull([params, login])){
                console.log("No login or values defined");
                setChangeDBRowUnsuccessful(req);
                next();
            }
            params.push(login);

            const result = await db.makeQuery(sqlQ, params);
            if(result.affectedRows === 1){
                req.isSuccess = true;
                req.logout = false;
            } else {
                setChangeDBRowUnsuccessful(req);
            }
        }catch (e){
            console.log("Problems with DB connection or req object");
            console.log(e);
            setChangeDBRowUnsuccessful(req);
        }
    }

    next();
}

function verifyNotNull(elems){
    for(let i=0; i< elems.length; i++){
        if(!elems[i])
            return false;
    }
    return true;
}

function setChangeDBRowUnsuccessful(req) {
    req.isSuccess = false;
    req.logout = false;
}
