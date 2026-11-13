import models from "../modelData/models";

export const SERVER_URL = "http://localhost:8081";

function getFallbackData(url) {
  try {
    const cleanUrl = url.split("?")[0];
    if (cleanUrl.endsWith("/user/list")) {
      const users = models.userListModel();
      return users.map((u) => {
        const photos = models.photoOfUserModel(u._id) || [];
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
          photo_count: photos.length,
          comment_count,
        };
      });
    }

    if (cleanUrl.includes("/user/")) {
      const parts = cleanUrl.split("/user/");
      const userId = parts[1];
      const user = models.userModel(userId);
      if (user) return user;
    }

    if (cleanUrl.includes("/photosOfUser/")) {
      const parts = cleanUrl.split("/photosOfUser/");
      const userId = parts[1];
      const photos = models.photoOfUserModel(userId);
      if (photos) return photos;
    }

    if (cleanUrl.includes("/commentsOfUser/")) {
      const parts = cleanUrl.split("/commentsOfUser/");
      const userId = parts[1];
      const users = models.userListModel();
      const comments = [];
      users.forEach((u) => {
        const uPhotos = models.photoOfUserModel(u._id) || [];
        uPhotos.forEach((p) => {
          if (p.comments) {
            p.comments.forEach((c) => {
              if (c.user && (c.user._id === userId || c.user === userId)) {
                comments.push({
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
      return comments;
    }
  } catch (e) {
    console.error("Fallback error:", e);
  }
  return null;
}

function fetchModel(url) {
  return new Promise((resolve, reject) => {
    const targetUrl = url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${url.startsWith("/") ? "" : "/"}${url}`;

    fetch(targetUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        resolve({ data });
      })
      .catch((err) => {
        if (!url.startsWith("http")) {
          fetch(`${SERVER_URL}${url.startsWith("/") ? "" : "/"}${url}`)
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
            .then((data) => resolve({ data }))
            .catch(() => {
              const fallback = getFallbackData(url);
              if (fallback !== null) {
                return resolve({ data: fallback });
              }
              reject(err);
            });
          return;
        }

        const fallback = getFallbackData(url);
        if (fallback !== null) {
          return resolve({ data: fallback });
        }
        reject(err);
      });
  });
}

export default fetchModel;
