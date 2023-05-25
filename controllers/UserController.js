const express = require("express");
var router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;

const { User } = require("../models/user");

router.get("/", (req, res) => {
  User.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      return res
        .status(400)
        .send("Error in retrieving Users : ", req.params.id);
    }
  });
});

router.get("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .send("User with this id is not exist. Id : ", req.params.id);
  }

  User.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      return res.status(404).send("Error in retrieving User : ", req.params.id);
    }
  });
});

router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, null, (err, doc) => {
    if (err) {
      console.log("Error : ", JSON.stringify(err, undefined, 2));
      return res
        .status(400)
        .json({ error: "Oops! An error occurred while creating a new user!" });
    }

    if (doc) {
      console.log("User already exists : ", JSON.stringify(err, undefined, 2));
      return res.status(417).json({ error: "User with that email already exists" });
    } else {
      if (req.body.password !== req.body.repeatedPassword) {
        return res.status(418).json({ error: "Passwords do not match" });
      }
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
      });

      user.save((err, doc) => {
        if (!err) {
          res.send(doc);
        } else {
          return res.status(400).json({ error: "Error in user save" });
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, null, (err, doc) => {
    if (err) {
      console.log("Error : ", JSON.stringify(err, undefined, 2));
      return res
        .status(400)
        .json({ error: "Oops! An error occurred while creating a new user" });
    }

    if (doc) {
      if (doc.password === req.body.password) {
        res.send(doc);
      } else {
        console.log("Invalid password : ", JSON.stringify(err, undefined, 2));
        return res.status(418).json({ error: "Invalid password" });
      }
    } else {
      console.log("Error in User Save : ", JSON.stringify(err, undefined, 2));
      return res.status(404).json({ error: "This user does not exist" });
    }
  });
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.password = undefined;
    user.isAdmin = undefined;

    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});

module.exports = router;
