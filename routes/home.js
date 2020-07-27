const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const cors=require('./cors');
const homeRouter = express.Router();
const User = require('../models/user');
homeRouter.use(bodyParser.json());
var st='public';
homeRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
User.findOne({username: st}, (err, user) => {
            if (err) {
                res.json({err:error});
            }
            else {
            //req.body.from=req.user.username;
            //user.messages.push(req.body);
            //user.messages.from=req.user.username;
            //user.save();
            res.json(user.messages);
            }
        });
})
module.exports = homeRouter;
