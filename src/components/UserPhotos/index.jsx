import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import fetchModel, { SERVER_URL } from "../../lib/fetchModelData";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchModel(`/photosOfUser/${userId}`)
      .then((res) => {
        setPhotos(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setPhotos([]);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body1">Loading photos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {photos.length === 0 ? (
        <Typography variant="h6">This user does not have any photos.</Typography>
      ) : (
        photos.map((photo) => (
          <Card key={photo._id} sx={{ marginBottom: 4 }} elevation={2}>
            <CardHeader
              title={`Posted on: ${formatDate(photo.date_time)}`}
              titleTypographyProps={{ variant: "subtitle1", color: "text.secondary" }}
            />
            <CardMedia
              component="img"
              image={`${SERVER_URL}/images/${photo.file_name}`}
              alt="User uploaded photo"
              onError={(e) => {
                if (!e.target.src.endsWith(`/images/${photo.file_name}`)) {
                  e.target.src = `/images/${photo.file_name}`;
                }
              }}
              sx={{ maxHeight: 500, objectFit: "contain", bgcolor: "#f5f5f5" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Comments:
              </Typography>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <Box
                    key={comment._id}
                    sx={{
                      mb: 2,
                      pl: 2,
                      borderLeft: "3px solid #1976d2",
                    }}
                  >
                    <Typography variant="subtitle2">
                      {comment.user ? (
                        <Link
                          to={`/users/${comment.user._id}`}
                          style={{
                            textDecoration: "none",
                            color: "#1976d2",
                            fontWeight: "bold",
                          }}
                        >
                          {`${comment.user.first_name} ${comment.user.last_name}`}
                        </Link>
                      ) : (
                        "Unknown user"
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({formatDate(comment.date_time)})
                      </Typography>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserPhotos;
