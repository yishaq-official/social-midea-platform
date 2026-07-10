import Community from '../models/Community.js';

export const createCommunity = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const existing = await Community.findOne({ name });
    
    if (existing) return res.status(400).json({ message: 'Community name already taken' });

    const community = await Community.create({
      name,
      description,
      icon,
      creator: req.user._id,
      members: [req.user._id],
    });
    
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('creator', 'name');
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();
    }
    
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
