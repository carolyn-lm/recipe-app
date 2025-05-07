import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  return (
    <div className='recipe-app'>
      <Header />
      {selectedRecipe ?
        (<RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} />)
        :
        (
          <div className="recipe-list">
            {recipes.map(recipe => <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />)}
          </div>
        )}
    </div>
  );
}

export default App;
