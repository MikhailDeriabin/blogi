const db = require("./db");

const handleRegistration = async (credentials) => {
    const login = credentials.login;
    const password = credentials.password;

    //-1 = problems with DB, 0 = OK, 1 = user already exists
    try{
        const selectLoginQ = "SELECT login FROM users WHERE login = ?";
        const resp = await db.makeQuery(selectLoginQ, login);
        const isUserExist = resp.length !== 0;

        if(!isUserExist){
            const insertUserQ = "INSERT INTO users (login, password) VALUES (?, ?)";
            const resp = await db.makeQuery(insertUserQ, [login, password]);
            return resp.affectedRows === 1 ? 0 : -1;
        } else {
            return 1;
        }
    } catch (e){
        console.log("No connection to the DB or problems with query");
        return -1;
    }
}

module.exports.handleRegistration = handleRegistration;