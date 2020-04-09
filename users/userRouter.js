const express = require('express');

const router = express.Router();
const User = require("./userDB.js")
const Post = require("../posts/postDb.js")

router.post('/', validateUser, (req, res) => {

  const user = req.body;
  User.insert(user)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({error: "Error creating user"})
      })
});

router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
  // do your magic!
  const post = req.body;
  Post.insert(post)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({error: "Error creating post"});
      })

});

router.get('/', (req, res) => {
  // do your magic!
  User.get()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "Error getting users"})
      })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  // const { id } = req.params;
    res.status(200).json(req.user)
  // User.getById(id)
  //     .then(user => {
  //       if(user) {
  //         res.status(200).json(user)
  //       }else {
  //         res.status(404).json({ error: "User with that ID does not exist. "})
  //       }
  //     })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then(posts => {
        if(posts) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ message: "The posts with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.user;
  User.remove(id)
      .then(() => res.status(204).json({ message: "user deleted"}))
      .catch(err => {
        res.status(500).json({error: "Error deleting user"})
      })
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
          User.update(id, { name })
              .then(updated => {
                if(updated) {
                  User.getById(id)
                  .then(user => res.status(200).json(user))
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "Error getting user"})
                  })
                }
                
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({error: "Error getting updating user"});
              })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
      .then(user => {
        if(user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({ error: "User with id does not exist."});
        }
    })
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({error: "Name is required"})
  } else if (typeof name !== 'string') {
    return res.status(400).json({error: "Name must be string!"})
  }
  req.body = { name };
  next()
  
}

function validatePost(req, res, next) {
  // do your magic!
  const { id: user_id } = req.params;
  const { text } = req.body;
  
  if (!req.body) {
    return res.status(400).json({error: "Post requires body"});
  }
  if(!text) {
    return res.status(400).json({error: "Post requires text"});
  }

  req.body = { user_id, text };
  next();
}

module.exports = router;
