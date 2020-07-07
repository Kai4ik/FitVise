const express = require("express");
const exp_app = express();
const exp_hbs = require("express-handlebars");
const { static, request, response } = require("express");
const meals = require("./models/database");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./configuration_files/confidential.env"});


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
    let e_email, e_name, e_lname, e_pass;
    if (req.body.first === "") {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Field is empty! Please enter first name!");
    }
    if (req.body.last === "") {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Field is empty! Please enter last name!");
    }
    if (req.body.email === "") {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Field is empty! Please enter email!");
    }
    if(req.body.pass === "") {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Field is empty! Please enter a password!");
    }
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(req.body.email) === false) {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Invalid Email!");
    }
    let password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password.test(req.body.pass) === false) {
        e_email = req.body.email;
        e_name = req.body.first;
        e_lname = req.body.last;
        e_pass = req.body.pass;
        error.push("*Invalid Password!");
    }
    if (error.length > 0) {
        resp.render("sign_in",{
            title: "FitVise Home",
            email_value: e_email,
            name_value: e_name,
            lname_value: e_lname,
            password_value: e_pass,
            arr_error: error, 
        });
    }
    else {
        const {first, last, email, pass} = req.body;
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
            to: `${email}`,
            from: "orozobekov.kai@gmail.com",
            subject: `Welcome ${first} ${last}`,
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

const port = process.env.PORT;
exp_app.listen(port, ()=>{
    console.log("Server is running");
})