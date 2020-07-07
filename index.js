const express = require("express");
const exp_app = express();
const exp_hbs = require("express-handlebars");
const { static, request, response } = require("express");
const meals = require("./models/database");
const bodyParser = require('body-parser');

exp_app.use(express.static("public"));

exp_app.engine('handlebars', exp_hbs());
exp_app.set('view engine', 'handlebars');
exp_app.use(bodyParser.urlencoded({ extended: false }))

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


exp_app.get("/registration", (req, resp)=>{
    resp.render("registration",{
        title: "FitVise Home",
    })
})

exp_app.post("/registration", (req, resp)=>{
    const errors=[];
    if (req.body.log_email === "") {
        errors.push("Field is empty! Please enter email!");
    }
    if(req.body.password === "") {
        errors.push("Field is empty! Please enter a password!");
    }
    if (errors.length > 0) {
        result=false;
        resp.render("registration",{
            title: "FitVise Home",
            arr_errors: errors
        });
    }
    else {
        resp.redirect("/");
    }
    
})

exp_app.get("/sign_in", (req, resp)=>{
    resp.render("sign_in",{
        title: "FitVise Home",
    })
})

exp_app.post("/sign_in", (req, resp)=>{
    const error=[];
    if (req.body.first === "") {
        error.push("*Field is empty! Please enter first name!");
    }
    if (req.body.last === "") {
        error.push("*Field is empty! Please enter last name!");
    }
    if (req.body.email === "") {
        error.push("*Field is empty! Please enter email!");
    }
    if(req.body.pass === "") {
        error.push("*Field is empty! Please enter a password!");
    }
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(req.body.email) === false) {
        error.push("*Invalid Email!");
    }
    let password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password.test(req.body.pass) === false) {
        error.push("*Invalid Password!");
    }
    if (error.length > 0) {
        resp.render("sign_in",{
            title: "FitVise Home",
            arr_error: error, 
        });
    }
    else {
        const {fname, lname, email, pass} = req.body;
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey("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");
        const msg = {
            to: `${email}`,
            from: "orozobekov.kai@gmail.com",
            subject: `Welcome ${fname} ${lname}`,
            html: `We are happy that you joined our big community!`,
        };
        sgMail.send(msg)
        .then(()=>{
            resp.redirect("/");
        })
       .catch(err=>{
           console.log(`${err}`);
       });
    }
})

exp_app.listen(3000, ()=>{
    console.log("Server is running");
})