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

      res.render("admin/item/view_item", {
        title: "Item",
        url: originalUrl[1],
        alert,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/item");
    }
  },
};
