const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const JWT_SECRET = require('./router/auth_users.js').JWT_SECRET;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
  if(req.session.authorization && req.session.authorization["accessToken"]){
    const accessToken = req.session.authorization["accessToken"];
    console.log(accessToken, JWT_SECRET);
    jwt.verify(accessToken, JWT_SECRET, (error, user)=>{
    if (!error){
        req.user = user;
        next();
    }else{
        console.log(error);
        return res.status(403).send({message: "User not authenticated"});
    }
    })
  }else{
    return res.status(403).json({message: "User not logged in"});
  }
});
 
const PORT =5500;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
