// recuperation des recettes

let recipes = [];

async function getRecipes() {
  await fetch("./recipes.json")
    .then((response) => response.json())
    .then((data) => {
      recipes = data;
    });
}

function lauchSortBy() {
  const searchBar = document.getElementById("search-bar");

  searchBar.addEventListener("input", (e) => {
    if (e.inputType == "deleteContentBackward" && e.target.value.length < 3) {
      sortBy(e.target.value);
    }
    if (e.target.value.length > 2) {
      sortBy(e.target.value);
    }
  });
}

function sortBy(wordToFilter) {
  let recipesToShow = [];

  recipes.forEach((recipe) => {
    const { name, ingredients, description } = recipe;

    const ingredientsArray = [...ingredients];
    let listIngredient = "";

    ingredientsArray.forEach((ing) => {
      listIngredient = `${listIngredient} , ${ing.ingredient}`;
    });

    if (
      name.toLowerCase().includes(wordToFilter) ||
      description.toLowerCase().includes(wordToFilter) ||
      listIngredient.toLowerCase().includes(wordToFilter)
    ) {
      recipesToShow.push(recipe);
    }
  });

  displayRecipe(recipesToShow);
}

function displayRecipe(recipesArray) {
  const containerRecipe = document.querySelector(".recipe-container");
  containerRecipe.innerText = "";
  recipesArray.forEach((recipe) => {
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

  const noRecipe = document.querySelector(".no-recipe");
  if (containerRecipe.childElementCount == 0) {
    noRecipe.style.display = "block";
  } else {
    noRecipe.style.display = "none";
  }
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

  itemFilter.forEach((item) => {
    const filterItem = document.createElement("p");
    filterItem.innerText = item;
    boxFilter.appendChild(filterItem);
  });

  inputBox.appendChild(boxFilter);

  addTag();
}

function hideFilterBox(input, placeholder) {
  const boxFilter = document.querySelectorAll(".list-filter");
  input.value = "";
  input.setAttribute(
    "placeholder",
    `${placeholder.charAt(0).toUpperCase() + placeholder.slice(1)}`
  );
  boxFilter.forEach((box) => {
    box.style.display = "none";
  });
}

function openDropdown() {
  const inputChevronDown = document.querySelectorAll(".fa-chevron-down");
  const allInput = document.querySelectorAll(".input-container input");

  inputChevronDown.forEach((chevronDown) => {
    chevronDown.previousElementSibling.disabled = true;
    chevronDown.addEventListener("click", (e) => {
      const input = e.target.previousElementSibling;
      const boxFilter = `getAll${input.placeholder}`;
      const chevronUp = e.target.nextElementSibling;
      const chevronDown = e.target;

      allInput.forEach((item) => {
        item.classList.remove("input-open");
        item.nextElementSibling.style.display = "block";
        item.nextElementSibling.nextElementSibling.style.display = "none";
        item.disabled = true;
        hideFilterBox(item, item.id);
      });

      input.classList.add("input-open");
      chevronUp.style.display = "block";
      chevronDown.style.display = "none";
      chevronDown.previousElementSibling.disabled = false;
      input.placeholder = `Rechercher un ${input.id.slice(0, -1)}`;

      let getFilter = window[boxFilter]();

      if (!input.parentElement.lastChild.className) {
        displayFilter(input, getFilter);
      } else {
        input.parentElement.lastChild.style.display = "grid";
      }
      searchTag(input);
    });
  });
}

function closeDropDown() {
  const inputChevronup = document.querySelectorAll(".fa-chevron-up");

  inputChevronup.forEach((chevronUp) => {
    chevronUp.previousElementSibling.previousElementSibling.disabled = false;

    chevronUp.addEventListener("click", (e) => {
      const input = e.target.previousElementSibling.previousElementSibling;
      const chevronDown = e.target.previousElementSibling;
      chevronUp.style.display = "none";
      chevronDown.style.display = "block";
      input.disabled = true;

      input.classList.remove("input-open");
      hideFilterBox(input, input.id);
    });
  });
}

function sortByTags() {
  const selectedFilters = document.querySelector(".selected-filters");
  const nodeSelectedFilters = selectedFilters.childNodes;
  let arraySelectedFilter = [];
  let arraySelectedFilterIng = [];
  let arraySelectedFilterApp = [];
  let arraySelectedFilterUst = [];
  let arraySorted = [];

  nodeSelectedFilters.forEach((filter) => {
    if (filter.className.split(" ")[0] === "ingredients") {
      arraySelectedFilterIng.push(filter.innerText);
      arraySelectedFilter.push(filter.innerText);
    } else if (filter.className.split(" ")[0] === "appareils") {
      arraySelectedFilterApp.push(filter.innerText);
      arraySelectedFilter.push(filter.innerText);
    } else if (filter.className.split(" ")[0] === "ustensiles") {
      arraySelectedFilterUst.push(filter.innerText);
      arraySelectedFilter.push(filter.innerText);
    }
  });

  recipes.forEach((recipe) => {
    const { ingredients, appliance, ustensils } = recipe;

    const ingredientsArray = [...ingredients];
    let listIngredient = "";

    ingredientsArray.forEach((ing) => {
      listIngredient = `${listIngredient} , ${ing.ingredient}`;
    });

    const stringUstensils = ustensils.join(" , ");

    function checkIng() {
      let notValid;
      arraySelectedFilterIng.forEach((filter) => {
        const filterLowerCase = filter.toLowerCase();
        if (!listIngredient.toLowerCase().includes(filterLowerCase)) {
          notValid = false;
        }
      });
      if (notValid === false) {
        return false;
      } else return true;
    }

    function checkApp() {
      let notValid;
      arraySelectedFilterApp.forEach((filter) => {
        const filterLowerCase = filter.toLowerCase();
        if (!appliance.toLowerCase().includes(filterLowerCase)) {
          notValid = false;
        }
      });
      if (notValid === false) {
        return false;
      } else return true;
    }

    function checkUst() {
      let notValid;
      arraySelectedFilterUst.forEach((filter) => {
        const filterLowerCase = filter.toLowerCase();
        if (!stringUstensils.toLowerCase().includes(filterLowerCase)) {
          notValid = false;
        }
      });
      if (notValid === false) {
        return false;
      } else return true;
    }

    if (checkIng() && checkApp() && checkUst()) {
      arraySorted.push(recipe);
    }
  });

  displayRecipe(arraySorted);
}

function searchTag(input) {
  const inputBox = input.parentElement;
  const listFilter = document.querySelector(".list-filter");
  const nodeFilter = [...listFilter.childNodes];
  let tagToShow = [];
  const arrayFilter = nodeFilter.map((node) => {
    return node.innerText.toLowerCase();
  });

  input.addEventListener("input", (e) => {
    const tagToSort = e.target.value;
    tagToShow = [];
    arrayFilter.forEach((tag) => {
      if (tag.includes(tagToSort.toLowerCase())) {
        let tagFirstLetterCapital = tag[0].toUpperCase() + tag.slice(1);
        tagToShow.push(tagFirstLetterCapital);
      }
      inputBox.lastChild.remove();
      displayFilter(input, tagToShow);
    });
  });
}

function addTag() {
  const listFilter = document.querySelectorAll(".list-filter");
  const selectedFilters = document.querySelector(".selected-filters");

  listFilter.forEach((filter) => {
    const allFilter = [...filter.childNodes];

    allFilter.forEach((item) => {
      item.addEventListener("click", (e) => {
        item.classList.add("filter-added");

        let cloneFilter = item.cloneNode(true);

        // get id element parent for style like blue green or red
        const parentFilter = item.parentElement.classList[1];

        cloneFilter.classList.add(parentFilter);
        cloneFilter.classList.add("tags");

        const closeTag = document.createElement("i");
        closeTag.classList.add("fa-regular");
        closeTag.classList.add("fa-circle-xmark");
        cloneFilter.appendChild(closeTag);
        selectedFilters.appendChild(cloneFilter);
        removeTag(item.parentElement);
        sortByTags();
      });
    });
  });
}

function removeTag(input) {
  const tags = document.querySelectorAll(".selected-filters .tags");

  tags.forEach((tag) => {
    tag.classList.remove("filter-added");

    function resetTag() {
      const filterAdded = document.querySelectorAll(".filter-added");

      filterAdded.forEach((filter) => {
        if (filter.innerText === tag.innerText) {
          filter.classList.remove("filter-added");
        }
      });

      tag.remove();
      sortByTags();
    }
    tag.lastChild.addEventListener("click", resetTag);
  });
}

async function init() {
  await getRecipes();
  displayRecipe(recipes);
  closeDropDown();
  openDropdown();
  lauchSortBy();
}

init();
