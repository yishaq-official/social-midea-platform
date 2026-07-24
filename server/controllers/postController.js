import Post from '../models/Post.js';
import User from '../models/User.js';

// Get all posts for feed (filtered by privacy)
export const getPosts = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate('user', 'name avatar isPrivate followers')
      .sort({ createdAt: -1 });

    // Filter posts for privacy
    // If we have req.user (which we should, if route is protected), use it
    const currentUserId = req.user ? req.user._id.toString() : null;

    posts = posts.filter(post => {
      if (!post.user) return false;
      if (currentUserId && post.user._id.toString() === currentUserId) return true;
      if (!post.user.isPrivate) return true;
      if (currentUserId && post.user.followers && post.user.followers.includes(currentUserId)) return true;
      return false;
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts for a specific user
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name avatar isPrivate')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    // req.user is set by auth middleware
    const post = await Post.create({
      user: req.user._id,
      content,
      media: media || [],
    });
    
    const populatedPost = await Post.findById(post._id).populate('user', 'name avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
