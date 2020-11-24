/*********************************************************************************
* WEB322 – Assignment 03 - 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Ivan Anferov Student ID: 130909195 Date: ____11/24/2020______________ *
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
const regDb =require('./registerDb');

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

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./media/images/",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });

app.get("/", async function(req,res){
  return res.render("home", {
    data: await mealsDB.getMeals(),
  })
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


app.get("/packages/:id", async function(req,res){
  var mealOne = await mealsDB.findMealId(req.params.id)
  console.log(mealOne.title)
  return res.render("mealPage", {title: mealOne.title, price: mealOne.price, image: mealOne.image, mealsNumber: mealOne.numOfMeals, synopsis:mealOne.synopsis, user: req.session.user,id: mealOne._id})
})

app.post("/addMeal", upload.single('mealImage'),  async (req, res)=>{
  console.log(req.file);
  var formData = {
    name: req.body.mealName,
    price: req.body.mealPrice,
    image: "images/" + req.file.filename,
    category: req.body.mealCategory,
    top: req.body.mealTop,
    number: req.body.mealNumber,
    desc: req.body.mealDesc,
  }
  var isTop = false;
  if (formData.top == "Yes"){
    isTop = true;
  }

  const mealAdd = await mealsDB.addMeal(formData.name, formData.price, formData.image, formData.category, formData.number, isTop, formData.desc);
  res.redirect("/welcome");
});

app.post("/updateMeal/updateMealPost/:id", upload.single('mealImage'),  async (req, res)=>{
    var imgPath = "";
    if (req.file){
      imgPath = "images/" + req.file.filename;
    }

  var formData = {
    name: req.body.mealName,
    price: req.body.mealPrice,
    image: imgPath,
    category: req.body.mealCategory,
    top: req.body.mealTop,
    number: req.body.mealNumber,
    desc: req.body.mealDesc,
  }
  var isTop = false;
  if (formData.top == "Yes"){
    isTop = true;
  }
  await mealsDB.updateMeal(req.params.id, formData.name, formData.price, formData.image, formData.category, formData.number, isTop, formData.desc);
  res.redirect("/welcome");
});


app.get("/packages", async function(req,res){
  return res.render("packages", {
    data: await mealsDB.getMeals()
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
  return res.render("welcome", {user: req.session.user})
})

app.get("/logout", function(req, res) {
  req.session.reset();
  app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main'}));
  res.redirect("/login");
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {

    res.redirect("/login");
  } else {
    if (req.session.user.clerk){
      app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'clerkLayout'}));
    }
    else{
      app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'userLayout'}));
    }

    next();
  }
}


app.get("/registration", function(req,res){
  res.render('registration');

});
app.get("/login", function(req,res){
  res.render('login');

});

app.get("/addMeal", function(req,res){
  res.render('addMeal');
})

app.get("/updateMeal/:id", async function(req,res){
  var mealOne = await mealsDB.findMealId(req.params.id)
  return res.render("updateMeal", {id: req.params.id, title: mealOne.title, price: mealOne.price, image: mealOne.image, desc: mealOne.synopsis, top: mealOne.top, category: mealOne.category, numMeals: mealOne.numOfMeals})
})


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
