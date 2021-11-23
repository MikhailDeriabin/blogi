const express = require("express");

const registration = require("./user_registration");

const router = (app) => {
    app.use(express.json({limit : "10mb"}));

    app.post('/new-user', async (req, res) => {
        const result = await registration.handleRegistration(req.body);
        const respObj = {
            regStatus: result
        }
        res.json(respObj);
        res.end();
    });
}

module.exports.router = router;