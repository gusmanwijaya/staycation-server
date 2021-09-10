const Category = require("../../model/Category");
const Item = require("../../model/Item");
const Image = require("../../model/Image");
const Feature = require("../../model/Feature");
const Activity = require("../../model/Activity");
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
  edit: async (req, res) => {
    try {
      const originalUrl = req.originalUrl.split("/");

      const { id } = req.params;

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const item = await Item.findOne({ _id: id })
        .populate("imageId", "_id imageUrl")
        .populate("categoryId", "_id name");
      const categories = await Category.find();

      res.render("admin/item/view_item", {
        title: "Edit Item",
        alert,
        item,
        categories,
        url: originalUrl[1],
        action: "edit",
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, description, country } = req.body;

      if (req.files.length > 0) {
        for (let index = 0; index < req.files.length; index++) {
          const pathFile = req.files[index].path;
          const originalExtension =
            req.files[index].originalname.split(".")[
              req.files[index].originalname.split(".").length - 1
            ];
          const fileName = req.files[index].filename + "." + originalExtension;
          const targetPath = path.resolve(
            config.rootPath,
            `public/uploads/${fileName}`
          );

          const src = fs.createReadStream(pathFile);
          const dest = fs.createWriteStream(targetPath);

          src.pipe(dest);

          src.on("end", async () => {
            try {
              const item = await Item.findOne({ _id: id }).populate(
                "imageId",
                "_id imageUrl"
              );

              let currentImage = `${config.rootPath}/public/uploads/${item.imageId[index].imageUrl}`;

              if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage);
              }

              await Image.findOneAndUpdate(
                { _id: item.imageId[index]._id },
                {
                  imageUrl: fileName,
                }
              );
            } catch (error) {
              req.flash("alertStatus", "danger");
              req.flash("alertMessage", `${error.message}`);
              res.redirect("/item");
            }
          });
        }

        const categoryOld = await Category.findOne({ itemId: id });
        const categoryNew = await Category.findOne({ _id: categoryId });

        if (categoryOld !== categoryNew) {
          const item = await Item.findOneAndUpdate(
            { _id: id },
            {
              categoryId,
              title,
              price,
              city,
              description,
              country,
            }
          );

          categoryOld.itemId.pop();
          await categoryOld.save();

          categoryNew.itemId.push({ _id: item._id });
          await categoryNew.save();
        } else {
          await Item.findOneAndUpdate(
            { _id: id },
            {
              categoryId,
              title,
              price,
              city,
              description,
              country,
            }
          );
        }

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Item successfully updated");

        res.redirect("/item");
      } else {
        const categoryOld = await Category.findOne({ itemId: id });
        const categoryNew = await Category.findOne({ _id: categoryId });

        if (categoryOld !== categoryNew) {
          const item = await Item.findOneAndUpdate(
            { _id: id },
            {
              categoryId,
              title,
              price,
              city,
              description,
              country,
            }
          );
          categoryOld.itemId.pop();
          await categoryOld.save();

          categoryNew.itemId.push({ _id: item._id });
          await categoryNew.save();
        } else {
          await Item.findOneAndUpdate(
            { _id: id },
            {
              categoryId,
              title,
              price,
              city,
              description,
              country,
            }
          );
        }

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Item successfully updated");

        res.redirect("/item");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate("imageId", "_id imageUrl")
        .populate("categoryId", "_id name");

      for (let index = 0; index < item.imageId.length; index++) {
        let currentImage = `${config.rootPath}/public/uploads/${item.imageId[index].imageUrl}`;
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        await Image.findOneAndDelete({
          imageUrl: item.imageId[index].imageUrl,
        });
      }

      await Item.findOneAndDelete({ _id: id });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Item successfully deleted");

      res.redirect("/item");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
  showDetailItem: async (req, res) => {
    const { itemId } = req.params;

    try {
      const originalUrl = req.originalUrl.split("/");

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const features = await Feature.find({ itemId: itemId });
      const activities = await Activity.find({ itemId: itemId });
      console.log("activity : ", activities);

      res.render("admin/item/detail-item/view_detail_item", {
        title: "Detail Item",
        alert,
        url: originalUrl[1],
        itemId,
        features,
        activities,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  storeFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertStatus", "danger");
        req.flash("alertMessage", `${error.message}`);
        res.redirect(`/item/show-detail-item/${itemId}`);
      }

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
        try {
          const feature = await Feature.create({
            itemId,
            name,
            qty,
            imageUrl: fileName,
          });
          const item = await Item.findOne({ _id: itemId });
          item.featureId.push({ _id: feature._id });
          await item.save();

          await Image.create({
            imageUrl: fileName,
          });

          req.flash("alertStatus", "success");
          req.flash("alertMessage", "Feature successfully added");

          res.redirect(`/item/show-detail-item/${itemId}`);
        } catch (err) {
          req.flash("alertStatus", "danger");
          req.flash("alertMessage", `${err.message}`);
          res.redirect(`/item/show-detail-item/${itemId}`);
        }
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  updateFeature: async (req, res) => {
    const { itemId } = req.params;

    try {
      const { id, nameInModal, qtyInModal } = req.body;

      if (req.file) {
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
          try {
            const feature = await Feature.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${feature.imageUrl}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Image.findOneAndUpdate(
              { imageUrl: feature.imageUrl },
              { imageUrl: fileName }
            );
            await Feature.findOneAndUpdate(
              { _id: id },
              { name: nameInModal, qty: qtyInModal, imageUrl: fileName }
            );

            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Feature successfully updated");

            res.redirect(`/item/show-detail-item/${itemId}`);
          } catch (error) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${error.message}`);
            res.redirect(`/item/show-detail-item/${itemId}`);
          }
        });
      } else {
        await Feature.findOneAndUpdate(
          { _id: id },
          { name: nameInModal, qty: qtyInModal }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Feature successfully updated");

        res.redirect(`/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  destroyFeature: async (req, res) => {
    const { itemId } = req.params;
    try {
      const { id } = req.params;
      const feature = await Feature.findOne({ _id: id });

      let currentImage = `${config.rootPath}/public/uploads/${feature.imageUrl}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Image.findOneAndDelete({ imageUrl: feature.imageUrl });

      await Feature.findOneAndDelete({ _id: id });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.pop();
      await item.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Feature successfully deleted");

      res.redirect(`/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  storeActivity: async (req, res) => {
    const { name, type, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertStatus", "danger");
        req.flash("alertMessage", `${error.message}`);
        res.redirect(`/item/show-detail-item/${itemId}`);
      }

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
        try {
          const activity = await Activity.create({
            itemId,
            name,
            type,
            imageUrl: fileName,
          });
          const item = await Item.findOne({ _id: itemId });
          item.activityId.push({ _id: activity._id });
          await item.save();

          await Image.create({
            imageUrl: fileName,
          });

          req.flash("alertStatus", "success");
          req.flash("alertMessage", "Activity successfully added");

          res.redirect(`/item/show-detail-item/${itemId}`);
        } catch (err) {
          req.flash("alertStatus", "danger");
          req.flash("alertMessage", `${err.message}`);
          res.redirect(`/item/show-detail-item/${itemId}`);
        }
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  updateActivity: async (req, res) => {
    const { itemId } = req.params;

    try {
      const { idActivity, nameInModalActivity, typeInModalActivity } = req.body;

      if (req.file) {
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
          try {
            const activity = await Activity.findOne({ _id: idActivity });

            let currentImage = `${config.rootPath}/public/uploads/${activity.imageUrl}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Image.findOneAndUpdate(
              { imageUrl: activity.imageUrl },
              { imageUrl: fileName }
            );
            await Activity.findOneAndUpdate(
              { _id: idActivity },
              {
                name: nameInModalActivity,
                type: typeInModalActivity,
                imageUrl: fileName,
              }
            );

            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Activity successfully updated");

            res.redirect(`/item/show-detail-item/${itemId}`);
          } catch (error) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${error.message}`);
            res.redirect(`/item/show-detail-item/${itemId}`);
          }
        });
      } else {
        await Activity.findOneAndUpdate(
          { _id: idActivity },
          { name: nameInModalActivity, type: typeInModalActivity }
        );
        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Activity successfully updated");

        res.redirect(`/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
  destroyActivity: async (req, res) => {
    const { itemId } = req.params;
    try {
      const { id } = req.params;
      const activity = await Activity.findOne({ _id: id });
      let currentImage = `${config.rootPath}/public/uploads/${activity.imageUrl}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Image.findOneAndDelete({ imageUrl: activity.imageUrl });

      await Activity.findOneAndDelete({ _id: id });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.pop();
      await item.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Activity successfully deleted");

      res.redirect(`/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/item/show-detail-item/${itemId}`);
    }
  },
};
