const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.connect("mongodb+srv://fier61:wsad234Q@cluster0.bb8bk.mongodb.net/AssignmentDb?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

var registration_model = new Schema({
  "first_name":  String,
  "last_name": String,
  "email": {
    type:String,
    unique:true
  },
  "password": String,
  "clerk":Boolean,

});

var Users = mongoose.model("registration_model", registration_model);

module.exports.register = async(first_name, last_name, email, password,clerk)=>{
  var errorEmail = "";
  try{
    const newUser = new Users({
      "first_name":  first_name,
      "last_name": last_name,
      "email": email,
      "password": bcrypt.hashSync(password, 10),
      "clerk":clerk,
    })
    let saveUser = await newUser.save();

  }catch(err){
    errorEmail.errors = "This email is already exists.";
  };
  return errorEmail;
  }


module.exports.login = async(email, password) =>{
  var errorReturn = {
    firstname: "",
    lastname: "",
    errors: "",
    clerk: false,
  };
  await Users.findOne({email: email})
  .exec()
  .then((user) => {
    if(!user) {
      errorReturn.errors = "No User could be found";
    } else {
      var result = bcrypt.compareSync(password, user.password);
      
      if (!result)
        errorReturn.errors = "The password is wrong";

        errorReturn.firstname = user.first_name;
        errorReturn.lastname = user.last_name;
        errorReturn.clerk = user.clerk;
    }
  })
  .catch((err) => {
    console.log(`There was an error: ${err}`);
  });
  return errorReturn;
}
