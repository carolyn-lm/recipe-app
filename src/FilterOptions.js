import MealSelect from "./components/MealSelect";

export default function FilterOptions({ filterType, updateFilter, updateFilterValue }) {
    const starredChecked = filterType === "starred";
    const mealChecked = filterType === "meal";

    return (
        <div className="filter-options">
            <input type="radio" name="filters" value="starred" checked={starredChecked} onChange={(e) => updateFilter(e.target.value, e.target.checked)} /><label>Show starred only</label>
            <input type="radio" name="filters" value="meal" checked={mealChecked} onChange={(e) => updateFilter(e.target.value, e.target.checked)} /><label>Filter by Meal</label>
            <MealSelect action="filter" updateFilterValue={updateFilterValue} />
        </div>
    )
}