const Booking = require("../../model/Booking");
const Member = require("../../model/Member");
const Bank = require("../../model/Bank");

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

      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");

      res.render("admin/booking/view_booking", {
        username: req.session.user.username,
        title: "Booking",
        url: originalUrl[1],
        alert,
        booking,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/booking");
    }
  },
  show: async (req, res) => {
    const { id } = req.params;
    try {
      const originalUrl = req.originalUrl.split("/");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");

      res.render("admin/booking/show_detail_booking", {
        username: req.session.user.username,
        title: "Detail Booking",
        url: originalUrl[1],
        alert,
        booking,
      });
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/booking");
    }
  },
  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "success";
      await booking.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", `Booking successfully accepted`);

      res.redirect(`/booking`);
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "failed";
      await booking.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", `Booking successfully rejected`);

      res.redirect(`/booking`);
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect(`/booking/${id}`);
    }
  },
};
