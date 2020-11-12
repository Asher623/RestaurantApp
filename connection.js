const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://fier61:wsad234Q@cluster0.bb8bk.mongodb.net/AssignmentDb?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})


var meals_packeges = new Schema({
  "title":  String,
  "price": Number,
  "image": String,
  "category": String,
  "numOfMeals":Number,
  "top":Number,
  "synopsis":String
});

var Meals = mongoose.model("meal_packages", meals_packeges);
var pastaParty = new Meals({
  title: 'Pasta party',
  price: 33,
  image: 'images/pasta_party.jpg',
  category: 'pasta',
  numOfMeals: 3,
  top: 1,
  synopsis: 'High protein, high calories without nutrition',
});

var pizzaParty = new Meals({
  title: 'Pizza party',
  price: 36,
  image: 'images/pizza_party.jpg',
  category: 'pizza',
  numOfMeals: 4,
  top: 2,
  synopsis: '3 pizzas for the price of 2 with ton pf calories',
})
var couplePackage = new Meals({
  title: 'Couple package',
  price: 25,
  image: 'images/couple_package.jpg',
  category: 'pasta',
  numOfMeals: 3,
  top: 3,
  synopsis: 'Two pastas with double coke for, low carb meals',
})
var fourFriends = new Meals({
  title: 'Four friends',
  price: 56,
  image: 'images/four_friends.jpg',
  category: 'pizza',
  numOfMeals: 4,
  top: 4,
  synopsis: '4 medium pizzas with 4 drinks',
})*/

pastaParty.save((err) => {
  if(err) {
    console.log("There was an error saving the pizzaParty");
  } else {
    console.log("The pizzaParty was saved to the meals collection");
  }
  // exit the program after saving
  process.exit();
});
