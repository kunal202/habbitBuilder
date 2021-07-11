const express = require('express');
const { db } = require('./models/data');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const { createUser, getSignup } = require('./controllers/signup');
const { createHabbit, getHabbit, createdHabbits } = require('./controllers/habbit');
const flash = require('express-flash');
const redis = require('redis')
const { Habbits } = require('../habbitbuilder/models/data');
const session = require('express-session');
const { getLogin, logUser, logout } = require('./controllers/login');
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/views'));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new RedisStore({
        client: redisClient
    })
}));
app.use(flash());
app.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.render(path.join(__dirname + '/views/index.pug'));
    }
    const habbit = await Habbits.findAll(
        {
            where: {
                username: req.session.user.username
            }
        })
    res.render(path.join(__dirname + '/views/index.pug'), {
        habbits: habbit,
        user: req.session.user.username
    });
})
async function isAuthenticated(req, res, next) {

    if (!req.session.user) {
        return res.redirect('/login');
    }
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    return next();
}
app.get('/signup', getSignup);
app.post('/signup', createUser);
app.get('/login', getLogin);
app.post('/login', logUser);
app.post('/habbit', createHabbit);
app.get('/habbit', isAuthenticated, getHabbit);
app.get('/createdhabbits', createdHabbits)
app.get('/logout', logout);
db.sync().then(() => {
    app.listen(8000, () => {
        console.log('listening on port http://localhost:8000');
    })
})