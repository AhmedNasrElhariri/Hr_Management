const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup',{
        errorMessage: message
    });
}

exports.postSignUp = (req,res,next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({email:email})
    .then(admin => {
        if(admin){
            req.flash('error','The Email already exist, enter another one');
            return res.redirect('/signup');
        }
        bcrypt.hash(password,12)
        .then(hashedPassword => {
            const admin = new Admin({
                name: name,
                email: email,
                password: hashedPassword
            });
            return admin.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signin',{
        errorMessage: message
    });
}

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    Admin.findOne({email:username})
         .then(admin => {
             if(!admin){
                 req.flash('error','Email is not valid, please enter correct email');
                 return res.redirect('/login');
             }
             bcrypt.compare(password,admin.password)
                   .then(doMatch => {
                       if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.admin = admin;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/admin/employees');
                        }); 
                       }
                       req.flash('error','Password is incorrect , enter valid password');
                       res.redirect('/login');
                   })
                   .catch(err => console.log(err));
         })
         .catch(err => console.log(err));
         
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
}