import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Container,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Card,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function DataAnalysis() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/select-table'); // Navigate to the data analysis component
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:5000/api/data/fetch_all");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);

        // Extract tabs dynamically
        const keys = Object.keys(result);
        setTabs(keys);
        setActiveTab(keys[0]); // Set the first tab as active
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // Get current tab's data
  const getCurrentData = () => {
    if (!data || !data[activeTab]) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data[activeTab].slice(startIndex, endIndex);
  };

  // Render table headers dynamically
  const renderTableHeaders = () => {
    if (!data || !data[activeTab] || data[activeTab].length === 0) return null;
    return (
      <TableRow>
        {Object.keys(data[activeTab][0]).map((key, index) => (
          <TableCell key={index} sx={{ fontWeight: "bold" }}>
            {key}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderTableRows = () => {
    const currentData = getCurrentData();
    if (!currentData) return null;

    return currentData.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {Object.entries(row).map(([key, value], colIndex) => (
          <TableCell key={colIndex}>
            {value === null
              ? "-"
              : Array.isArray(value)
                ? value.map((item) =>
                  typeof item === "object"
                    ? (
                      <div key={item.key} style={{ marginBottom: "4px" }}>
                        <strong>{item.key}:</strong> {item.value}
                      </div>
                    )
                    : item
                )
                : typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : value.toString()}
          </TableCell>
        ))}
      </TableRow>
    ));
  };



  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Container maxWidth="lg" sx={{ paddingTop: 5, paddingBottom: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#333" }}
        >Geo Open Street Map from BigQuery
        </Typography>

        <Box sx={{ textAlign: "center", marginTop: 2 }}><a
          href="https://console.cloud.google.com/bigquery?inv=1&invt=Abj59Q&project=g23ai2028&ws=!1m14!1m4!4m3!1sbigquery-public-data!2sgeo_openstreetmap!3splanet_features!1m4!1m3!1sg23ai2028!2sbquxjob_5f643de6_193ba5581d9!3sUS!1m3!3m2!1sbigquery-public-data!2sgeo_openstreetmap"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          Click here to redirect to BigQuery
        </a>
        </Box>
        <br />
        {/* Tabs */}
        {tabs.length > 0 && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              {tabs.map((tab) => (
                <Tab key={tab} label={tab} value={tab} />
              ))}
            </Tabs>
          </Box>
        )}

        <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={3} display="flex" justifyContent="flex-end">
                <FormControl variant="outlined" size="small">
                  <InputLabel>Rows per page</InputLabel>
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    label="Rows per page"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>{renderTableHeaders()}</TableHead>
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              </Box>

              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil((data[activeTab]?.length || 0) / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Card>
      </Container>
      <Button
        variant="contained"
        onClick={handleNext}
      >
        Next Step
      </Button>
    </Box >
  );
}

export default DataAnalysis;
