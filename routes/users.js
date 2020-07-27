const bodyParser = require('body-parser');
const express=require('express');
const passport=require('passport');
var User = require('../models/user');
const usersRouter = express.Router();
const cors=require('./cors');
usersRouter.use(bodyParser.json());
var authenticate = require('../authenticate');
usersRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
usersRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    User.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})
usersRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        console.log('done');
        res.end('<html><body><h1>Registration Successful!</h1></body></html>');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  });
});

/*usersRouter.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('hipppppi');
  console.log(req.body);
  //res.end('<html><body><h1>tatatagaagaga</h1></body></html>');
  var s="<html><head><style>h1{background-color: green;}div{background-color: lightblue;}p{background-color: yellow;}</style></head><body><h1>This is a heading</h1><p>This is a paragraph.</p></<br><br><div align='center' color='blue'>hello</div><br></body></html>";
		for(var i=0;i<10;i++)
		{
		s+="<div align='center' color='blue'>hello</div><br>";
		}
		res.end(s);
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Authorization', 'bearer '+ token);
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
*/
usersRouter.get('/logout',authenticate.verifyUser, (req, res,next) => {
  if (req.user!=null) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
    next();
  }
  else {
  console.log(req.user);
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
usersRouter.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
      }
      //console.log('jjjjjjj '+req.user);
      var token = authenticate.getToken({username: req.user.username});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      //res.json(req.user)
      res.json({success: true, status: 'Login Successful!', token: token});
    }); 
  }) (req, res, next);
});

usersRouter.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});
module.exports=usersRouter;
