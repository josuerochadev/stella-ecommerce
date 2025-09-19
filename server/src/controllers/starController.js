// src/controllers/starController.js

const { Star } = require("../models");
const { Op } = require("sequelize");
const { AppError } = require("../middlewares/errorHandler");

exports.getAllStars = async (_, res, next) => {
  try {
    const stars = await Star.findAll();
    res.json({ data: stars });
  } catch (error) {
    console.error("Error in getAllStars:", error);
    next(new AppError(`Error retrieving stars: ${error.message}`, 500));
  }
};

exports.getStarById = async (req, res, next) => {
  try {
    const star = await Star.findOne({
      where: { starid: req.params.starid },
    });
    if (star) {
      res.json(star);
    } else {
      next(new AppError("Star not found", 404));
    }
  } catch (error) {
    console.error("Error in getStarById:", error);
    next(new AppError(`Error retrieving star: ${error.message}`, 500));
  }
};

exports.searchStars = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Extended search across multiple fields with relevance scoring
    const stars = await Star.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${q}%`, // Search in name
            },
          },
          {
            constellation: {
              [Op.iLike]: `%${q}%`, // Search in constellation
            },
          },
          {
            description: {
              [Op.iLike]: `%${q}%`, // Search in description
            },
          },
        ],
      },
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.json(stars);
  } catch (error) {
    console.error("Error in searchStars:", error);
    next(new AppError(`Error searching for stars: ${error.message}`, 500));
  }
};

exports.filterStars = async (req, res, next) => {
  try {
    const {
      constellation,
      minPrice,
      maxPrice,
      minMagnitude,
      maxMagnitude,
      minDistance,
      maxDistance,
      minLuminosity,
      maxLuminosity,
      sortBy = 'name',
      sortOrder = 'ASC',
      limit = 50
    } = req.query;
    const whereClause = {};

    // Support multiple constellations (comma-separated or array)
    if (constellation) {
      const constellations = Array.isArray(constellation)
        ? constellation
        : constellation.split(',').map(c => c.trim());

      if (constellations.length === 1) {
        whereClause.constellation = constellations[0];
      } else {
        whereClause.constellation = { [Op.in]: constellations };
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // Magnitude range filters
    if (minMagnitude || maxMagnitude) {
      whereClause.magnitude = {};
      if (minMagnitude) whereClause.magnitude[Op.gte] = parseFloat(minMagnitude);
      if (maxMagnitude) whereClause.magnitude[Op.lte] = parseFloat(maxMagnitude);
    }

    // Distance range filters
    if (minDistance || maxDistance) {
      whereClause.distanceFromEarth = {};
      if (minDistance) whereClause.distanceFromEarth[Op.gte] = parseFloat(minDistance);
      if (maxDistance) whereClause.distanceFromEarth[Op.lte] = parseFloat(maxDistance);
    }

    // Luminosity range filters
    if (minLuminosity || maxLuminosity) {
      whereClause.luminosity = {};
      if (minLuminosity) whereClause.luminosity[Op.gte] = parseFloat(minLuminosity);
      if (maxLuminosity) whereClause.luminosity[Op.lte] = parseFloat(maxLuminosity);
    }

    // Define valid sort fields
    const validSortFields = ['name', 'price', 'magnitude', 'distanceFromEarth', 'luminosity', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDirection = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stars = await Star.findAll({
      where: whereClause,
      order: [[sortField, sortDirection]],
      limit: parseInt(limit)
    });

    res.json({ data: stars, count: stars.length });
  } catch (error) {
    console.error("Error in filterStars function:", error);
    next(new AppError(`Error filtering stars: ${error.message}`, 500));
  }
};
