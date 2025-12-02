// controllers/memoryController.js
const Memory = require('../models/Memory');

exports.createMemory = async (req, res) => {
  try {
    const { title, description, date, tags, photoUrl } = req.body;
    if(!title || !date) return res.status(400).json({ msg: 'title and date required' });

    const memory = await Memory.create({
      userId: req.user._id,
      title,
      description,
      date: new Date(date),
      photoUrl: photoUrl || '',
      tags: tags || []
    });
    res.json(memory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMemory = async (req, res) => {
  try {
    const mem = await Memory.findOne({ _id: req.params.id, userId: req.user._id });
    if(!mem) return res.status(404).json({ msg: 'Not found' });
    res.json(mem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    const mem = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if(!mem) return res.status(404).json({ msg: 'Not found' });
    res.json(mem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const mem = await Memory.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if(!mem) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
