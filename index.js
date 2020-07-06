const express = require("express");
const exp_app = express();
const exp_hbs = require("express-handlebars");
const { static } = require("express");
const meals = require("./models/database");

exp_app.use(express.static("public"));

exp_app.engine('handlebars', exp_hbs());
exp_app.set('view engine', 'handlebars');


exp_app.get("/", (req, resp)=>{
    resp.render("home",{
        title: "FitVise Home",
        meals: meals.get_top()
    })
})

exp_app.get("/top_meals", (req, resp)=>{
    resp.render("top_meals",{
        title: "FitVise Meals",
        meals: meals.get_meals()
    })
})


exp_app.listen(3000, ()=>{
    console.log("Server is running");
})