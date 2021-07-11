const { Users } = require("../models/data")
const bcrypt = require("bcrypt");
const validator = require('validator');
async function getSignup(req, res) {
    if (req.session.user) {
        res.redirect('/')
    }
    res.render('signup', {
        title: 'Signup page'
    });
}

async function createUser(req, res) {

    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

    if (validationErrors.length > 0) {
        req.flash('errors', validationErrors);
        return res.redirect('/signup');
    }

    const foundUser = await Users.findOne({ where: { email: req.body.email } });
    if (foundUser) {
        validationErrors.push({ msg: 'User Already Exists' })
        req.flash('errors', validationErrors);
        return res.redirect('/signup');
    }

    const userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    const user = await Users.create(userData);

    // store for the cookies    
    req.session.user = user;
    res.render('index', {
        user: user
    });
}

async function getUser(req, res) {

    const foundUser = await Users.findOne({ email: req.body.email });

    if (!foundUser) {
        // throw error not found any email 
    }

    if (await bcrypt.compare(foundUser.password, req.body.password)) {
        // set the login token
        res.send('Logged in');
    }

    // store for the cookies
    res.send('Wrong Passwordu');
}

module.exports = {
    createUser,
    getUser,
    getSignup
}