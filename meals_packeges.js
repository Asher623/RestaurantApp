let meals_packeges = [
  {
    title: 'Pasta party',
    price: 33,
    image: 'images/pasta_party.jpg',
    category: 'pasta',
    numOfMeals: 3,
    top: 1,
    synopsis: 'High protein, high calories without nutrition',
  },
  {
    title: 'Pizza party',
    price: 36,
    image: 'images/pizza_party.jpg',
    category: 'pizza',
    numOfMeals: 4,
    top: 2,
    synopsis: '3 pizzas for the price of 2 with ton pf calories',
  },
  {
    title: 'Couple package',
    price: 25,
    image: 'images/couple_package.jpg',
    category: 'pasta',
    numOfMeals: 3,
    top: 3,
    synopsis: 'Two pastas with double coke for, low carb meals',
  },
  {
    title: 'Four friends',
    price: 56,
    image: 'images/four_friends.jpg',
    category: 'pizza',
    numOfMeals: 4,
    top: 4,
    synopsis: '4 medium pizzas with 4 drinks',
  },
];

module.exports.getMeals = function(){
  return meals_packeges;
}
