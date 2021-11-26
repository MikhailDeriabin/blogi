const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = require("../server_modules/db");


exports.register = async (req, res) => {
    try{
        const {login, password, name, email, phone, hobbies} = req.body;

        if(!verifyNotNull([login, password])){
            return res.status(400).render("register", {
                message: "Please fill all required fields"
            });
        }

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
}

exports.login = async (req, res) => {
    try{
        const login = req.body.login;
        const password = req.body.password;

        if(!verifyNotNull([login, password])){
            return res.status(400).render("login", {
                message: "Please fill all required fields"
            });
        }

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
}

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
                    req.user = result[0];
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

exports.logout = (req, res) => {
    //The cookie will expire in 2 s = will be removed from browser
    res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });

    res.status(200).redirect("/");
}

function verifyNotNull(strings){
    for(let i=0; i< strings.length; i++){
        if(!strings[i])
            return false;
    }
    return true;
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