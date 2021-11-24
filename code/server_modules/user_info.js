const db = require("./db");

const getUserInfo = async (login) => {

    try{
        const selectLoginQ = "SELECT login FROM users WHERE login = ?";
        const response = await db.makeQuery(selectLoginQ, login);
        return await response[0];
    } catch (e){
        console.log("No connection to the DB or problems with query");
        return {};
    }
}

module.exports.getUserInfo = getUserInfo;