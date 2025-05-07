import React from "react";

const RecipeExcerpt = ({ recipe, handleSelectRecipe }) => {
    return (
        <article className="recipe-card">
            <figure>
                <img src={recipe.image_url} alt={recipe.title}></img>
            </figure>
            <h2>{recipe.title}</h2>
            <p className="flex-spacing">Description: {recipe.description}</p>
            <button onClick={() => handleSelectRecipe(recipe)}>View</button>
        </article>
    );
}

export default RecipeExcerpt;