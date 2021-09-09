const Category = require("../../model/Category");
const Item = require("../../model/Item");
const Image = require("../../model/Image");
const fs = require("fs");
const path = require("path");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const categories = await Category.find();
      const item = await Item.find()
        .populate("imageId", "_id imageUrl")
        .populate("categoryId", "_id name");

      res.render("admin/item/view_item", {
        title: "Item",
        url: originalUrl[1],
        alert,
        categories,
        item,
        action: "view",
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
  store: async (req, res) => {
    try {
      const { categoryId, title, price, city, description, country } = req.body;

      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description,
          price,
          city,
          country,
        };

        const item = await Item.create(newItem);
        category.itemId.push({
          _id: item._id,
        });
        await category.save();

        for (let index = 0; index < req.files.length; index++) {
          const filePath = req.files[index].path;
          const originalExtension =
            req.files[index].originalname.split(".")[
              req.files[index].originalname.split(".").length - 1
            ];
          const fileName = req.files[index].filename + "." + originalExtension;
          const targetPath = path.resolve(
            config.rootPath,
            `public/uploads/${fileName}`
          );

          const src = fs.createReadStream(filePath);
          const dest = fs.createWriteStream(targetPath);

          src.pipe(dest);

          src.on("end", async () => {
            try {
              const imageSave = await Image.create({
                imageUrl: fileName,
              });
              item.imageId.push({ _id: imageSave._id });
              await item.save();
            } catch (error) {
              req.flash("alertStatus", "danger");
              req.flash("alertMessage", `${error.message}`);
              res.redirect("/item");
            }
          });
        }

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Item successfully added");

        res.redirect("/item");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
  show: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const { id } = req.params;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const item = await Item.findOne({ _id: id }).populate(
        "imageId",
        "_id imageUrl"
      );

      res.render("admin/item/view_item", {
        title: "Show Item",
        alert,
        item,
        url: originalUrl[1],
        action: "show image",
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
};
