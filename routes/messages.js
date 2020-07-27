const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const cors=require('./cors');
var authenticate = require('../authenticate');
const msgRouter = express.Router();
const User = require('../models/user');
msgRouter.use(bodyParser.json());

msgRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser,(req, res, next) => {
User.findOne({username: req.user.username}, (err, user) => {
            if (err) {
                res.json({err:error});
            }
            else {
            //req.body.from=req.user.username;
            //user.messages.push(req.body);
            //user.messages.from=req.user.username;
            //user.save();
            console.log("sent messages");
            console.log(user.messages);
            res.json(user.messages);
            }
        });
})
module.exports = msgRouter;
