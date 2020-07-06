const meal1 = {
    name: "Pirate Meal", 
    desc: "Seafood - fish, shrimps, oysters", 
    price: "60$",
    image: "seafood.png",
    category: "Non-vegetarian",
    meals_numb: 5,
    top: true
}

const meal2 = {
    name: "VegiMeal", 
    desc:"Only fresh vegetables and fruits", 
    price: "75$",
    image: "fruits1.png",
    category: "Vegetarian",
    meals_numb: 6,
    top: true
}

const meal3 = {
    name: "Taste of Asia", 
    desc:"Japanese, Korean, Thai cuisine", 
    price: "50$",
    image: "noodle.png",
    category: "Non-vegetarian",
    meals_numb: 6,
    top: true
}

const meal4 = {
    name: "ChickiVise", 
    desc:"Meals with very delicious chicken", 
    price: "70$",
    image: "dinner.png",
    category: "Non-vegetarian",
    meals_numb: 5,
    top: true
}

const meal5 = {
    name: "Spicy Mix", 
    desc:"Mexican, Thai Spicy Food", 
    price: "70$",
    image: "chili.png",
    category: "Non-vegetarian, Spicy",
    meals_numb: 6,
    top: false
}

const meal6 = {
    name: "ItalyVise", 
    desc:"Pasta, risotto, healthy pizza", 
    price: "80$",
    image: "pasta.png",
    category: "Non-vegetarian",
    meals_numb: 6,
    top: false
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

const meals = {
    meals_arr: [meal1, meal2, meal3, meal4, meal5, meal6, meal7],
    get_meals() {
        return this.meals_arr;
    },

    get_top() {
        let top_meals = [];
        for(let i=0; i<this.meals_arr.length; ++i) {
            if(this.meals_arr[i].top === true) {
                top_meals.push(this.meals_arr[i]);
            }
        }
        return top_meals;
    }
}

module.exports = meals;