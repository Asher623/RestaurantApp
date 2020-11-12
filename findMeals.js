const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://fier61:wsad234Q@cluster0.bb8bk.mongodb.net/AssignmentDb?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})

var meals_packeges = new Schema({
  "mealName":  String,
  "mealPrice": String,
  "image": String,
  "category": String,
  "numOfMeals":String,
  "top":String,
  "synopsis":String
});


var Meals = mongoose.model("meal_packages", meals_packeges);
var meals;
Meals.find()
      .exec()
      .then((data) => {
        if(!data){
          console.log("No meals")
        }else{
          meals = data.map(value => value.toObject());
        }

      })
      .catch((err)=>{
          console.log("Errors:", err);
      });


module.exports.getMeals = function(){
  return meals;
}
