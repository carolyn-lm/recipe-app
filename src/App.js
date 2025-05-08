import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

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

  const handleSelectRecipe = (recpie) => {
    setSelectedRecipe(recpie);
  }

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  }

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  }

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  }

  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    } else {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    }

  }

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
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
      } else {
        console.log("There was an error adding the recipe");
      }
    } catch (error) {
      console.log("Error saving new recipe: ", error);
    }
  }

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
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
        console.log("Successfully updated recipe");
      } else {
        console.log("There was an error updating the recipe");
      }
    } catch (error) {
      console.log("Error saving recipe changes: ", error);
    }
    setSelectedRecipe(null);
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} />}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} />}
      {!selectedRecipe && !showNewRecipeForm &&
        <div className="recipe-list">
          {recipes.map(recipe => <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />)}
        </div>
      }
    </div>
  );
}

export default App;
