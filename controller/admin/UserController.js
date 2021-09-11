const User = require("../../model/User");
const bcrypt = require("bcryptjs");

module.exports = {
  login: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        status: alertStatus,
        message: alertMessage,
      };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("index", {
          title: "Login",
          alert,
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/");
    }
  },
  storeLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });

      if (user) {
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
          req.session.user = {
            _id: user._id,
            username: user.username,
          };
          res.redirect("/dashboard");
        } else {
          req.flash("alertStatus", "danger");
          req.flash("alertMessage", `Password not match`);
          res.redirect("/");
        }
      } else {
        req.flash("alertStatus", "danger");
        req.flash("alertMessage", `Username not found`);
        res.redirect("/");
      }
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
      res.redirect("/");
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (error) {
      req.flash("alertStatus", "danger");
      req.flash("alertMessage", `${error.message}`);
    }
  },
};
