const Bank = require("../../model/Bank");
const Image = require("../../model/Image");

const path = require("path");
const fs = require("fs");
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

      const banks = await Bank.find();

      res.render("admin/bank/view_bank", {
        title: "Bank",
        url: originalUrl[1],
        alert,
        banks,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  store: async (req, res) => {
    try {
      const { bankName, bankAccountNumber, bankAccountName } = req.body;

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
            await Bank.create({
              bankName,
              bankAccountNumber,
              bankAccountName,
              imageUrl: fileName,
            });

            await Image.create({
              imageUrl: fileName,
            });
            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Bank successfully added");

            res.redirect("/bank");
          } catch (err) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${err.message}`);
            res.redirect("/bank");
          }
        });
      } else {
        await Bank.create({
          bankName,
          bankAccountNumber,
          bankAccountName,
        });

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Bank successfully added");

        res.redirect("/bank");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  update: async (req, res) => {
    try {
      const { id, bankName, bankAccountNumber, bankAccountName } = req.body;

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
            const bank = await Bank.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${bank.imageUrl}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Image.findOneAndUpdate(
              { imageUrl: bank.imageUrl },
              { imageUrl: fileName }
            );

            await Bank.findOneAndUpdate(
              { _id: id },
              {
                bankName,
                bankAccountNumber,
                bankAccountName,
                imageUrl: fileName,
              }
            );

            req.flash("alertStatus", "success");
            req.flash("alertMessage", "Bank successfully updated");

            res.redirect("/bank");
          } catch (error) {
            req.flash("alertStatus", "danger");
            req.flash("alertMessage", `${error.message}`);
            res.redirect("/bank");
          }
        });
      } else {
        await Bank.findOneAndUpdate(
          { _id: id },
          {
            bankName,
            bankAccountNumber,
            bankAccountName,
          }
        );

        req.flash("alertStatus", "success");
        req.flash("alertMessage", "Bank successfully updated");

        res.redirect("/bank");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });

      let currentImage = `${config.rootPath}/public/uploads/${bank.imageUrl}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      await Bank.findOneAndDelete({ _id: id });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Bank successfully deleted");

      res.redirect("/bank");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/bank");
    }
  },
};
