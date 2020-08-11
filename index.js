const express = require("express");
const exp_hbs = require("express-handlebars");
const path = require("path");
const { static, request, response } = require("express");
const meals = require("./models/meals");
const bodyParser = require('body-parser');
const multer = require("multer");
const db = require("./models/users");
const cart = require("./shopping_cart");
const dbp = require("./models/meals");
const clientSessions = require("client-sessions");
require('dotenv').config({path:"./configuration_files/confidential.env"});


const { DataSessionInstance } = require("twilio/lib/rest/wireless/v1/sim/dataSession");
const { validateRequestWithBody } = require("twilio/lib/webhooks/webhooks");

const exp_app = express();


exp_app.engine('handlebars', exp_hbs());
exp_app.set('view engine', 'handlebars');
exp_app.use(express.static("public"));
exp_app.use(bodyParser.urlencoded({ extended: false }));
exp_app.use(bodyParser.json());
exp_app.use(clientSessions({
    cookieName: "session", 
    secret: "fitvisethebestonlinestore666", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));

const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
 });
  
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      return cb(null, true);
    } else {
      return cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

function checkUser(req, res, next) {
    if (!req.session.user) {
      req.session.user = false;
      next();
    } 
    else {
      next();
    }
}

exp_app.get("/", checkUser, (req, resp)=>{
    dbp.getTopMeals().then((data)=>{
        resp.render("home",{meals: (data.length!=0)?data:undefined,  user: req.session.user});
   }).catch((err)=>{
       resp.render("home"); 
   })
})


exp_app.get("/top_meals", checkUser, (req, resp)=>{
    dbp.getMeals().then((data)=>{
         resp.render("top_meals",{meals: (data.length!=0)?data:undefined, user: req.session.user});
    }).catch((err)=>{
        resp.render("top_meals"); 
    })
});

exp_app.post("/addProduct", (req,res)=>{
    dbp.getItem(req.body.name)
    .then((item)=>{
        cart.addItem(item)
        .then((numItems)=>{
            res.json({data: numItems});
        }).catch(()=>{
            res.json({message:"error adding"});
        })
    }).catch(()=>{
        res.json({message: "No Items found"})
    })
});

//Route to see cart and items
exp_app.get("/cart",(req,res)=>{
    var cartData = {
        cart:[],
        total:0
    } ;
    cart.getShoppingCart().then((items)=>{
        cartData.cart = items;
        cart.checkout().then((total)=>{
            cartData.total = total;
            res.render("checkout", {data:cartData, layout:false});
        }).catch((err)=>{
            res.send("There was an error getting total: " +err);
        });
    })
    .catch((err)=>{
        res.send("There was an error: " + err );
    });
});

 
exp_app.post("/removeItem", (req,res)=>{ 
    var cartData = {
        cart:[],
        total:0
    } ;
    cart.removeItem(req.body.name).then(cart.checkout)
    .then((inTotal)=>{
        cartData.total = inTotal;
        cart.getShoppingCart().then((items)=>{
           cartData.cart = items; 
           res.json({data: cartData});
        }).catch((err)=>{res.json({error:err});});
    }).catch((err)=>{
        res.json({error:err});
    })
});

exp_app.post("/removeAll", (req,res)=>{ 
    var cartData = {
        cart:[],
        total:0
    }; 
    cart.removeAll().then(cart.checkout)
        .then((inTotal)=>{
            cartData.total = inTotal;
            cart.getShoppingCart().then((items)=>{
            cartData.cart = items; 
            res.json({data: cartData});
            }).catch((err)=>{res.json({error:err});});
        }).catch((err)=>{
            res.json({error:err});
        })
});

exp_app.get("/add_meals", checkUser, (req, resp)=>{
    resp.render("add_meals",{title: "FitVise Meals", user: req.session.user})
});

exp_app.post("/add_meals", upload.single("meal_image"), (req, resp)=>{
    req.body.image = req.file.filename;
        dbp.addMeal(req.body).then(()=>{
            resp.redirect("/top_meals");
        }).catch((err)=>{
            console.log("Error adding meal package: "+ err);
        });
});
  


exp_app.get("/logout",(req,resp)=>{
    req.session.reset();
    resp.redirect("/registration");
});
 
exp_app.get("/registration", (req, resp)=>{
    resp.render("registration",{
        title: "FitVise Home",
    })
})

exp_app.post("/registration", (req, resp)=>{
    const errors=[];
    let e_email, e_pass;
    if (req.body.log_email === "") {
        e_email = req.body.log_email;
        e_pass = req.body.password;
        errors.push("Field is empty! Please enter email!");
    }
    if(req.body.password === "") {
        e_email = req.body.log_email;
        e_pass = req.body.password;
        errors.push("Field is empty! Please enter a password!");
    }
    if (errors.length > 0) {
        result=false;
        resp.render("registration",{
            title: "FitVise Home",
            email_value: e_email,
            password_value: e_pass,
            arr_errors: errors
        });
    }
    else {
        db.checkUserExistence(req.body)
        .then((userData)=>{
            req.session.user = userData[0];
            resp.redirect("/");
        })
        .catch((err_message)=>{
            console.log("Error occurred: " + err_message);
            resp.redirect("/registration")
        });
    }
})

exp_app.get("/sign_in", (req, resp)=>{
    resp.render("sign_in",{
        title: "FitVise Home"
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
            arr_error: error
        });
    }
    else {
        const {first, last, email} = req.body;
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
       db.addUser(req.body).then(()=>{
            resp.redirect("/");
      }).catch((err)=>{
            console.log("Error adding student: "+ err);
      });

    }
})

const port = process.env.PORT;
exp_app.listen(port, ()=>{
    console.log("Server is running");
})