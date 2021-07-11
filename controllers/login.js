const { Users } = require("../models/data")
const validator = require('validator');
async function getLogin(req, res) {
    if (req.session.user) {
        return res.redirect('/')
    }
    res.render('login', {
        title: 'login page'
    });
}

async function logUser(req, res) {

    const validationErrors = [];
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });


    if (validationErrors.length > 0) {
        req.flash('errors', validationErrors);
        return res.redirect('/login');
    }


    const user = await Users.findOne({ where: { email: req.body.email } });

    if (!user) {
        // no usser found
        validationErrors.push({ msg: 'No User Found' });
        req.flash('errors', validationErrors);
        return res.redirect('/login');
    }

    if (user.password !== req.body.password) {
        //wrong password
        validationErrors.push({ msg: 'incorrect Password' });
        req.flash('errors', validationErrors);
        return res.redirect('/login');

    }
    // store for the cookies
    req.session.user = user;
    res.render('index', {
        user: user
    });
}


async function logout(req, res) {
    // req.logout();
    req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err);
        req.user = null;
        res.redirect('/');
    });
};


module.exports = {
    logUser,
    getLogin,
    logout
}