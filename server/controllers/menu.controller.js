const MenuItem = require('../models/MenuItem');

// GET /api/menu/signature — public, signature items
exports.getSignatureItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isSignature: true, deleted_at: null }).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/menu — public, non-deleted items
exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find({ deleted_at: null }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/menu/admin — active (non-deleted) items for manager
exports.getMenuAdmin = async (req, res) => {
  try {
    const items = await MenuItem.find({ deleted_at: null }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/menu — create new item (manager only)
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('menu-item-updated', { id: item._id, action: 'created' });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/menu/:id — update item (manager only)
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('menu-item-updated', { id: item._id, is_available: item.is_available });
      if (!item.is_available) {
        io.emit('item-unavailable', item._id.toString());
      }
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/menu/:id — soft delete (manager only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const io = req.app.get('io');
    if (io) io.emit('menu-item-updated', { id: item._id, action: 'deleted' });

    res.json({ message: 'Item deleted', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
