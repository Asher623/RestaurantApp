/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Ivan Anferov Student ID: 130909195 Date: ____10/26/2020______________ *
* Online (Heroku, https://...) Link: __https://shrouded-atoll-45618.herokuapp.com_________ *
* GitHub or Bitbucket repo Link: ___https://github.com/Asher623/assignment_2________________________
* ********************************************************************************/
var path = require("path");
var express = require("express");
const multer = require("multer");
var app = express();
const exphbs = require('express-handlebars');
const dataService = require('./meals_packeges')
const mealsDB = require('./findMeals')
var nodemailer = require('nodemailer');
const regDb =require('./registerDb')
const logDb = require('./loginDb')
const clientSessions = require("client-sessions");




var HTTP_PORT = process.env.PORT || 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { check, validationResult } = require('express-validator');

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', helpers: {login: true} }));
app.set('view engine', '.hbs');
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Setup client-sessions
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "qwertyuiop", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});


app.post("/register",[check('firstname','First mame is required').not().isEmpty(), check('lastname').not().isEmpty().withMessage('Last name is required'), check('email', 'Email is required').not().isEmpty(), check('password', 'Password is required').not().isEmpty(), check('password', 'Lenght must be more then 6 symbols').isLength({ min: 6 }), check('firstname', 'Lenght must be more then 2 symbols').isLength({ min: 2 })], async (req, res)=>{
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  var errors = validationResult(req);

  var data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  }

  const regErrors = await regDb.register(req.body.firstname,req.body.lastname,req.body.email,req.body.password, false)

  if (regErrors || !errors.isEmpty()) {
      return res.render("registration",{errors: errors.mapped(), success: false, data: data, regError:regErrors})

  } else {
    var mailOptions = {
      from: 'ivananer623@gmail.com',
      to: email,
      subject: 'Papa Jones',
      text: 'Welcome to Papa Jones!!!'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      return res.render("welcome",{errors: null, success: true, data: req.body.firstname, regError:null})

  }




});

app.post("/login",[check('email', 'Email is required').not().isEmpty(), check('password', 'Password is required').not().isEmpty(), check('password', 'Lenght must be more then 6 symbols').isLength({ min: 6 })], async (req, res)=>{

  var errors = validationResult(req);
  var data = {
    email: req.body.email
  }
  const logInDb = await regDb.login(data.email,req.body.password);
  if (!errors.isEmpty() || logInDb.errors) {
    return res.render("login",{errors: errors.mapped(), success: false, data: data, logErrors: logInDb.errors})

  } else {

    req.session.user = {
      email: req.body.email,
      firstname: logInDb.firstname,
      lastname: logInDb.lastname,
      clerk: logInDb.clerk,
    }
    res.redirect("/welcome")
    //return res.render("welcome",{errors: null, success: true, data: req.body.firstname})
  }
  let email = req.body.email;
});

app.get("/packages", function(req,res){
  return res.render("packages", {
    data: mealsDB.getMeals(),
  })
})


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ivananer623@gmail.com',
    pass: '12345qweR'
  }
});





app.get('/welcome', ensureLogin, function(req,res){
  if (req.session.user.clerk){
    return res.render("welcome", {user: req.session.user, layout: 'clerkLayout.hbs'});
  }
  else{
    return res.render("welcome", {user: req.session.user , layout: 'userLayout.hbs'});
  }
})

app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
app.get("/meals", function(req,res){
    res.send('meals');
});

app.get("/registration", function(req,res){
  res.render('registration');

});
app.get("/login", function(req,res){
  res.render('login');

});


app.use(express.static("media"));

app.get('/script.js',function(req,res){
    res.sendFile(path.join(__dirname + '/script.js'));
});
app.get('/top_meal_packeges.js',function(req,res){
    res.sendFile(path.join(__dirname + '/top_meal_packeges.js'));
});
app.get('/meals_packeges.js',function(req,res){
    res.sendFile(path.join(__dirname + '/meals_packeges.js'));
});

app.listen(HTTP_PORT, onHttpStart);

//mongodb+srv://fier61:wsad234Q@cluster0.bb8bk.mongodb.net/<dbname>?retryWrites=true&w=majority
