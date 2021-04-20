const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://fier61:password@cluster0.bb8bk.mongodb.net/AssignmentDb?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);
var meals_packeges = new Schema({
  "title":  String,
  "price": String,
  "image": String,
  "category": String,
  "numOfMeals":String,
  "top":Boolean,
  "synopsis":String
});


var Meals = mongoose.model("meal_packages", meals_packeges);



module.exports.getMeals = async function(){
  var meals;
  await Meals.find()
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
  return meals;
}
module.exports.addMeal = async function(title, price, img, m_category, mealsNum, isTop, desc){

  var errorEmail = "";
  try{
    const newMeal = new Meals({
      "title":  title,
      "price": price,
      "image": img,
      "category": m_category,
      "numOfMeals":mealsNum,
      "top":isTop,
      "synopsis":desc
    })
    let saveUser = await newMeal.save();

  }catch(err){
    errorEmail.errors = "This email is already exists.";
  };
  return errorEmail;
  }

  module.exports.findMealId = async function(id){
    var errorReturn;
    await Meals.findOne({_id: id})
    .exec()
    .then((meal) => {
      if(!meal) {

      } else {
        errorReturn = meal
      }
    })
    .catch((err) => {
      console.log(`There was an error: ${err}`);
    });
    return errorReturn;
  }

  module.exports.updateMeal = async function(id, m_title, m_price, img, m_category, mealsNum, isTop, desc){
    if (img == ""){
      await Meals.findOneAndUpdate({_id: id}, {title: m_title, price: m_price, category: m_category, numOfMeals: mealsNum, top:isTop, synopsis: desc})
      .exec()
      .then((meal) => {
        if(!meal) {
          console.log("Meal upgraded");
        } else {
          console.log("Meal not found");
        }
      })
      .catch((err) => {
        console.log(`There was an error: ${err}`);
      });
    }
    else{
      await Meals.findOneAndUpdate({_id: id}, {title: m_title, price: m_price, image: img, category: m_category, numOfMeals: mealsNum, top:isTop, synopsis: desc})
      .exec()
      .then((meal) => {
        if(!meal) {
          console.log("Meal upgraded");
        } else {
          console.log("Meal not found");
        }
      })
      .catch((err) => {
        console.log(`There was an error: ${err}`);
      });
    }


  }
