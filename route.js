const express = require('express');
const router = express.Router();
const Post = require('./models/Post'); // Make sure to provide the correct path to your Post model

// Route to display posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('posts', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;