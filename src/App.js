import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt";

function App() {
  const [recipes, setRecipes] = useState([]);

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

  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        {recipes.map(recipe => <RecipeExcerpt key={recipe.id} recipe={recipe} />)}
      </div>
    </div>
  );
}

export default App;
