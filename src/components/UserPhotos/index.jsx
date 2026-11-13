import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import fetchModel, { SERVER_URL } from "../../lib/fetchModelData";
import "./styles.css";

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getPhotoSrc(fileName) {
  return `${SERVER_URL}/images/${fileName}`;
}

function PhotoCard({ photo }) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={getPhotoSrc(photo.file_name)}
            alt={photo.file_name}
            onError={(e) => {
              if (!e.target.src.endsWith(`/images/${photo.file_name}`)) {
                e.target.src = `/images/${photo.file_name}`;
              }
            }}
            style={{
              maxWidth: "100%",
              maxHeight: 340,
              objectFit: "contain",
              borderRadius: 4,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Uploaded: {formatDateTime(photo.date_time)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Comments ({photo.comments ? photo.comments.length : 0})
        </Typography>

        {photo.comments && photo.comments.length > 0 ? (
          photo.comments.map((comment) => (
            <Box key={comment._id} sx={{ mt: 1.5, p: 1.5, bgcolor: "#f9f9f9", borderRadius: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Link
                  to={`/users/${comment.user._id}`}
                  style={{ textDecoration: "none", fontWeight: 600, color: "#1976d2" }}
                >
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(comment.date_time)}
                </Typography>
              </Box>
              <Typography variant="body2">{comment.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No comments yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function UserPhotos({ advancedFeatures }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetchModel(`/photosOfUser/${userId}`)
      .then((res) => {
        setPhotos(res.data || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load photos");
      });
  }, [userId]);

  useEffect(() => {
    if (advancedFeatures && photoIndex === undefined && photos.length > 0) {
      navigate(`/photos/${userId}/0`, { replace: true });
    } else if (!advancedFeatures && photoIndex !== undefined) {
      navigate(`/photos/${userId}`, { replace: true });
    }
  }, [advancedFeatures, photoIndex, userId, photos.length, navigate]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (photos.length === 0) {
    return <Typography variant="body1">This user has no photos.</Typography>;
  }

  const isStepper = advancedFeatures || photoIndex !== undefined;

  if (isStepper) {
    const rawIndex = photoIndex ? parseInt(photoIndex, 10) : 0;
    const currentIndex = Math.min(Math.max(isNaN(rawIndex) ? 0 : rawIndex, 0), photos.length - 1);
    const currentPhoto = photos[currentIndex];

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: 1.5,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
          }}
        >
          <Button
            variant="outlined"
            disabled={currentIndex <= 0}
            onClick={() => navigate(`/photos/${userId}/${currentIndex - 1}`)}
          >
            Previous
          </Button>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Photo {currentIndex + 1} of {photos.length}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentIndex >= photos.length - 1}
            onClick={() => navigate(`/photos/${userId}/${currentIndex + 1}`)}
          >
            Next
          </Button>
        </Box>
        <PhotoCard photo={currentPhoto} />
      </Box>
    );
  }

  return (
    <Box>
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </Box>
  );
}

export default UserPhotos;
