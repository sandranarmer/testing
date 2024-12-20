const {Menu}  = require('./menu.schema');
const { MenuItemFactory } = require('./menu.factory');
const { auth } = require('../../auth');

module.exports.Init_Menu = (app) => {
  // Get all menu items
  app.get('/menu', async (req, res) => {
    try {
      const items = await Menu.find();
      res.status(200).json(items);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  });

  // Get a menu item by ID
  app.get('/menu/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Menu.findById(id);
      if (!item) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.status(200).json(item);
    } catch (err) {
      console.error('Error fetching menu item by ID:', err);
      res.status(500).json({ error: 'Failed to fetch menu item' });
    }
  });

  // Create a new menu item
  app.post('/menu', auth('admin'), async (req, res) => {
    const { type, name, price, description, extra_property } = req.body;

    if (!type || !name || !price || !description || !extra_property) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const menuItem = MenuItemFactory.createMenuItem(type, name, price, description, extra_property);
      const newMenuItem = new Menu({
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
        type: menuItem.type,
        extra_property: extra_property,
      });

      const savedItem = await newMenuItem.save();
      res.status(201).json({ message: 'Menu item created successfully', item: menuItem.display() });
    } catch (err) {
      console.error('Error creating menu item:', err);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  });

  // Update a menu item's price
  app.patch('/menu/:id/change-price', auth('admin'), async (req, res) => {
    const { id } = req.params;
    const { newPrice } = req.body;

    if (newPrice === undefined) {
      return res.status(400).json({ error: 'New price is required' });
    }

    try {
      const item = await Menu.findById(id);

      if (!item) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      item.price = newPrice;
      await item.save();

      res.status(200).json({ message: 'Price updated successfully', item });
    } catch (err) {
      console.error('Error updating menu price:', err);
      res.status(500).json({ error: 'Failed to update menu price' });
    }
  });

  // Delete a menu item
  app.delete('/menu/:id', auth('admin'), async (req, res) => {
    const { id } = req.params;

    try {
      const deletedItem = await Menu.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      res.status(200).json({ message: 'Menu item deleted successfully', deletedItem });
    } catch (err) {
      console.error('Error deleting menu item:', err);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  });
};