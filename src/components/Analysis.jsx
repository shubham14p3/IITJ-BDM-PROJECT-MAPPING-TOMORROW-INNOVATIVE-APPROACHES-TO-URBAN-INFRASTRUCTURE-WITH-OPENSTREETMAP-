import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Modal,
} from "@mui/material";
import axios from "axios";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./Constant";

const Analysis = () => {
  const [roadNetworkGraph, setRoadNetworkGraph] = useState(null);
  const [spatialDistributionGraph, setSpatialDistributionGraph] = useState(null);
  const [loadingRoadNetwork, setLoadingRoadNetwork] = useState(false);
  const [loadingSpatialDistribution, setLoadingSpatialDistribution] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [setupMessage, setSetupMessage] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/map");
  };
  const fetchGraph = async (endpoint, setGraph, setLoading, graphName) => {
    setSetupMessage(
      `🚦 Selected the ${graphName}.\n📊 Selected 1000 limits.\n🔄 Setting up things for you...`
    );
    setLoading(true);
    try {
      const response = await axios.get(endpoint, { responseType: "blob" });
      const imageUrl = URL.createObjectURL(response.data);
      setGraph(imageUrl);
      setSelectedGraph({
        name: graphName,
        image: imageUrl,
        description: `This is the ${graphName} visualization.`,
      });
    } catch (error) {
      console.error("Error fetching graph:", error);
    } finally {
      setLoading(false);
      setSetupMessage("");
    }
  };

  const handleCloseModal = () => {
    setSelectedGraph(null);
  };

  return (
    <Layout>
      <Box
        sx={{
          background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: "white",
            padding: 5,
            borderRadius: 5,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#1565c0" }}
          >
            Graph Analysis
          </Typography>

          {/* Section 1: Road Network Graph */}
          <Box sx={{ marginBottom: 5, textAlign: "center" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1e88e5" }}
            >
              Enhanced Road Network Graph
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                fetchGraph(
                  `${BASE_URL}api/graph/road_network`,
                  setRoadNetworkGraph,
                  setLoadingRoadNetwork,
                  "Road Network Graph"
                )
              }
              disabled={loadingRoadNetwork}
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              {loadingRoadNetwork ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Load Road Network Graph"
              )}
            </Button>
            {setupMessage && loadingRoadNetwork && (
              <Typography
                variant="body1"
                sx={{
                  marginTop: 2,
                  fontStyle: "italic",
                  color: "#1e88e5",
                  animation: "fadeIn 1.5s infinite",
                }}
              >
                {setupMessage}
              </Typography>
            )}
          </Box>

          {/* Section 2: Spatial Distribution Graph */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1e88e5" }}
            >
              Enhanced Spatial Distribution of Roads
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                fetchGraph(
                  `${BASE_URL}/api/graph/spatial_distribution`,
                  setSpatialDistributionGraph,
                  setLoadingSpatialDistribution,
                  "Spatial Distribution Graph"
                )
              }
              disabled={loadingSpatialDistribution}
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              {loadingSpatialDistribution ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Load Spatial Distribution Graph"
              )}
            </Button>
            {setupMessage && loadingSpatialDistribution && (
              <Typography
                variant="body1"
                sx={{
                  marginTop: 2,
                  fontStyle: "italic",
                  color: "#1e88e5",
                  animation: "fadeIn 1.5s infinite",
                }}
              >
                {setupMessage}
              </Typography>
            )}
          </Box>
        </Container>
        {/* Modal */}
        <Modal open={!!selectedGraph} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60vw",
              maxHeight: "70vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedGraph && (
              <>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                  {selectedGraph.name}
                </Typography>
                <img
                  src={selectedGraph.image}
                  alt={selectedGraph.name}
                  style={{
                    width: "100%",
                    maxHeight: "50vh",
                    objectFit: "contain",
                    borderRadius: "5px",
                    marginBottom: 2,
                  }}
                />
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  {selectedGraph.description}
                </Typography>
                <Box textAlign="center" sx={{ marginTop: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      window.open(selectedGraph.image, "_blank")
                    }
                    sx={{ marginRight: 2 }}
                  >
                    Download Image
                  </Button>
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}// Disable button if no table is selected
        >
          Proceed to 3D View
        </Button>
      </Box>
    </Layout>
  );
};

export default Analysis;
