const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const cors=require('./cors');
var authenticate = require('../authenticate');
const sendRouter = express.Router();
const User = require('../models/user');
sendRouter.use(bodyParser.json());

sendRouter.route('/:username')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
User.findOne({username: req.params.username}, (err, user) => {
            if (err) {
                res.json({err:error});
            }
            else {
            req.body.from=req.user.username;
            user.messages.push(req.body);
            //user.messages.from=req.user.username;
            user.save();
            res.json(user);
            }
        });
})
module.exports = sendRouter;
