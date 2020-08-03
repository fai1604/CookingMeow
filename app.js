
var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    session     = require("express-session"),
    cookieParser    = require('cookie-parser'),
    flash       = require("connect-flash"),
    recipeNew   = require("./models/recipe")

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient("mongodb+srv://fai:fai160400@cluster0.n5zv5.mongodb.net/cookingmeow?retryWrites=true&w=majority", { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
      // perform actions on the collection object
    client.close();
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(require("express-session")({
    secret: 'meo cutie',
    saveUninitialized: false,
    resave: false
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    next();
 });



app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX routes
app.get("/recipes", function(req, res) {
    if(req.query.search) {   
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        recipeNew.find({name: regex}, function(err, allRecipes){
            if(err){
                console.log(err);
            } else {
                if(allRecipes.length < 1) {  
                    req.flash("error", "Resipi tidak dijumpai.") 
                    // must put return if not will get message Error [ERR_HTTP_HEADERS_SENT]:  
                    // Cannot set headers after they are sent to the client
                    return res.redirect("back")
                }
                // dont forget this line lmao
                res.render("recipes/index", {recipes: allRecipes});
            }
        });
    } else {
        recipeNew.find({}, function(err, allRecipes){
            if(err){
                console.log(err);
            } else {
                res.render("recipes/index", {recipes: allRecipes});
            }
        });
    }
})

// CREATE routes
app.post("/recipes", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var ingredients = req.body.ingredients;
    var directions = req.body.directions;
    var newRecipe = {name: name, image: image, ingredients: ingredients, directions: directions}
    recipeNew.create(newRecipe, function(err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            res.redirect("recipes")
        }
    })
})

// NEW routes
app.get("/recipes/new", function(req, res) {
    res.render("recipes/new")
});

// SHOW routes
app.get("/recipes/:id", function(req, res) {
    recipeNew.findById(req.params.id).exec(function(err, foundRecipes) {
        if(err) {
            console.log(err)
        } else {
            res.render("recipes/show", {recipes: foundRecipes})
        }
    })
})

// EDIT routes
app.get("/recipes/:id/edit", function(req, res) {
    recipeNew.findById(req.params.id, function(err, foundRecipe) {
        res.render("recipes/edit", {recipes: foundRecipe})
    })
})

// UPDATE routes
app.put("/recipes/:id", function(req, res) {
    recipeNew.findByIdAndUpdate(req.params.id, req.body.recipes, function(err, updatedRecipe) {
        if(err) {
            res.redirect("/recipes")
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Server has started!");
});
