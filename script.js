"use strict";

const storageKey = "vedaTask24Recipes";

const defaultRecipes = [
    {
        id: "recipe-1",
        title: "Creamy Garlic Pasta",
        category: "Dinner",
        time: "25 min",
        ingredients: [
            "200 g pasta",
            "4 cloves garlic",
            "1 cup fresh cream",
            "1/2 cup Parmesan cheese",
            "1 tablespoon butter",
            "Black pepper",
            "Salt"
        ],
        steps: [
            "Boil the pasta in salted water.",
            "Melt butter and sauté the garlic.",
            "Add cream and Parmesan cheese.",
            "Season with salt and black pepper.",
            "Add pasta and mix well.",
            "Serve hot with fresh herbs."
        ],
        description:
            "A creamy garlic pasta recipe that is quick, simple, and perfect for dinner."
    },

    {
        id: "recipe-2",
        title: "Vegetable Sandwich",
        category: "Breakfast",
        time: "15 min",
        ingredients: [
            "4 bread slices",
            "1 tomato",
            "1 cucumber",
            "1 onion",
            "2 tablespoons mayonnaise",
            "1 tablespoon butter",
            "Salt and pepper"
        ],
        steps: [
            "Slice the vegetables.",
            "Spread butter and mayonnaise on the bread.",
            "Add tomato, cucumber, and onion.",
            "Season with salt and pepper.",
            "Cover with another bread slice.",
            "Toast and serve."
        ],
        description:
            "A quick and healthy vegetable sandwich for a simple breakfast."
    },

    {
        id: "recipe-3",
        title: "Paneer Butter Masala",
        category: "Lunch",
        time: "40 min",
        ingredients: [
            "250 g paneer",
            "2 tomatoes",
            "1 onion",
            "2 tablespoons butter",
            "1/2 cup cream",
            "1 teaspoon garam masala",
            "Salt"
        ],
        steps: [
            "Cut the paneer into cubes.",
            "Cook onion and tomatoes until soft.",
            "Blend the cooked mixture.",
            "Heat butter and add the blended mixture.",
            "Add spices, cream, and salt.",
            "Add paneer and simmer for a few minutes."
        ],
        description:
            "A rich and flavorful paneer curry with a smooth buttery gravy."
    },

    {
        id: "recipe-4",
        title: "Chocolate Mug Cake",
        category: "Dessert",
        time: "10 min",
        ingredients: [
            "4 tablespoons flour",
            "2 tablespoons cocoa powder",
            "2 tablespoons sugar",
            "3 tablespoons milk",
            "2 tablespoons oil",
            "1/4 teaspoon baking powder",
            "Chocolate chips"
        ],
        steps: [
            "Mix flour, cocoa powder, sugar, and baking powder.",
            "Add milk and oil.",
            "Mix until smooth.",
            "Add chocolate chips.",
            "Microwave for about 90 seconds.",
            "Let it cool slightly and serve."
        ],
        description:
            "A soft chocolate cake prepared quickly in a mug."
    },

    {
        id: "recipe-5",
        title: "Fresh Fruit Salad",
        category: "Breakfast",
        time: "10 min",
        ingredients: [
            "1 apple",
            "1 banana",
            "1 orange",
            "1 cup grapes",
            "1 tablespoon honey",
            "1 teaspoon lemon juice"
        ],
        steps: [
            "Wash and chop all the fruits.",
            "Add the fruits to a large bowl.",
            "Mix honey and lemon juice.",
            "Pour the dressing over the fruit.",
            "Toss gently.",
            "Serve fresh."
        ],
        description:
            "A colorful and refreshing fruit salad made with fresh seasonal fruits."
    }
];

const recipeForm = document.getElementById("recipeForm");
const recipeId = document.getElementById("recipeId");
const recipeTitle = document.getElementById("recipeTitle");
const recipeCategory = document.getElementById("recipeCategory");
const recipeTime = document.getElementById("recipeTime");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeSteps = document.getElementById("recipeSteps");
const recipeDescription = document.getElementById("recipeDescription");

const recipeGrid = document.getElementById("recipeGrid");
const recipeCount = document.getElementById("recipeCount");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const addRecipeButton = document.getElementById("addRecipeButton");

const formModal = document.getElementById("formModal");
const detailModal = document.getElementById("detailModal");

const closeFormModal = document.getElementById("closeFormModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const cancelFormButton = document.getElementById("cancelFormButton");

const formModalTitle = document.getElementById("formModalTitle");
const formMessage = document.getElementById("formMessage");

const detailCategory = document.getElementById("detailCategory");
const detailTitle = document.getElementById("detailTitle");
const detailTime = document.getElementById("detailTime");
const detailDescription = document.getElementById("detailDescription");
const detailIngredients = document.getElementById("detailIngredients");
const detailSteps = document.getElementById("detailSteps");

let selectedCategory = "All";
let recipes = loadRecipes();

function loadRecipes() {
    try {
        const savedRecipes = localStorage.getItem(storageKey);

        if (!savedRecipes) {
            localStorage.setItem(
                storageKey,
                JSON.stringify(defaultRecipes)
            );

            return [...defaultRecipes];
        }

        const parsedRecipes = JSON.parse(savedRecipes);

        if (!Array.isArray(parsedRecipes)) {
            localStorage.setItem(
                storageKey,
                JSON.stringify(defaultRecipes)
            );

            return [...defaultRecipes];
        }

        return parsedRecipes;

    } catch (error) {
        localStorage.setItem(
            storageKey,
            JSON.stringify(defaultRecipes)
        );

        return [...defaultRecipes];
    }
}

function saveRecipes() {
    localStorage.setItem(
        storageKey,
        JSON.stringify(recipes)
    );
}

function createId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getFilteredRecipes() {
    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    return recipes.filter(function (recipe) {
        const matchesCategory =
            selectedCategory === "All" ||
            recipe.category === selectedCategory;

        const searchableText = [
            recipe.title,
            recipe.category,
            recipe.description
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchTerm === "" ||
            searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });
}

function renderRecipes() {
    const filteredRecipes = getFilteredRecipes();

    recipeGrid.innerHTML = "";

    recipeCount.textContent =
        `${filteredRecipes.length} ${
            filteredRecipes.length === 1
                ? "recipe"
                : "recipes"
        }`;

    emptyState.hidden =
        filteredRecipes.length !== 0;

    if (filteredRecipes.length === 0) {
        return;
    }

    filteredRecipes.forEach(function (recipe) {
        const card = document.createElement("article");

        card.className = "recipe-card";

        card.innerHTML = `
            <div class="recipe-top">
                <span class="category-badge">
                    ${escapeHtml(recipe.category)}
                </span>

                <h3>
                    ${escapeHtml(recipe.title)}
                </h3>

                <p class="recipe-time">
                    ⏱ ${escapeHtml(recipe.time)}
                </p>
            </div>

            <div class="recipe-body">
                <p class="recipe-description">
                    ${escapeHtml(
                        recipe.description ||
                        "No description added."
                    )}
                </p>
            </div>

            <div class="recipe-actions">
                <button
                    type="button"
                    class="small-button"
                    data-action="view"
                    data-id="${recipe.id}"
                >
                    View
                </button>

                <button
                    type="button"
                    class="small-button"
                    data-action="edit"
                    data-id="${recipe.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="small-button delete"
                    data-action="delete"
                    data-id="${recipe.id}"
                >
                    Delete
                </button>
            </div>
        `;

        recipeGrid.appendChild(card);
    });
}

function openFormModal(recipe = null) {
    formMessage.textContent = "";

    if (recipe) {
        formModalTitle.textContent = "Edit Recipe";

        recipeId.value = recipe.id;
        recipeTitle.value = recipe.title;
        recipeCategory.value = recipe.category;
        recipeTime.value = recipe.time;
        recipeIngredients.value =
            recipe.ingredients.join("\n");
        recipeSteps.value =
            recipe.steps.join("\n");
        recipeDescription.value =
            recipe.description || "";

    } else {
        formModalTitle.textContent = "Add Recipe";

        recipeForm.reset();

        recipeId.value = "";

        recipeCategory.value = "Breakfast";
    }

    formModal.hidden = false;

    document.body.classList.add("modal-open");

    setTimeout(function () {
        recipeTitle.focus();
    }, 50);
}

function closeForm() {
    formModal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );

    formMessage.textContent = "";
}

function openDetailModal(recipe) {
    detailCategory.textContent =
        recipe.category;

    detailTitle.textContent =
        recipe.title;

    detailTime.textContent =
        `Preparation time: ${recipe.time}`;

    detailDescription.textContent =
        recipe.description ||
        "No description added.";

    detailIngredients.innerHTML = "";

    recipe.ingredients.forEach(function (ingredient) {
        const item = document.createElement("li");

        item.textContent = ingredient;

        detailIngredients.appendChild(item);
    });

    detailSteps.innerHTML = "";

    recipe.steps.forEach(function (step) {
        const item = document.createElement("li");

        item.textContent = step;

        detailSteps.appendChild(item);
    });

    detailModal.hidden = false;

    document.body.classList.add(
        "modal-open"
    );

    setTimeout(function () {
        closeDetailModal.focus();
    }, 50);
}

function closeDetail() {
    detailModal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );
}

recipeForm.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const title =
            recipeTitle.value.trim();

        const category =
            recipeCategory.value;

        const time =
            recipeTime.value.trim();

        const ingredients =
            recipeIngredients.value
                .split("\n")
                .map(function (item) {
                    return item.trim();
                })
                .filter(Boolean);

        const steps =
            recipeSteps.value
                .split("\n")
                .map(function (item) {
                    return item.trim();
                })
                .filter(Boolean);

        const description =
            recipeDescription.value.trim();

        if (
            title === "" ||
            category === "" ||
            time === "" ||
            ingredients.length === 0 ||
            steps.length === 0
        ) {
            formMessage.textContent =
                "Please fill in all required fields.";

            return;
        }

        const existingId =
            recipeId.value.trim();

        if (existingId !== "") {
            const index =
                recipes.findIndex(function (recipe) {
                    return recipe.id === existingId;
                });

            if (index === -1) {
                formMessage.textContent =
                    "Recipe could not be found.";

                return;
            }

            recipes[index] = {
                id: existingId,
                title,
                category,
                time,
                ingredients,
                steps,
                description
            };

        } else {
            recipes.unshift({
                id: createId(),
                title,
                category,
                time,
                ingredients,
                steps,
                description
            });
        }

        saveRecipes();
        renderRecipes();
        closeForm();
    }
);

recipeGrid.addEventListener(
    "click",
    function (event) {
        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const id =
            button.dataset.id;

        const recipe =
            recipes.find(function (item) {
                return item.id === id;
            });

        if (!recipe) {
            return;
        }

        if (action === "view") {
            openDetailModal(recipe);
            return;
        }

        if (action === "edit") {
            openFormModal(recipe);
            return;
        }

        if (action === "delete") {
            const confirmed =
                window.confirm(
                    `Are you sure you want to delete "${recipe.title}"?`
                );

            if (!confirmed) {
                return;
            }

            recipes = recipes.filter(
                function (item) {
                    return item.id !== id;
                }
            );

            saveRecipes();
            renderRecipes();
        }
    }
);

categoryFilters.addEventListener(
    "click",
    function (event) {
        const button =
            event.target.closest(
                ".filter-button"
            );

        if (!button) {
            return;
        }

        selectedCategory =
            button.dataset.category;

        document
            .querySelectorAll(".filter-button")
            .forEach(function (item) {
                item.classList.toggle(
                    "active",
                    item === button
                );
            });

        renderRecipes();
    }
);

searchInput.addEventListener(
    "input",
    renderRecipes
);

addRecipeButton.addEventListener(
    "click",
    function () {
        openFormModal();
    }
);

closeFormModal.addEventListener(
    "click",
    closeForm
);

cancelFormButton.addEventListener(
    "click",
    closeForm
);

closeDetailModal.addEventListener(
    "click",
    closeDetail
);

formModal.addEventListener(
    "click",
    function (event) {
        if (event.target === formModal) {
            closeForm();
        }
    }
);

detailModal.addEventListener(
    "click",
    function (event) {
        if (event.target === detailModal) {
            closeDetail();
        }
    }
);

document.addEventListener(
    "keydown",
    function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (!formModal.hidden) {
            closeForm();
        }

        if (!detailModal.hidden) {
            closeDetail();
        }
    }
);

renderRecipes();