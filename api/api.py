import time
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='build', static_url_path='/')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
db = SQLAlchemy(app)

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    meal = db.Column(db.String(25), nullable=False)
    category = db.Column(db.String(25), nullable=True)
    starred = db.Column(db.Boolean, nullable=False)
    ingredients = db.Column(db.String(500), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True, default='Delicious. You need to try it!')
    image_url = db.Column(db.String(500), nullable=True, default="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
    servings = db.Column(db.Integer, nullable=False)
    def __repr__(self):
        return f"Recipe(id={self.id}, title='{self.title}', description='{self.description}', servings={self.servings})"
    
with app.app_context():
    db.create_all()
    db.session.commit()

@app.route('/')
def index():
  return send_from_directory(app.static_folder, 'index.html')

#Route to fetch all recipes
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    recipes = Recipe.query.all()
    recipe_list = []
    for recipe in recipes:
        recipe_list.append({
            'id': recipe.id,
            'title': recipe.title,
            'meal': recipe.meal,
            'category': recipe.category,
            'starred': recipe.starred,
            'ingredients': recipe.ingredients,
            'instructions': recipe.instructions,
            'description': recipe.description,
            'image_url': recipe.image_url,
            'servings': recipe.servings
        })
    return jsonify(recipe_list)
    
#Route to add a new recipe
@app.route('/api/recipes', methods=['POST'])
def add_recipe():
    data = request.get_json()
    #validate the data for required fields
    required_fields = ['title', 'ingredients', 'instructions', 'servings', 'description', 'image_url']
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({'error': f"Missing required field: '{field}'"}), 400
    #create new recipe from data
    new_recipe = Recipe(
        title=data['title'],
        meal=data['meal'],
        category=data['category'],
        starred=data['starred'],
        ingredients=data['ingredients'],
        instructions=data['instructions'],
        servings=data['servings'],
        description=data['description'],
        image_url=data['image_url']
    )
    #save recipe to database
    db.session.add(new_recipe)
    db.session.commit()
    #serialize the new recipe and return it as JSON
    new_recipe_data = {
        'id': new_recipe.id,
        'title': new_recipe.title,
        'meal': new_recipe.meal,
        'category': new_recipe.category,
        'starred': new_recipe.starred,
        'ingredients': new_recipe.ingredients,
        'instructions': new_recipe.instructions,
        'servings': new_recipe.servings,
        'description': new_recipe.description,
        'image_url': new_recipe.image_url
    }
    return jsonify({'message': 'Recipe added successfully', 'recipe': new_recipe_data})

#Route to update a recipe
@app.route('/api/recipes/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    # Find existing recipe
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    print("got recipe");
    #get updated data
    data = request.get_json()
   # Validate the incoming JSON data for required fields
    required_fields = ['title', 'meal', 'ingredients', 'instructions', 'servings', 'description', 'image_url']
    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({'error': f"Missing required field: '{field}'"}), 400
    recipe.title = data['title']
    recipe.meal = data['meal']
    recipe.category = data['category']
    recipe.starred = data['starred']
    recipe.ingredients = data['ingredients']
    recipe.instructions = data['instructions']
    recipe.servings = data['servings']
    recipe.description = data['description']
    recipe.image_url = data['image_url']
    db.session.commit()
    print("did commit");
    # Serialize the updated recipe and return it as JSON
    updated_recipe = {
        'id': recipe.id,
        'title': recipe.title,
        'meal': recipe.meal,
        'category': recipe.category,
        'starred': recipe.starred,
        'ingredients': recipe.ingredients,
        'instructions': recipe.instructions,
        'servings': recipe.servings,
        'description': recipe.description,
        'image_url': recipe.image_url
    }
    return jsonify({'message': 'Recipe updated successfully', 'recipe': updated_recipe})

#Route to delete a recipe
@app.route('/api/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({'message': 'Recipe deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
