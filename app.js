// recuperation des recettes

let recipes = [];

async function getRecipes() {
  await fetch("./recipes.json")
    .then((response) => response.json())
    .then((data) => {
      recipes = data;
      console.log(recipes);
    });
}

function displayRecipe() {
  const containerRecipe = document.querySelector(".recipe-container");
  recipes.forEach((recipe) => {
    const { name, time, ingredients, description } = recipe;

    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("div");
    img.classList.add("img-to-display");
    card.appendChild(img);
    const headingCard = document.createElement("div");
    headingCard.classList.add("heading-card");
    card.appendChild(headingCard);
    const title = document.createElement("h3");
    title.innerText = name;
    const timer = document.createElement("div");
    timer.classList.add("timer");
    timer.innerHTML = `
    <i class="fa-regular fa-clock"></i>
    ${time} min
    `;

    headingCard.appendChild(title);
    headingCard.appendChild(timer);
    const listIngredient = document.createElement("ul");

    ingredients.forEach((item) => {
      const { ingredient, quantity, unit } = item;
      let prefixUnit;

      const list = document.createElement("li");

      if (unit == "ml") {
        prefixUnit = "ml";
      } else if (unit == "grammes") {
        prefixUnit = "g";
      } else if (unit == "cl") {
        prefixUnit = "cl";
      } else if (unit == "tasse") {
        prefixUnit = "tasse";
      } else {
        prefixUnit = "";
      }

      if (quantity == null) {
        list.innerHTML = `<span>${ingredient}</span>`;
      } else {
        list.innerHTML = `<span>${ingredient}:</span> ${quantity}${prefixUnit}`;
      }

      listIngredient.appendChild(list);
    });

    const tuto = document.createElement("div");
    tuto.classList.add("tuto");
    card.appendChild(tuto);

    tuto.appendChild(listIngredient);

    const prepContainer = document.createElement("div");
    prepContainer.classList.add("prep-container");

    const prep = document.createElement("p");
    prep.classList.add("prep");
    prep.innerText = description;
    prepContainer.appendChild(prep);
    tuto.appendChild(prepContainer);

    containerRecipe.appendChild(card);
  });
}

function getAllIngredients() {
  let ingredientsWithDuplicate = [];

  recipes.forEach((item) => {
    ingredientsWithDuplicate.push(item.ingredients[0].ingredient);
  });

  return [...new Set(ingredientsWithDuplicate)];
}

function getAllAppareils() {
  let appareilsWithDuplicate = [];

  recipes.forEach((item) => {
    appareilsWithDuplicate.push(item.appliance);
  });

  return [...new Set(appareilsWithDuplicate)];
}

function getAllUstensiles() {
  let ustensilesWithDuplicate = [];

  recipes.forEach((item) => {
    ustensilesWithDuplicate.push(item.ustensils[0]);
  });

  return [...new Set(ustensilesWithDuplicate)];
}

function displayFilter(inputToAdd, itemFilter) {
  const inputBox = inputToAdd.parentElement;
  const boxFilter = document.createElement("div");
  boxFilter.classList.add("list-filter");
  boxFilter.classList.add(`${inputToAdd.id}`);

  console.log(itemFilter);

  itemFilter.forEach((item) => {
    const filterItem = document.createElement("p");
    filterItem.innerText = item;
    boxFilter.appendChild(filterItem);
  });

  console.log(boxFilter);
  console.log(inputBox);

  inputBox.appendChild(boxFilter);
}

function hideFilterBox() {
  const boxFilter = document.querySelectorAll(".list-filter");

  boxFilter.forEach((box) => {
    box.remove();
  });
}

function openDropdown() {
  const inputChevronDown = document.querySelectorAll(".fa-chevron-down");

  inputChevronDown.forEach((chevronDown) => {
    chevronDown.addEventListener("click", (e) => {
      const input = e.target.previousElementSibling;
      const boxFilter = `getAll${input.placeholder}`;
      console.log(boxFilter);

      inputChevronDown.forEach((items) => {
        items.previousElementSibling.classList.remove("input-open");
        hideFilterBox();
      });

      if (input.className == "input opened") {
        input.classList.remove("input-open");
        input.classList.remove("opened");
        hideFilterBox();
      } else {
        input.classList.add("opened");
        input.classList.add("input-open");
        let functionToCall = window[boxFilter]();
        displayFilter(input, functionToCall);
      }
    });
  });
}

async function init() {
  await getRecipes();
  displayRecipe();
  openDropdown();
}

init();
