// const db = require('../db')
const userMatchObject = require('../objects/userManage.object');
const userManage = require('../models/userCreat.model');

const md5 = require('md5')

module.exports.postLogin = async function(req , res , next){
    var userName = req.body.name;
    var pass = req.body.pass;
    var user;

    await userManage.find({
        name: req.body.name
    }, function(err, data) {
        
        if (err) {
            if (err) return next(err);
        }

        user = new userMatchObject(data[0].name , data[0]._id , data[0].pass , data[0].vendor);
       
    })


    var error = [];
   

       if (!user) {
           res.render('auth/login', {
               error: [
                   'Name does not exist!'
               ],
               value: req.body
           });
           return;
       }

       if (user.pass !== md5(pass)) {
           res.render('auth/login', {
               error: [
                   'Wrong password!'
               ],
               value: req.body
           });
           return;
       } 
    next();
}

module.exports.requestAuth = async function(req , res , next){
    if(!req.signedCookies.userId){
        res.redirect('/auth/login');
        return;
    }

    var user;

    await userManage.find({
        _id: req.signedCookies.userId
    }, function (err, data) {

        if (err) {
            if (err) return next(err);
        }
        if (data)
        user = new userMatchObject(data[0].name, data[0]._id, data[0]._pass, data[0].vendor);

    })

    if(!user){
        res.redirect('/auth/login');
        return;
    }
    res.locals.user = user;
    next();
}

module.exports.postCreat = function (req, res, next) {
    var non_input = [];

    if (!req.body.name) {
        non_input.push("Name is require!");
    }

    if (!req.body.vendor) {
        non_input.push("Phone is require!");
    }

    if (!req.body.pass) {
        non_input.push("Password is require!");
    }

    if (non_input.length) {
        res.render('auth/creat', {
            request: non_input,
            value: req.body
        });
        return;
    }
    next();
}
