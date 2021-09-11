const Member = require("../../model/Member");
const Booking = require("../../model/Booking");
const Item = require("../../model/Item");

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

      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();

      res.render("admin/dashboard/view_dashboard", {
        username: req.session.user.username,
        title: "Dashboard",
        url: originalUrl[1],
        alert,
        member,
        booking,
        item,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/dashboard");
    }
  },
};
