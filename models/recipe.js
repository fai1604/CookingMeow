var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    ingredients: String,
    directions: String
})

module.exports = mongoose.model("Recipe", recipeSchema);