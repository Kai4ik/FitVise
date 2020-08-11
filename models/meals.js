const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Meal = new Schema ({
    name: String,
    price: Number,
    desc: String,
    categ: String,
    nof: String,
    top: String,
    image: String
});

const db = mongoose.createConnection(`mongodb+srv://Kai4ik:mongoisweird@regpage.ztqqo.mongodb.net/meal_packages?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true });
var Meals = db.model('meals', Meal);

db.on('error',(err)=>{
    console.log("Error occurred during connecting to db ");
});
db.once('open',()=>{
    console.log("Connection to dbp successfully established!");
});

module.exports.addMeal = function(info) {
    return new Promise((resolve, reject)=>{
        const meal = new Meals(info);
        console.log(meal);
        meal.save((err_message)=>{
                if (err_message){
                    console.log("Error occurred: " + err_message);
                    reject(err_message);
                }
                else {
                    console.log("Successfully addded!");
                    resolve();
                }
            });
    });
}

module.exports.getMeals = function(){
    return new Promise((resolve,reject)=>{
        Meals.find() 
        .exec() 
        .then((existingMeals)=>{
            resolve(existingMeals.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retrieving Meals:"+err);
                reject(err);
        });
    });
}

module.exports.getTopMeals = function(){
    return new Promise((resolve,reject)=>{
        Meals.find({top: "on"}) 
        .exec() 
        .then((existingTopMeals)=>{
            if(existingTopMeals.length !=0 )
                resolve(existingTopMeals.map(item=>item.toObject()));
            else
                reject("No Top Meals found");
        }).catch((err)=>{
                console.log("Error Retrieving Meals:"+err);
                reject(err);
        });
    });
}

module.exports.getItem = (inName)=>{
    return new Promise((res, rej)=>{
        Meals.find({name: inName})
        .exec()
        .then((item)=>{
            if (item.length > 0 ){
                console.log("Got Item: "+ JSON.stringify(item[0]));
                res(item[0]);
            }
            else  {
                rej("Meal Was not found! ");
            }
        }).catch((err)=>{
            console.log("Error Finding Meal! "+err);
            rej(err);
        });    
    });
}



module.exports.editMeal = (meal)=>{
    return new Promise((resolve, reject)=>{
        Meals.updateOne(
            {studentNumber : meal.studentNumber}, //what do we updateBy/How to find entry
            {$set: {  //what fields are we updating
                name: meal.name,
                price: meal.price,
                desc: meal.desc,
                categ: meal.categ,
                nof: meal.nof,
                top: meal.top
            }})
            .exec()
            .then(()=>{
                console.log(`Meal ${meal.name} has been updated`);
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        });
}


const meal7 = {
    name: "Fruity ", 
    desc:"All meals come with fresh fruits", 
    price: "65$",
    image: "watermelon.png",
    category: "Vegetarian",
    meals_numb: 5,
    top: false
}


