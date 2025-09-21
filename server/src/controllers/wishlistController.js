// src/controllers/wishlistController.js
const { Wishlist, Star } = require("../models");
const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");

exports.addToWishlist = async (req, res, next) => {
  try {
    const { starId } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'étoile existe déjà dans la liste de souhaits
    const existingWishlistItem = await Wishlist.findOne({ where: { userId, starId } });
    if (existingWishlistItem) {
      return res.status(200).json({ message: "L'étoile est déjà dans la liste de souhaits" });
    }

    // Ajouter l'étoile à la liste de souhaits
    const createdWishlistItem = await Wishlist.create({ userId, starId });

    // Récupérer l'article de la wishlist avec l'étoile incluse
    const wishlistItemWithStar = await Wishlist.findOne({
      where: { id: createdWishlistItem.id },
      include: [
        {
          model: Star,
          attributes: ["starid", "name", "price", "constellation"],
        },
      ],
    });

    if (wishlistItemWithStar?.Star) {
      const wishlistItem = wishlistItemWithStar.toJSON();
      wishlistItem.Star.price = Number.parseFloat(wishlistItem.Star.price); // Assurez-vous que price est un nombre
      res.status(201).json({
        message: "L'étoile a été ajoutée à la liste de souhaits",
        wishlistItem,
      });
    } else {
      res.status(201).json({
        message: "L'étoile a été ajoutée à la liste de souhaits",
        wishlistItem: null,
      });
    }
  } catch (error) {
    next(new AppError(`Erreur lors de l'ajout à la liste de souhaits: ${error.message}`, 400));
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Récupérer la liste de souhaits de l'utilisateur
    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Star,
          attributes: ["starid", "name", "price", "constellation"], // Limiter les attributs renvoyés
        },
      ],
    });

    // Transformer la liste en un format simple sans référence circulaire
    const wishlistItems = wishlist.map((item) => {
      const itemJson = item.toJSON();
      if (itemJson.Star && typeof itemJson.Star.price === "string") {
        itemJson.Star.price = Number.parseFloat(itemJson.Star.price);
      }
      return itemJson;
    });

    res.json({
      message: "Liste de souhaits récupérée avec succès",
      wishlist: wishlistItems,
    });
  } catch (error) {
    next(
      new AppError(`Erreur lors de la récupération de la liste de souhaits: ${error.message}`, 500),
    );
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { starId } = req.params;
    const userId = req.user.userId;

    // Assurez-vous que starId est un nombre
    const parsedStarId = Number.parseInt(starId, 10);
    if (Number.isNaN(parsedStarId)) {
      return next(new AppError("starId doit être un nombre valide", 400));
    }

    // Trouver l'article de la liste de souhaits
    const wishlistItem = await Wishlist.findOne({
      where: { userId, starId: parsedStarId },
    });

    if (!wishlistItem) {
      return next(new AppError("L'étoile n'a pas été trouvée dans la liste de souhaits", 404));
    }

    // Supprimer l'article de la liste de souhaits
    await wishlistItem.destroy();

    // Récupérer la liste mise à jour
    const updatedWishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Star,
          attributes: ["starid", "name", "price", "constellation"], // Limiter les attributs renvoyés
        },
      ],
    });

    // Transformer la liste mise à jour en un format simple sans référence circulaire
    const updatedWishlistItems = updatedWishlist.map((item) => {
      const itemJson = item.toJSON();
      if (itemJson.Star && typeof itemJson.Star.price === "string") {
        itemJson.Star.price = Number.parseFloat(itemJson.Star.price);
      }
      return itemJson;
    });

    res.json({
      message: "L'étoile a été supprimée de la liste de souhaits",
      wishlist: updatedWishlistItems,
    });
  } catch (error) {
    logger.error("Erreur lors de la suppression de la wishlist:", error);
    next(
      new AppError(
        `Erreur lors de la suppression de l'étoile de la liste de souhaits: ${error.message}`,
        400,
      ),
    );
  }
};

module.exports = exports;
