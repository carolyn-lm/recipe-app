import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import FilterOptions from "./FilterOptions";

import { displayToast } from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    meal: "Dinner",
    category: "",
    starred: false,
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("Dinner");

  // Load all recipes when app first loads
  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.log("Error: Could not fetch recipes");
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  }

  //returns list of previously used categories
  const categoryList = () => {
    const catList = [];
    for (let recipe of recipes) {
      if (recipe.category && !catList.includes(recipe.category)) {
        catList.push(recipe.category);
      }
    }

    return catList;
  }
  // Used when click on View button of RecipeExcerpt in All Recipes View
  const handleSelectRecipe = (recpie) => {
    setSelectedRecipe(recpie);
  }

  // Used when click on Close button in Full Recipe View
  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  }

  // Used when click on Add New Recipe button
  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  }

  // Used when click on Cancel from New Recipe Form
  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  }

  // Used when clicked on star icon from either All Recipe view or from Full Recipe view
  const handleStar = (e, recipe, fromAllRecipes = false) => {
    const updatedRecipe = { ...recipe, "starred": !recipe.starred };
    if (!fromAllRecipes) {
      setSelectedRecipe(updatedRecipe);
    }
    handleUpdateRecipe(e, updatedRecipe, true);
  }

  // Field changed on New Recipe or Edit Recipe forms
  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    } else {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    }

  }

  // Call API to create new recipe (when click Save on New Recipe Form)
  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });
      if (response.ok) {
        const data = await response.json();
        //add new recipe to recipe list
        setRecipes([...recipes, data.recipe]);
        //hide new recipe form
        setShowNewRecipeForm(false);
        //reset default recipe state
        setNewRecipe({
          title: "",
          meal: "",
          category: "",
          starred: false,
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
        displayToast("Added new recipe successfully", "success");
      } else {
        displayToast("There was an error adding the recipe", "error");
      }
    } catch (error) {
      displayToast(`Error saving new recipe: ${error}`, "error");
    }
  }

  // Call API to update selected recipe (Save on Edit Recipe Form)
  const handleUpdateRecipe = async (e, selectedRecipe, starredOnly = false) => {
    e.preventDefault();
    console.log("updating recipe", selectedRecipe);
    const { id } = selectedRecipe;
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });
      if (response.ok) {
        const data = await response.json();
        //update recipes, overwrite updated one, all others remain the same
        setRecipes(recipes.map(recipe => {
          if (recipe.id === id) {
            return data.recipe;
          } else {
            return recipe;
          }
        }));
        if (!starredOnly) {
          displayToast("Successfully updated recipe", "success");
        }
      } else {
        displayToast("There was an error updating the recipe", "error");
      }
    } catch (error) {
      displayToast(`Error saving recipe changes: ${error}`, "error");
    }
    if (!starredOnly) {
      setSelectedRecipe(null);
    }

  }

  // Call API to delete a recipe (Delete button Full Recipe Form)
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
        setSelectedRecipe(null);
        displayToast("Recipe deleted successfully", "success");
      } else {
        displayToast("There was an error deleting the recipe", "error");
      }
    } catch (error) {
      displayToast(`Error deleting recipe: ${error}`, "error");
    }
  }

  // Update search term (user types in search field)
  const updateSearchTerm = (newSearchText) => {
    setSearchTerm(newSearchText);
  }

  // filter recipes based on search term
  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
      const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description];
      return valuesToSearch.some((value => value.toLowerCase().includes(searchTerm.toLowerCase())));
    });
    return searchResults;
  }

  // Show/Hide Filter options (when click on Filter button)
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  // Change selection of filter radio buttons
  const updateFilter = (type, isOn) => {
    setFilterType(isOn ? type : "");
  }

  // Select option for filter of meal
  const updateFilterValue = (newValue) => {
    setFilterValue(newValue);
  }

  // Return filtered recipes based on type
  const filteredRecipes = () => {

    switch (filterType) {
      case "starred":
        return recipes.filter((recipe) => recipe.starred);

      case "meal":
        return recipes.filter((recipe) => recipe.meal === filterValue);

      case "category":
        return recipes.filter((recipe) => recipe.category === filterValue);

      default:
        return recipes;
    }


  }

  // Reset defaults and display all recipes (when click on logo)
  const displayAllRecipes = () => {
    setSearchTerm("");
    setFilterType(false);
    setShowFilters(false);
    setFilterValue("Dinner");
    setSelectedRecipe(null);
    setShowNewRecipeForm(false);
  }

  // Recipes to display - check for search term or a filter option, otherwise use all recipes
  const displayedRecipes = searchTerm ? handleSearch() : filterType ? filteredRecipes() : recipes;

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} displayAllRecipes={displayAllRecipes} toggleFilters={toggleFilters} />
      {showFilters && <FilterOptions filterType={filterType} updateFilter={updateFilter} updateFilterValue={updateFilterValue} categoryList={categoryList()} />}
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} categoryList={categoryList()} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe} handleStar={handleStar} categoryList={categoryList()} />}
      {!selectedRecipe && !showNewRecipeForm &&
        <div className="recipe-list">
          {displayedRecipes.map(recipe => <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} handleStar={handleStar} />)}
        </div>
      }
      <ToastContainer />
    </div>
  );
}

export default App;
