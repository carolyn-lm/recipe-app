export default function CategoryCombobox({ category, categoryList, onUpdateForm }) {

    return (
        <>
            <input type='text' name='category' list='category-list' value={category} onChange={(e) => onUpdateForm(e, "update")} />
            {categoryList.length > 0 && <datalist id='category-list'>
                {categoryList.map((cat) => <option value={cat}>{cat}</option>)}
            </datalist>
            }
        </>
    )

}