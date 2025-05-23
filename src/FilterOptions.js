import MealSelect from "./components/MealSelect";

export default function FilterOptions({ filterType, updateFilter, updateFilterValue, categoryList }) {
    const starredChecked = filterType === "starred";
    const mealChecked = filterType === "meal";
    const categoryChecked = filterType === "category";
    const noneChecked = !filterType || filterType === "none";

    // For meal & category filter, we need to update both filter option and the currently selected option
    const handleRadioChange = (e) => {
        updateFilter(e.target.value, e.target.checked)
        const select = document.getElementById(`${e.target.value}-select`);
        updateFilterValue(select.options[select.selectedIndex].text);
    }

    // For meal & category select objects, we don't want to save the change unless that option is selected
    const handleSelectChange = (e) => {
        if (document.querySelector('input[name="filters"]:checked').value === e.target.name) {
            updateFilterValue(e.target.value);
        }
    }

    return (
        <div className="filter-options">
            <div>
                <input type="radio" name="filters" value="starred" checked={starredChecked} onChange={(e) => updateFilter(e.target.value, e.target.checked)} />
                <label>Show starred only</label>
            </div>
            <div>
                <input type="radio" name="filters" value="meal" checked={mealChecked} onChange={(e) => handleRadioChange(e)} />
                <label>Filter by Meal</label>
                <MealSelect action="filter" updateFilterValue={handleSelectChange} />
            </div>
            <div>
                <input type="radio" name="filters" value="category" checked={categoryChecked} onChange={(e) => handleRadioChange(e)} />
                <label>Filter by Category</label>
                <select id="category-select" name="category" onChange={(e) => handleSelectChange(e)}>
                    {
                        categoryList.map((category) =>
                            <option key={category} value={category} >{category}</option>
                        )
                    }
                </select>
            </div>
            <div>
                <input type="radio" name="filters" value="none" checked={noneChecked} onChange={(e) => updateFilter(e.target.value, e.target.checked)} />
                <label>All Recipes</label>
            </div>
        </div>
    )
}