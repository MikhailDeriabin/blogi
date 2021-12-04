const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const { validationResult } = require("express-validator");

const db = require("../server_modules/db");


/**
 * Function registers new user to the users and users_data databases
 * It requires at least login and password fields, which must be sent in request's body as object: {login: "user login", password: "user password"}
 * As optional parameters can be added also name, email, phone and hobbies
 * All data must be string-type
 * Function also print helpful hints to server console in case of problems
 * If everything was ok, user will be redirected to the profile page, if not error message will be displayed under registration form in browser
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @returns {Promise} nothing if succeed or error message
 */
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const {login, password, name, email, phone, hobbies} = req.body;

            const selectLoginQ = "SELECT login FROM users WHERE login = ?";
            const resp = await db.makeQuery(selectLoginQ, login);
            const isUserExist = resp.length !== 0;

            if(!isUserExist){
                let hashedPassword = await bcrypt.hash(password, 8);
                const insertUserQ = "INSERT INTO users (login, password) VALUES (?, ?)";
                db.makeQuery(insertUserQ, [login, hashedPassword]).then(() => {
                    const insertUserDataQ = "INSERT INTO users_data (name, email, phone, hobbies, login) VALUES (?, ?, ?, ?, ?)";
                    db.makeQuery(insertUserDataQ, [name, email, phone, hobbies, login]);
                    createAccessCookie(login, res);
                    return res.status(200).redirect("/profile");
                });
            } else {
                return res.render("register", {
                    message: "That login is already taken"
                });
            }
        } catch (e){
            console.log("No connection to the DB or problems with query");
            return res.render("register", {
                message: "Problems with connection"
            });
        }
    } else{
        return res.status(422).render("register", {
            errors: errors.array()
        });
    }

}

/**
 * Function logs in user by creating jwt token and saving it to cookies
 * It requires login and password fields, which must be sent in request's body as object: {login: "user login", password: "user password"}
 * All data must be string-type
 * Function also print helpful hints to server console in case of problems
 * If everything was ok, user will be redirected to the profile page, if not error message will be displayed under registration form in browser
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @returns {Promise} nothing if succeed or error message
 */
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const login = req.body.login;
            const password = req.body.password;

            const selectLoginQ = "SELECT login FROM users WHERE login = ?";
            const resp = await db.makeQuery(selectLoginQ, login);
            const isUserExist = resp.length !== 0;

            if(isUserExist){
                const selectUserQ = "SELECT * FROM users WHERE login = ?";
                const resp = await db.makeQuery(selectUserQ, login);

                if(!resp || !(await bcrypt.compare(password, resp[0].password))){
                    return res.status(401).render("login", {
                        message: "Password is wrong"
                    });
                } else{
                    const id = resp[0].login;
                    createAccessCookie(id, res);
                    res.status(200).redirect("/profile");
                }
            } else {
                return res.render("login", {
                    message: "User with this login does not exists"
                });
            }
        } catch (e){
            console.log("No connection to the DB or problems with query");
            console.log(e);
            return res.render("login", {
                message: "Problems with connection"
            });
        }
    } else{
        return res.render("login", {
            errors: errors.array()
        });
    }

}

/**
 * Function checks is user logged in by examining cookie
 * In case then user wiped all cookies, this function will return error
 * Function also print helpful hints to server console in case of problems
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @param next next function for passing data forward
 * @returns {Promise} user's information as his name, email etc or nothing in case of error
 */
exports.isLoggedIn = async (req, res, next) => {
    //req.message = "Inside middleware";

    //If req has cookie jwt (created with logging in)
    if(req.cookies.jwt){
        try{
            //Convert cookie to json
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            try{
                const selectNameQ = "SELECT name, login FROM users_data WHERE login = ?";
                const result = await db.makeQuery(selectNameQ, decoded.id);

                //if user with that login(=id here) exists, save his data to the req obj
                if(result){
                    req.result = result[0];
                } else{
                    console.log("No user found");
                }
            }catch(e){
                console.log("Problems with DB or connection");
                console.log(e);
            }

        }catch(e){
            console.log("Problems with getting cookie");
            console.log(e);
        }
    }

    next();
}

/**
 * Function returns user login in case if he is logged in
 * In case then user wiped all cookies, this function will return error
 * Function also print helpful hints to server console in case of problems
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @param next next function for passing data forward
 * @returns {Promise} user's login or nothing in case of error
 */
exports.getLogin = async (req, res, next) => {
    if(req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            req.login = decoded.id;
        }catch(e){
            console.log("Problems with getting cookie");
            console.log(e);
        }
    }

    next();
}

/**
 * Function logs out user and redirects to him to home page
 * @param req request object from the previous function
 * @param res response object from the previous function
 * @returns {Promise} nothing
 */
exports.logout = (req, res) => {
    //The cookie will expire in 2 s = will be removed from browser
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });

    res.status(200).redirect("/");
}

function createAccessCookie(id, res) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    const cookieOptions = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000 ),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOptions);
}