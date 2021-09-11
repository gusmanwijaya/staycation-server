const Item = require("../../model/Item");
const Treasure = require("../../model/Activity");
const Traveler = require("../../model/Booking");
const Category = require("../../model/Category");
const { populate } = require("../../model/Item");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title city country price unit imageId")
        .populate("imageId", "_id imageUrl")
        .limit(5);

      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title city country isPopular imageId",
          perDocumentLimit: 4,
          options: {
            sort: {
              sumBooking: -1,
            },
          },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      const travelers = await Traveler.find();
      const treasures = await Treasure.find();
      const cities = await Item.find();

      for (let index = 0; index < category.length; index++) {
        for (let x = 0; x < category[index].itemId.length; x++) {
          const item = await Item.findOne({
            _id: category[index].itemId[x]._id,
          });
          item.isPopular = false;
          await item.save();

          if (category[index].itemId[0] === category[index].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        category,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "500 - Internal server error",
      });
    }
  },
};
