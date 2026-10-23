const Service = require('../models/service');

const searchServices = async (req, res) => {
  try {
    const { query, city, category } = req.query;
    let filter = { isAvailable: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const services = await Service.find(filter)
      .populate('provider', 'name phone city')
      .limit(10); // Suggestions ke liye fast limit

    return res.status(200).json({
      message: 'Services fetched successfully',
      count: services.length,
      services
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { searchServices };