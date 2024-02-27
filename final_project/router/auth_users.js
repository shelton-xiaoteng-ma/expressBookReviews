const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "xxxxxx";

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  loginUser = users.filter((user)=> {return user.username === username && user.password===password});
  if(loginUser.length>0){
    return true
  }else{
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  if(req.body.username && req.body.password){
    const username = req.body.username;
    const password = req.body.password;
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({data: username}, JWT_SECRET, { expiresIn: 60 * 60 });
      console.log(accessToken);
      req.session.authorization = {
        accessToken: accessToken
      }
      return res.status(200).send({'message': "Login success"})
    }else{
      return res.status(401).send({'message': "User does not exist"})
    }
  }else{
    return res.status(401).send({'message': "username and/or password cannot be empty."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const review = req.body.review;
  if(!review){
    return res.status(200).send({'message': "Review cannot be empty."})
  }else{
    const username = req.user.data;
    books[req.params.isbn].reviews[username] = review;
    return res.status(200).send({'message': "Review success."})
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.user.data;
  delete books[req.params.isbn].reviews[username];
  return res.status(200).send({'message': "Review deleted."})
});

module.exports.authenticated = regd_users;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.isValid = isValid;
module.exports.users = users;
