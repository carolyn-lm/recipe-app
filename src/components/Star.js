export default function Star({ recipe, handleStar, fromAllRecipes }) {

    return (
        <p className="this-week-star" onClick={(e) => handleStar(e, recipe, fromAllRecipes)}>
            {recipe.starred ?
                <i className="fa-solid fa-star"></i> :
                <i className="fa-regular fa-star"></i>}
        </p>
    )

}