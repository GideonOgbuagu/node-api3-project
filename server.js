const express = require('express');

const server = express();

server.use(express.json())
server.use(logger)

const userRouter = require("./users/userRouter.js");

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  const message = process.env.MESSAGE || "Hellooo from the localhost";
  res.send(`
  <h1>${message}</h1>
  <h2>Welcome to another Users and Posts API<h2/>
  `);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl} ${Date()}`)
  next();
}

module.exports = server;
