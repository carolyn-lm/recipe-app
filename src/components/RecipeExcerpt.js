import React from "react";
import Star from "./Star";
import { truncateText } from "../helpers/utils";

const RecipeExcerpt = ({ recipe, handleSelectRecipe, handleStar }) => {
    return (
        <article className="recipe-card">
            <figure>
                <img src={recipe.image_url} alt={recipe.title}></img>
            </figure>
            <h2>{recipe.title}</h2>
            <p className="flex-spacing">Description: {truncateText(recipe.description)}</p>
            <button onClick={() => handleSelectRecipe(recipe)}>View</button>
            <Star recipe={recipe} handleStar={handleStar} fromAllRecipes={true} />

        </article>
    );
}

export default RecipeExcerpt;