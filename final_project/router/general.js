const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  if(req.body.username && req.body.password){
    const username = req.body.username;
    const password = req.body.password;
    registedUsers = users.filter((user)=> user.username === username);
    if(registedUsers.length>0){
      return res.status(401).send({'message': "Username already exists, please try again"})
    }else{
      users.push({
        username, password
      })
      return res.status(200).send({'message': "Registration success"})
    }
  }else{
    return res.status(401).send({'message': "username and/or password cannot be empty."})
  }
});

const getBooks = new Promise((resolve, reject) => {
  try{
      const data = books;
      resolve(data)
  }catch(err){
      reject(err)
  }
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // return res.status(200).send(books);
  getBooks.then(
    (data) => res.status(200).send(data),
    (error) => res.status(502).send(`Error loading the books, error ${error}`)
  );
});

const getBooksByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    try{
        const data = books[isbn];
        resolve(data)
    }catch(err){
        reject(err)
    }
  })
} 

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // return res.status(200).send(books[req.params.isbn]);
  getBooksByIsbn(req.params.isbn).then(
    (data) => res.status(200).send(data),
    (error) => res.status(502).send(`Error loading the books, error ${error}`)
  );
 });


const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    try{
        let authorBooks = []
        Object.entries(books).forEach(function(book) {
          if(book[1].author===author){
            authorBooks.push(book);
          }
        })
        resolve(authorBooks)
    }catch(err){
        reject(err)
    }
  })
} 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // let authorBooks = []
  // Object.entries(books).forEach(function(book) {
  //   if(book[1].author===req.params.author){
  //     authorBooks.push(book);
  //   }
  // })
  // return res.status(200).send(authorBooks);
  getBooksByAuthor(req.params.author).then(
    (data) => res.status(200).send(data),
    (error) => res.status(502).send(`Error loading the books, error ${error}`)
  );
});

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    try{
        Object.entries(books).forEach(function(book) {
          if(book[1].title===title){
            resolve(book);
          }
        })
    }catch(err){
        reject(err)
    }
  })
} 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  // Object.entries(books).forEach(function(book) {
  //   if(book[1].title===req.params.title){
  //     return res.status(200).send(book);
  //   }
  // })
  // return res.status(200).send({"message": "book no found"});
  getBooksByTitle(req.params.title).then(
    (data) => res.status(200).send(data),
    (error) => res.status(502).send(`Error loading the books, error ${error}`)
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
