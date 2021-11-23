const mysql = require("mysql");
const util = require("util");

const dbConfig = {
    host: "localhost",
    user: "user",
    password: "user",
    database: "blog"
};

const makeQuery = async (sqlQuery , params) => {
    const con = mysql.createConnection(dbConfig);
    const query = util.promisify(con.query).bind(con);

    try {
        if(params !== null)
            return await query(sqlQuery, params);
        else
            return await query(sqlQuery);
    } catch(err){
        console.log("Error during getting data from DB:");
        console.log(err);
    } finally {
        con.end();
    }
}

module.exports.makeQuery = makeQuery;