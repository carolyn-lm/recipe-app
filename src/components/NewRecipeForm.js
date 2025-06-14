import React from "react";
import MealSelect from "./MealSelect";
import CategoryCombobox from "./CategoryCombobox";

const NewRecipeForm = ({ newRecipe, hideRecipeForm, onUpdateForm, handleNewRecipe, categoryList }) => {
    return (
        <div className='recipe-details'>
            <div className='recipe-form'>
                <h2>New Recipe</h2>
                <button className='cancel-button' onClick={hideRecipeForm}>Cancel</button>

                <form onSubmit={(e) => handleNewRecipe(e, newRecipe)}>
                    <label>Title</label>
                    <input type='text' name='title' value={newRecipe.title} onChange={(e) => onUpdateForm(e)} required />

                    <label>Meal</label>
                    <MealSelect meal={newRecipe.meal} onUpdateForm={onUpdateForm} action="new" />

                    <label>Category</label>
                    <CategoryCombobox category={newRecipe.category} categoryList={categoryList} onUpdateForm={onUpdateForm} />

                    <label>Ingredients</label>
                    <textarea
                        name='ingredients'
                        value={newRecipe.ingredients}
                        onChange={(e) => onUpdateForm(e)}
                        required
                        placeholder='Add ingredients separated by commas - i.e. Flour, sugar, almonds'
                    />

                    <label>Instructions</label>
                    <textarea name='instructions' value={newRecipe.instructions} onChange={(e) => onUpdateForm(e)} required />

                    <label>Description</label>
                    <textarea name='description' value={newRecipe.description} onChange={(e) => onUpdateForm(e)} required />

                    <label>Image</label>
                    <input type='text' name='image_url' value={newRecipe.image_url} onChange={(e) => onUpdateForm(e)} required />

                    <label>Servings</label>
                    <input type='number' name='servings' value={newRecipe.servings} onChange={(e) => onUpdateForm(e)} required />

                    <button type='submit'>Save Recipe</button>
                </form>
            </div>
        </div>
    );
};

export default NewRecipeForm;