const Item = require("../../model/Item");
const Treasure = require("../../model/Activity");
const Traveler = require("../../model/Booking");
const Category = require("../../model/Category");
const Bank = require("../../model/Bank");

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

      const testimonial = {
        _id: "60ae2431196ccd27e6587ab1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Jaya",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "500 - Internal server error",
      });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "featureId",
          select: "_id name qty imageUrl",
        })
        .populate({
          path: "activityId",
          select: "_id name type imageUrl",
        })
        .populate({
          path: "imageId",
          select: "_id imageUrl",
        });

      const bank = await Bank.find();

      const testimonial = {
        _id: "60ae2431196ccd27e6587ab1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Jaya",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "500 - Internal server error",
      });
    }
  },
};
