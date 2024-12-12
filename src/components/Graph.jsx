import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const Graph = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableName } = location.state || {};

  const graphEndpoints = [
    {
      name: "Node Density Histogram",
      url: "/api/graph/node_density_histogram",
      description:
        "This histogram shows the density of nodes by latitude, indicating the distribution of mapped features in the dataset.",
    },
    {
      name: "Scatter Plot (Latitude vs Longitude)",
      url: "/api/graph/scatter_plot_lat_lon",
      description:
        "A scatter plot mapping latitude and longitude to visualize spatial distributions of nodes.",
    },
    {
      name: "Road Length Distribution",
      url: "/api/graph/road_length_distribution",
      description:
        "A histogram showing the length distribution of roads, providing insights into road structures.",
    },
    {
      name: "Node Density Heatmap",
      url: "/api/graph/node_density_heatmap",
      description:
        "A heatmap highlighting areas with high node densities, showing areas of detailed mapping.",
    },
    {
      name: "Road Orientation Distribution",
      url: "/api/graph/road_orientation_distribution",
      description:
        "A histogram showing the orientation of roads in degrees, providing insights into road alignment patterns.",
    },
    {
      name: "Feature Type Frequency",
      url: "/api/graph/feature_type_frequency",
      description:
        "A bar chart showing the frequency of feature types like highways or paths.",
    },
  ];

  const [graphStates, setGraphStates] = useState(
    graphEndpoints.map((graph) => ({
      name: graph.name,
      url: graph.url,
      description: graph.description,
      status: "loading",
      image: null,
    }))
  );
  const [selectedGraph, setSelectedGraph] = useState(null); // For modal
  const [globalLoading, setGlobalLoading] = useState(true);

  useEffect(() => {
    const fetchGraphs = async () => {
      setGlobalLoading(true);
      for (const graph of graphEndpoints) {
        setGraphStates((prev) =>
          prev.map((g) =>
            g.name === graph.name ? { ...g, status: "loading" } : g
          )
        );

        try {
          const response = await fetch(
            `http://127.0.0.1:5000${graph.url}?table_name=${tableName}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch ${graph.name}`);
          }
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          setGraphStates((prev) =>
            prev.map((g) =>
              g.name === graph.name
                ? { ...g, status: "success", image: imageUrl }
                : g
            )
          );
        } catch (error) {
          console.error(`Error loading ${graph.name}:`, error);
          setGraphStates((prev) =>
            prev.map((g) =>
              g.name === graph.name ? { ...g, status: "error" } : g
            )
          );
        }
      }
      setGlobalLoading(false);
    };

    fetchGraphs();
  }, [tableName]);

  const handleOpenModal = (graph) => {
    setSelectedGraph(graph);
  };

  const handleCloseModal = () => {
    setSelectedGraph(null);
  };
  const downloadImage = (imageUrl, imageName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${imageName}.png`; // Save as PNG
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleProceed = () => {
    const successfulGraphs = graphStates
      .filter((graph) => graph.status === "success")
      .map((graph) => ({ name: graph.name, url: graph.url }));

    navigate("/further-analysis", {
      state: { tableName, graphs: successfulGraphs },
    });
  };

  return (<Layout>
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 5, transition: "opacity 0.5s ease-in-out",
        paddingBottom: 10
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Exploratory Data Analysis (EDA)
        <br />
        Graph Visualizations for {tableName}
      </Typography>

      {globalLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={4}
          sx={{
            opacity: globalLoading ? 0 : 1,
            transition: "opacity 0.5s ease-in-out",
            justifyContent: "center",
          }}
        >
          {graphStates
            .filter((graph) => graph.status === "success") // Remove failed graphs
            .map((graph, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: 2,
                    cursor: "pointer",
                    width: "100%",
                    height: "250px", // Fixed height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden", // Ensure no overflow
                  }}
                  onClick={() => handleOpenModal(graph)}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 2,
                      fontWeight: "bold",
                      color: "#1976d2",
                    }}
                  >
                    {graph.name}
                  </Typography>
                  <img
                    src={graph.image}
                    alt={graph.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain", // Maintain aspect ratio within the fixed size
                    }}
                  />
                </Box>

              </Grid>
            ))}
        </Grid>
      )}

      {/* Proceed Further Button */}
      {!globalLoading && (
        <Box textAlign="center" sx={{ marginTop: 4 }}>
          <Button variant="contained" color="primary" onClick={handleProceed}>
            Proceed to Further Analysis
          </Button>
        </Box>
      )}

      {/* Modal for Expanded View */}
      <Modal open={!!selectedGraph} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw", // Decreased width
            maxHeight: "70vh", // Decreased height
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: "auto", // Scroll if content overflows
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
                  maxHeight: "50vh", // Ensure the image fits well in the modal
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
                    downloadImage(
                      selectedGraph.image,
                      `${tableName}_${selectedGraph.name.replace(/\s+/g, "_")}`
                    )
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

    </Container>
  </Layout>
  );
};

export default Graph;
