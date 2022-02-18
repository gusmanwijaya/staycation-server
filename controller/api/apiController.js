const Item = require("../../model/Item");
const Treasure = require("../../model/Activity");
const Traveler = require("../../model/Booking");
const Category = require("../../model/Category");
const Bank = require("../../model/Bank");
const Member = require("../../model/Member");
const Booking = require("../../model/Booking");

const config = require("../../config");
const path = require("path");
const fs = require("fs");

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
  bookingPage: async (req, res) => {
    try {
      const {
        idItem,
        duration,
        price,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;

      if (!req.file) {
        res.status(400).json({
          status: "error",
          message: "Silahkan upload image!",
        });
      } else {
        const filePath = req.file.path;
        const originalExtension =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        const fileName = req.file.filename + "." + originalExtension;
        const targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${fileName}`
        );

        const src = fs.createReadStream(filePath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on("end", async () => {
          if (
            idItem === undefined ||
            duration === undefined ||
            price === undefined ||
            bookingStartDate === undefined ||
            bookingEndDate === undefined ||
            firstName === undefined ||
            lastName === undefined ||
            email === undefined ||
            phoneNumber === undefined ||
            accountHolder === undefined ||
            bankFrom === undefined
          ) {
            res.status(400).json({
              status: "error",
              message: "Silahkan lengkapi field yang masih kosong!",
            });
          } else {
            const item = await Item.findOne({ _id: idItem });
            if (!item) {
              res.status(404).json({
                status: "error",
                message: "Id item tidak tersedia!",
              });
            } else {
              item.sumBooking += 1;
              await item.save();

              let total = item.price * duration;
              let tax = (total * 10) / 100;
              const invoice = Math.floor(1000000 + Math.random() * 9000000);

              const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber,
              });

              const newBooking = {
                invoice,
                bookingStartDate,
                bookingEndDate,
                total: (total += tax),
                itemId: {
                  _id: item._id,
                  title: item.title,
                  price: item.price,
                  duration,
                },
                memberId: member._id,
                payments: {
                  proofPayment: `uploads/${fileName}`,
                  bankFrom,
                  accountHolder,
                },
              };

              const booking = await Booking.create(newBooking);
              res.status(201).json({
                status: "success",
                data: booking,
              });
            }
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message || "500 - Internal server error",
      });
    }
  },
};
