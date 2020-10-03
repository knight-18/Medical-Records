//Importing packages
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./routes/user'); 
const connect_flash = require('connect-flash'); 
const session = require('express-session');
const cookieParser = require("cookie-parser"); 
//Configuring App
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// using dotenv module for environment
require("dotenv").config({ path: 'env' });

//Configuring Port
const PORT = process.env.PORT || 3000;

//Mongoose connection
mongoose.connect(process.env.MONGODB_URL,{
	useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=>console.log('Connected to mongo server'))
	.catch(err => console.error(err));

//Setting EJS view engine
app.set('view engine','ejs');

//body parser
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
  }));

app.use(connect_flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Setup for rendering static pages
const publicDirectory = path.join(__dirname,'../public');
app.use(express.static(publicDirectory));
app.use(cookieParser());

//Routes
app.use(routes);
//Start the server
app.listen(PORT,()=>{
	console.log('Server listening on port',PORT);
})