const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const models = require("../modelData/models");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({}, "_id first_name last_name").lean();
      const photos = await Photo.find({}, "user_id comments.user_id").lean();

      const result = users.map((u) => {
        const uId = u._id.toString();
        const photo_count = photos.filter((p) => p.user_id && p.user_id.toString() === uId).length;
        let comment_count = 0;
        photos.forEach((p) => {
          if (p.comments) {
            p.comments.forEach((c) => {
              if (c.user_id && c.user_id.toString() === uId) {
                comment_count += 1;
              }
            });
          }
        });
        return {
          _id: u._id,
          first_name: u.first_name,
          last_name: u.last_name,
          photo_count,
          comment_count,
        };
      });

      return res.json(result);
    }

    const users = models.userListModel();
    const result = users.map((u) => {
      const uPhotos = models.photoOfUserModel(u._id) || [];
      let comment_count = 0;
      users.forEach((otherUser) => {
        const otherPhotos = models.photoOfUserModel(otherUser._id) || [];
        otherPhotos.forEach((p) => {
          if (p.comments) {
            p.comments.forEach((c) => {
              if (c.user && (c.user._id === u._id || c.user === u._id)) {
                comment_count += 1;
              }
            });
          }
        });
      });
      return {
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        photo_count: uPhotos.length,
        comment_count,
      };
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).send("Error fetching user list");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id, "_id first_name last_name location description occupation").lean();
      if (user) {
        return res.json(user);
      }
    }

    const fallbackUser = models.userModel(id);
    if (fallbackUser) {
      return res.json(fallbackUser);
    }

    return res.status(400).send("User not found");
  } catch (err) {
    return res.status(400).send("Error fetching user");
  }
});

module.exports = router;
