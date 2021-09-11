const Category = require("../../model/Category");

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

      res.render("admin/category/view_category", {
        username: req.session.user.username,
        title: "Category",
        url: originalUrl[1],
        alert,
        categories,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/category");
    }
  },
  store: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await Category({ name });
      await category.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Category successfully added");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/category");
    }
  },
  update: async (req, res) => {
    try {
      const { id, name } = req.body;

      await Category.findOneAndUpdate({ _id: id }, { name });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Category successfully updated");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/category");
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndDelete({ _id: id });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Category successfully deleted");

      res.redirect("/category");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/category");
    }
  },
};
