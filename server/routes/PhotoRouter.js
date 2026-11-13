const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const models = require("../modelData/models");

const router = express.Router();

const getPhotosOfUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).send("User not found");
      }

      const photos = await Photo.find({ user_id: id }, "_id user_id comments file_name date_time").lean();

      const authorIds = [];
      photos.forEach((photo) => {
        if (photo.comments) {
          photo.comments.forEach((c) => {
            if (c.user_id) {
              authorIds.push(c.user_id);
            }
          });
        }
      });

      const authors = await User.find(
        { _id: { $in: authorIds } },
        "_id first_name last_name"
      ).lean();

      const authorMap = {};
      authors.forEach((a) => {
        authorMap[a._id.toString()] = {
          _id: a._id,
          first_name: a.first_name,
          last_name: a.last_name,
        };
      });

      const formattedPhotos = photos.map((photo) => {
        const formattedComments = (photo.comments || []).map((c) => {
          const author = (c.user_id && authorMap[c.user_id.toString()]) || {
            _id: c.user_id,
            first_name: "Unknown",
            last_name: "User",
          };
          return {
            _id: c._id,
            comment: c.comment,
            date_time: c.date_time,
            user: author,
          };
        });

        return {
          _id: photo._id,
          user_id: photo.user_id,
          comments: formattedComments,
          file_name: photo.file_name,
          date_time: photo.date_time,
        };
      });

      return res.json(formattedPhotos);
    }

    const fallbackUser = models.userModel(id);
    if (!fallbackUser) {
      return res.status(400).send("User not found");
    }

    const fallbackPhotos = models.photoOfUserModel(id);
    return res.json(fallbackPhotos || []);
  } catch (err) {
    return res.status(400).send("Error fetching photos");
  }
};

router.get("/photosOfUser/:id", getPhotosOfUser);
router.get("/:id", getPhotosOfUser);

router.get("/commentsOfUser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).send("User not found");
      }

      const photos = await Photo.find({ "comments.user_id": id }, "_id file_name user_id comments").lean();

      const userComments = [];
      photos.forEach((photo) => {
        if (photo.comments) {
          photo.comments.forEach((c) => {
            if (c.user_id && c.user_id.toString() === id) {
              userComments.push({
                _id: c._id,
                comment: c.comment,
                date_time: c.date_time,
                photo_id: photo._id,
                file_name: photo.file_name,
                photo_owner_id: photo.user_id,
              });
            }
          });
        }
      });

      return res.json(userComments);
    }

    const fallbackUser = models.userModel(id);
    if (!fallbackUser) {
      return res.status(400).send("User not found");
    }

    const allUsers = models.userListModel();
    const userComments = [];
    allUsers.forEach((u) => {
      const uPhotos = models.photoOfUserModel(u._id) || [];
      uPhotos.forEach((p) => {
        if (p.comments) {
          p.comments.forEach((c) => {
            if (c.user && (c.user._id === id || c.user === id)) {
              userComments.push({
                _id: c._id,
                comment: c.comment,
                date_time: c.date_time,
                photo_id: p._id,
                file_name: p.file_name,
                photo_owner_id: u._id,
              });
            }
          });
        }
      });
    });

    return res.json(userComments);
  } catch (err) {
    return res.status(400).send("Error fetching comments");
  }
});

module.exports = router;
