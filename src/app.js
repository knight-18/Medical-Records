//Importing packages
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

//Configuring App
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
// using dotenv module for environment
require("dotenv").config();

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

//Routes
const indexRoutes = require('./routes/index');

app.use('/api',indexRoutes);


//Start the server
app.listen(PORT,()=>{
	console.log('Server listening on port',PORT);
})