const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/index');
const flash = require('connect-flash');
const axios = require('axios');

const passport = require('passport');
const session = require('express-session');

const authControl = require('./helpers/authControl');

// imported routes
const emailRoutes = require('./api/routes/email');
const userRoutes = require('./api/routes/user');
const projectRoutes = require('./api/routes/projects');


const testRoutes = require('./api/routes/test'); // do usuniecia

// connect to mongoDB
mongoose.connect(config.database);
let db = mongoose.connection;

// mongoose.Promise = global.Promise; // fix logs in console with message deprecated promise

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
    console.log(err);
});

// Init app
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads')); // it make folder uploads available to public if user type localhost:3000/uploads/img.png into browser it will show the image
app.use('/admin/uploads', express.static(__dirname + '/uploads'));
app.use('/admin/projects/uploads', express.static(__dirname + '/uploads'));

app.use(session({
    secret: 'qwudsjdsaiwpsc',
    resave: false,
    saveUninitialized: false
}));

// Express Messages Middleware
app.use(require('connect-flash')());

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// API routes - handle requests
app.use('/user', userRoutes);
app.use('/email', emailRoutes);
app.use('/project', projectRoutes);


app.use('/test', testRoutes); // do usuniecia

// index page
app.get('/', function (req, res) {
    res.render('pages/index', {title: 'Strona główna'});
});

app.get('/admin', function (req, res) {
    res.render('pages/admin', {title: 'Admin page'});
});

app.get('/o-nas', function (req, res) {
    res.render('pages/o-nas', {title: 'O nas'});
});

app.get('/oferta', function (req, res) {
    res.render('pages/oferta', {title: 'Oferta'});
});

app.get('/realizacje', function (req, res) {
    let obj;
    axios.get(`${config.host}/project`)
        .then(function (response) {
            obj = response.data;
        })
        .catch(function (error) {
            console.log(error);
        }).then(() => {
            res.render('pages/realizacje', {title: 'Realizacje', projects: obj.projects});
    });
});

app.get('/kontakt', function (req, res) {
    res.render('pages/kontakt', {title: 'Kontakt'});
});

app.get('/admin/dashboard', authControl, function(req, res) {
    res.render('pages/dashboard', {title: 'Admin page'});
});

app.get('/admin/projects', authControl, function(req, res) {
    let obj;
    axios.get(`${config.host}/project`)
        .then(function (response) {
            obj = response.data;
        })
        .catch(function (error) {
            console.log(error);
        }).then(() => {
        // {title: obj.title, msg: obj.msg}
        res.render('pages/projects', {title: 'Admin page', projects: obj.projects});
    });
});

app.get('/admin/projects/:projectId', authControl, function(req, res) {
    let obj;
    let projectId = req.params.projectId;
    axios.get(`${config.host}/project/${projectId}`)
        .then(function (response) {
            obj = response.data;
        })
        .catch(function (error) {
            console.log(error);
        }).then(() => {
            res.render('pages/project', {title: 'Admin page' , projectId: projectId, images: obj.images});
    });
});

// Handle 404
app.get('*', function(req, res){
    let obj;
    axios.get(`${config.host}/test`)
        .then(function (response) {
            obj = response.data;
        })
        .catch(function (error) {
            console.log(error);
        }).then(() => {
        // {title: obj.title, msg: obj.msg}
        res.render('pages/error-page', {title: obj.title, msg: obj.msg});
    });
});

// log errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;