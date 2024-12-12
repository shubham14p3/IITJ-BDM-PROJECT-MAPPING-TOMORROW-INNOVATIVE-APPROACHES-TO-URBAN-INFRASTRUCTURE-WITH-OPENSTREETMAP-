import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";

const Graph = () => {
  const graphEndpoints = [
    { name: "Node Density Histogram", url: "/api/node_density_histogram" },
    { name: "Scatter Plot (Latitude vs Longitude)", url: "/api/scatter_plot_lat_lon" },
    { name: "Road Length Distribution", url: "/api/road_length_distribution" },
    { name: "Node Density Heatmap", url: "/api/node_density_heatmap" },
    { name: "Road Orientation Distribution", url: "/api/road_orientation_distribution" },
    { name: "Feature Type Frequency", url: "/api/feature_type_frequency" },
  ];

  const [graphStates, setGraphStates] = useState(
    graphEndpoints.map((graph) => ({ name: graph.name, url: graph.url, status: "loading", image: null }))
  );

  useEffect(() => {
    const fetchGraphs = async () => {
      for (const graph of graphEndpoints) {
        setGraphStates((prev) =>
          prev.map((g) =>
            g.name === graph.name ? { ...g, status: "loading" } : g
          )
        );

        try {
          const response = await fetch(`http://127.0.0.1:5000${graph.url}`);
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
    };

    fetchGraphs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Graph Visualizations
      </Typography>

      <Grid container spacing={4}>
        {graphStates.map((graph, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                textAlign: "center",
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold", color: "#1976d2" }}
              >
                {graph.name}
              </Typography>
              {graph.status === "loading" && <CircularProgress />}
              {graph.status === "success" && (
                <img
                  src={graph.image}
                  alt={graph.name}
                  style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                />
              )}
              {graph.status === "error" && (
                <Typography variant="body2" color="error">
                  Failed to load graph.
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Graph;
