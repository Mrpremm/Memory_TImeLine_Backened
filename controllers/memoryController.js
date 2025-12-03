// backend/controllers/memoryController.js
const Memory = require('../models/Memory');

/**
 * Create a memory.
 * Expects req.user (from auth middleware) and body:
 *   { title, description, date, tags, photoUrls }
 */
exports.createMemory = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const { title, description, date, tags = [], photoUrls = [], photoUrl } = req.body;

    // normalize single photoUrl -> array
    const finalPhotoUrls = Array.isArray(photoUrls) && photoUrls.length
      ? photoUrls
      : (photoUrl ? [photoUrl] : []);

    const mem = new Memory({
      userId,
      title,
      description,
      date,
      tags,
      photoUrls: finalPhotoUrls
    });

    const saved = await mem.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createMemory error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

/**
 * Get memories for logged-in user (sorted by date desc)
 */
exports.getMyMemories = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const list = await Memory.find({ userId }).sort({ date: -1 });
    return res.json(list);
  } catch (err) {
    console.error('getMyMemories error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
exports.updateMemory = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const id = req.params.id;
    const { title, description, date, tags = [], photoUrls = [] } = req.body;

    // Find memory and ensure ownership
    const mem = await Memory.findById(id);
    if (!mem) return res.status(404).json({ msg: 'Memory not found' });
    if (String(mem.userId) !== String(userId)) return res.status(403).json({ msg: 'Forbidden' });

    // Update fields (only those provided)
    if (title !== undefined) mem.title = title;
    if (description !== undefined) mem.description = description;
    if (date !== undefined) mem.date = date;
    if (Array.isArray(tags)) mem.tags = tags;
    if (Array.isArray(photoUrls)) mem.photoUrls = photoUrls;

    const updated = await mem.save();
    return res.json(updated);
  } catch (err) {
    console.error('updateMemory error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const id = req.params.id;
    const mem = await Memory.findById(id);
    if (!mem) return res.status(404).json({ msg: 'Memory not found' });
    if (String(mem.userId) !== String(userId)) return res.status(403).json({ msg: 'Forbidden' });

    await mem.deleteOne();
    return res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('deleteMemory error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
