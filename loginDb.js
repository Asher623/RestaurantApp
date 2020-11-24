const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://fier61:wsad234Q@cluster0.bb8bk.mongodb.net/AssignmentDb?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})



var Users = mongoose.model("registration_model").schema;

module.exports.login = function( email, password){
  Users.find({email: "abc@mail.com"})
  .exec()
  .then((user) => {
    if(!user) {
      console.log("No User could be found");
    } else {
      users = users.map(value => value.toObject());
      console.log(users);
    }
  })
  .catch((err) => {
    console.log(`There was an error: ${err}`);
  });
}
