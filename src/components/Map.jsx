import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Grid,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Layout from "../layout/Layout";
import { BASE_URL } from "./Constant";

const Map = () => {
  const [mapHtml, setMapHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Fetch the map HTML from the backend
    const fetchMap = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/map?limit=1000&offset=0`);
        if (response.data.mapHtml) {
          setMapHtml(response.data.mapHtml);
        } else {
          setError("Failed to load the map.");
        }
      } catch (err) {
        setError("Error fetching the map: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Layout>
      <Container>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#2e3b55" }}>
            Analysis of <em>planet_features_lines</em>
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            This visualization provides an interactive map showcasing the road network data
            extracted from the <strong>planet_features_lines</strong> table of OpenStreetMap. The map highlights key road geometries, enabling users to delve into the spatial intricacies of transportation infrastructure. By analyzing the road network, we aim to shed light on connectivity patterns, urban planning, and the geographical layout of regions.
            <br />
            <br />
            This map is particularly useful for:
            <ul style={{ paddingLeft: "20px" }}>
              <li><strong>Urban Planners:</strong> To identify gaps in infrastructure and plan new road projects effectively.</li>
              <li><strong>Researchers:</strong> To study how road networks impact urban growth, traffic flow, and accessibility.</li>
              <li><strong>Public Administrators:</strong> To improve navigation and optimize routes for emergency services and public transport.</li>
              <li><strong>General Users:</strong> To explore the spatial organization of roads and understand their interconnectivity.</li>
            </ul>
            <br />
            Our analysis leverages cutting-edge tools like GeoPandas and Folium to render these geometries interactively, ensuring that even complex road structures can be explored seamlessly. Dive into this visualization to uncover insights about spatial patterns and their implications on urban mobility.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ textAlign: "center", mt: 4 }}>{error}</Alert>
        ) : (
          <Card
            elevation={3}
            sx={{ mt: 3, borderRadius: "16px", overflow: "hidden", backgroundColor: "#f9f9f9", cursor: "pointer" }}
            onClick={handleOpenModal}
          >
            <CardContent>
              <Box
                dangerouslySetInnerHTML={{ __html: mapHtml }}
                sx={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}
              />
            </CardContent>
          </Card>
        )}

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              height: "80%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              dangerouslySetInnerHTML={{ __html: mapHtml }}
              sx={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}
            />
          </Box>
        </Modal>

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/")}
            sx={{ fontWeight: "bold", padding: "10px 20px", fontSize: "1rem" }}
          >
            Thank You - Go to Home
          </Button>
        </Box>
      </Container>
      <br />
      <br />
    </Layout>
  );
};

export default Map;
