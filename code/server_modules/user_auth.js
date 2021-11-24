const db = require("./db");

const handleAuthentication = async (credentials) => {
    const login = credentials.login;
    const password = credentials.password;

    // -1 = problems with DB, 0 = OK, 1 = user does not exists, 2 = password is wrong//-1 = problems with DB, 0 = OK, 1 = user already exists
    try{
        const selectLoginQ = "SELECT login FROM users WHERE login = ?";
        const resp = await db.makeQuery(selectLoginQ, login);
        const isUserExist = resp.length !== 0;

        if(isUserExist){
            const selectUserQ = "SELECT login FROM users WHERE login = ? AND password = ?";
            const resp = await db.makeQuery(selectUserQ, [login, password]);
            return resp.length === 1 ? 0 : 2;
        } else {
            return 1;
        }
    } catch (e){
        console.log("No connection to the DB or problems with query");
        return -1;
    }
}

module.exports.handleAuthentication = handleAuthentication;