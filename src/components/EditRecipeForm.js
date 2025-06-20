import React from "react";
import MealSelect from "./MealSelect";
import CategoryCombobox from "./CategoryCombobox";

const EditRecipeForm = ({ selectedRecipe, handleCancel, onUpdateForm, handleUpdateRecipe, categoryList }) => {
    return (
        <div className='recipe-form'>
            <h2>Edit "{selectedRecipe.title}"</h2>
            <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            <form onSubmit={(e) => handleUpdateRecipe(e, selectedRecipe)}>
                <label>Title</label>
                <input type='text' name='title' value={selectedRecipe.title} onChange={(e) => onUpdateForm(e, "update")} required />
                <label>Meal</label>
                <MealSelect currentSelection={selectedRecipe.meal} onUpdateForm={onUpdateForm} action="update" />
                <label>Category</label>
                <CategoryCombobox category={selectedRecipe.category} categoryList={categoryList} onUpdateForm={onUpdateForm} />
                <label>Ingredients</label>
                <textarea name='ingredients' value={selectedRecipe.ingredients} onChange={(e) => onUpdateForm(e, "update")} required />
                <label>Instructions</label>
                <textarea name='instructions' value={selectedRecipe.instructions} onChange={(e) => onUpdateForm(e, "update")} required />
                <label>Description</label>
                <textarea name='description' value={selectedRecipe.description} onChange={(e) => onUpdateForm(e, "update")} required />
                <label>Image</label>
                <input type='text' name='image_url' value={selectedRecipe.image_url} onChange={(e) => onUpdateForm(e, "update")} required />
                <label>Servings</label>
                <input type='number' name='servings' value={selectedRecipe.servings} onChange={(e) => onUpdateForm(e, "update")} required />
                <button type='submit'>Update Recipe</button>
            </form>
        </div>
    );
};
export default EditRecipeForm;