export const getAvailablePlugins = async (req, res) => {
  try {
    res.json({ plugins: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
};

export const activatePlugin = async (req, res) => {
  try {
    const { pluginId } = req.params;
    res.status(200).json({ message: `Plugin ${pluginId} activated (placeholder)` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to activate plugin' });
  }
};

export const deactivatePlugin = async (req, res) => {
  try {
    const { pluginId } = req.params;
    res.status(200).json({ message: `Plugin ${pluginId} deactivated (placeholder)` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to deactivate plugin' });
  }
};
