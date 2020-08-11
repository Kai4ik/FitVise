const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

var Registration = new Schema ({
    customer: {
        type: Boolean,
        default: false
    },
    first: String,
    last: String,
    email: {
        type: String,
        unique: true
    },
    pass: String
});

const db = mongoose.createConnection(`mongodb+srv://Kai4ik:mongoisweird@regpage.ztqqo.mongodb.net/users?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true });
var User = db.model('registered_users', Registration);

db.on('error',(err)=>{
    console.log("Error occurred during connecting to db ");
});
db.once('open',()=>{
    console.log("Connection to db successfully established!");
});

module.exports.addUser = function(info) {
    return new Promise((resolve, reject)=>{
        const ver_user = new User(info);
        console.log(ver_user);
        bcrypt.genSalt(15) 
        .then(salt=>bcrypt.hash(ver_user.pass,salt))
        .then(hash=>{
            ver_user.pass = hash;
            ver_user.save((err_message)=>{
                if (err_message){
                    console.log("Error occurred: " + err_message);
                    reject(err_message);
                }
                else {
                    console.log("Successfully addded!");
                    resolve();
                }
            });
        })
        .catch(err=>{
            console.log(err);
            reject("Password was not successfully hashed! ");
        });
    });
}

module.exports.findUser = (givenEmail) =>{
    return new Promise ((res, rej)=>{
    User.find({email: givenEmail})
        .exec()
        .then((foundUser)=>{
            if(foundUser.length !=0 )
                res(foundUser.map(item=>item.toObject()));
            else
                rej("User does not exist!");
        }).catch((err)=>{
                console.log("Error Retrieving Users! "+err);
        });
    });
}

module.exports.checkUserExistence = (user_data) =>{
        return new Promise ((res, rej)=>{
            if (user_data){
                this.findUser(user_data.log_email).then((ex_user)=>{
                    bcrypt.compare(user_data.password, ex_user[0].pass).then((result) => {
                        if (result){
                            res(ex_user);
                        }
                        else{
                            rej("password don't match");
                            return;
                        }
                    });
                }).catch((err)=>{
                    rej(err);
                    return;
                });
        }
    });
}