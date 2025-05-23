export default function MealSelect({ currentSelection, onUpdateForm, action, updateFilterValue }) {
    const options = ["Breakfast", "Lunch", "Dinner", "Side", "Snack", "Dessert"];

    const handleChange = (e) => {
        if (action === "filter") {
            updateFilterValue(e);
        } else {
            onUpdateForm(e, action);
        }
    }
    return (
        <select id="meal-select" name="meal" defaultValue={currentSelection ? currentSelection : "Dinner"} onChange={(e) => handleChange(e)}>
            {options.map((meal) =>
                <option key={meal} value={meal}>{meal}</option>
            )}
        </select>
    )
}