module.exports = {
  isLogin: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertStatus", "danger");
      req.flash(
        "alertMessage",
        "Mohon maaf, kami kira Anda telah pergi, silahkan login kembali"
      );
      res.redirect("/");
    } else {
      next();
    }
  },
};
