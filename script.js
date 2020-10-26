
(function(){
  let top_meals = window.top_meals_pac;
  let all_meals = window.meals_packeges;

  let tableHelper = {
    mealToRow: function(dish){
      let tr = document.createElement('tr');
      tr.setAttribute('id', 'many-rows');

      let tdImage = document.createElement('td');
      let img = document.createElement('img');
      img.src = dish.image;
      img.onload = function() {

      };
      img.onerror = function() {
        this.remove();
      };
      img.style.width = '280px';
      img.style.height = '210px';
      tdImage.appendChild(img);
      tr.appendChild(tdImage);

      let trTitle = document.createElement('tr');
      let titleH2 = document.createElement('p');
      let textTitle = document.createTextNode(dish.title);
      titleH2.setAttribute('id', 'title');
      titleH2.appendChild(textTitle);
      trTitle.appendChild(titleH2);
      tr.appendChild(trTitle);

      let trPrice = document.createElement('tr');
      let textPrice = document.createTextNode(

          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD',
          }).format(dish.price)
      );
      let priceP = document.createElement('p');
      priceP.setAttribute('id', 'price');
      priceP.appendChild(textPrice);
      trPrice.appendChild(priceP);
      tr.appendChild(trPrice);

      let body = document.querySelector('#table-rows');
      body.appendChild(tr);
    },
    dishToTable :function(meals) {
      var dish;
      for (dish of meals) {
        tableHelper.mealToRow(dish);
      }
    }
  }

  let mealsHelper = {
    mealToRow: function(meals){
      let tr = document.createElement('tr');
      tr.setAttribute('id', 'many-rows');

      let tdImage = document.createElement('td');
      let img = document.createElement('img');
      img.src = meals.image;
      img.onload = function() {

      };
      img.onerror = function() {
        this.remove();
      };
      img.style.width = '280px';
      img.style.height = '210px';
      tdImage.appendChild(img);
      tr.appendChild(tdImage);

      let trTitle = document.createElement('td');
      let titleH2 = document.createElement('p');
      let textTitle = document.createTextNode(meals.title);
      titleH2.setAttribute('id', 'title');
      titleH2.appendChild(textTitle);
      trTitle.appendChild(titleH2);
      tr.appendChild(trTitle);


      let trSynopsis = document.createElement('td');
      let synopsisH2 = document.createElement('p');
      let textSynopsis = document.createTextNode(meals.synopsis);
      synopsisH2.appendChild(textSynopsis);
      trSynopsis.appendChild(synopsisH2);
      tr.appendChild(trSynopsis);


      let trPrice = document.createElement('td');
      let textPrice = document.createTextNode(

          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD',
          }).format(meals.price)
      );


      let priceP = document.createElement('p');
      priceP.setAttribute('id', 'price');
      priceP.appendChild(textPrice);
      trPrice.appendChild(priceP);
      tr.appendChild(trPrice);

      let body = document.querySelector('#table-rows');
      body.appendChild(tr);
    },
    mealToTable :function(meals) {
      var meal;
      for (meal of meals) {
        mealsHelper.mealToRow(meal);
      }
    }
  }



  function main_prog(){
    if (top_meals != null){
      tableHelper.dishToTable(top_meals)
    }
    else{
      mealsHelper.mealToTable(all_meals)
    }
    let logInModal = document.querySelector('#logInModal');
    let regModal = document.querySelector('#registModal');

    let modal = document.querySelector('.modal');



    let cancelLog = document.querySelector("#log_close");
    cancelLog.addEventListener('click', function(){
      logInModal.style.display = "none";
    });
    let cancelReg = document.querySelector("#reg_close");
    cancelReg.addEventListener('click', function(){
      regModal.style.display = "none";
    });

    window.onclick = function(event) {
      if (event.target == logInModal) {
        logInModal.style.display = "none";
      }
    }
    window.onclick = function(event) {
      if (event.target == regModal) {
        regModal.style.display = "none";
      }
    }

    let logIn = document.querySelector('#login');
    logIn.addEventListener('click', function (){
      logInModal.style.display = "block";
    });
    let registration = document.querySelector('#registration');
    registration.addEventListener('click', function(){
      regModal.style.display = "block";
    });



  }
  window.onload = main_prog;
})();
