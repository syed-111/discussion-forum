const express= require('express');
const http= require('http');
const bodyparser=require('body-parser');
const authenticate =require('./authenticate');
const mongoose = require('mongoose');
const dishRouter=require('./routes/dishRouter');
const usersRouter=require('./routes/users');
const sendRouter=require('./routes/send');
const msgRouter=require('./routes/messages');
const homeRouter=require('./routes/home');
var passport = require('passport');
//var authenticate = require('./authenticate');
var config = require('./config');
const url = 'mongodb://localhost:27017/conFusion';
//const url = config.mongoUrl;
const app=express();
const server=http.createServer(app);
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });
app.use(passport.initialize());
app.use(passport.session());
app.use( bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
    extended: true
 })); 
app.use(express.static(__dirname + '/public'));
app.use('/dishes',dishRouter);
app.use('/users',usersRouter);
app.use('/send',sendRouter);
app.use('/messages',msgRouter);
app.use('/home',homeRouter);
app.post('/lll',(req,res)=>
{
    console.log(req.body);
    //delete req.body.agree;
    res.json(req.body);
}
);

app.use(authenticate.verifyUser,(req, res, next) => {
    console.log(req.user);

    if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
    else {
          next();
    }
})
//app.use(auth);

server.listen(3000,()=>
{
console.log(`Listening at port 3000`);
}
);
