import React, { useState, useEffect } from "react";
import {
  Pagination,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";

function DataAnalysis() {
  const [data, setData] = useState(null); // Holds the entire dataset
  const [activeTab, setActiveTab] = useState(""); // Active tab state (dynamic tabs)
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page
  const [loading, setLoading] = useState(true); // Loading state
  const [tabs, setTabs] = useState([]); // Holds the list of table names (keys from API)
  const navigate = useNavigate(); // React Router's navigation hook

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true
        const response = await fetch("http://54.146.176.249:5000/api/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);

        // Dynamically set tabs based on response keys
        const keys = Object.keys(result);
        setTabs(keys);
        setActiveTab(keys[0]); // Default to the first tab
        setLoading(false); // Set loading state to false
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading state to false
      }
    };

    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to the first page when the tab changes
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page when items per page change
  };

  // Get paginated data for the active tab
  const getCurrentData = () => {
    if (!data || !data[activeTab]) return []; // Handle case where data is undefined
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data[activeTab].slice(startIndex, endIndex); // Return only the current page data
  };

  // Dynamically render table headers based on the active tab's data
  const renderTableHeaders = () => {
    if (!data || !data[activeTab] || data[activeTab].length === 0) return null;

    const headers = Object.keys(data[activeTab][0]); // Get headers from the first record
    return (
      <TableRow>
        {headers.map((header, index) => (
          <TableCell key={index} sx={{ fontWeight: "bold" }}>
            {header}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // Dynamically render table rows based on the active tab's data
  const renderTableRows = (currentData) => {
    if (!currentData) return null;

    return currentData.map((item, rowIndex) => (
      <TableRow key={rowIndex}>
        {Object.values(item).map((value, colIndex) => (
          <TableCell
            key={colIndex}
            sx={{
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
          >
            {value === null || value === undefined
              ? "-" // Handle null or undefined explicitly
              : typeof value === "boolean"
              ? value
                ? "Yes"
                : "No" // Handle boolean values
              : value}{" "}
            {/* Display everything else as it is */}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  // Calculate total pages for pagination
  const totalPages = data ? Math.ceil(data[activeTab]?.length / itemsPerPage) : 1;

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
        >
        URBAN MOBILITY AND INFRASTRUCTURE OPTIMIZATION USING OPENSTREETMAP DATA
        </Typography>

        {/* Dynamic Tabs */}
        {tabs.length > 0 && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="data tabs"
              centered
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab} label={tab} value={tab} />
              ))}
            </Tabs>
          </Box>
        )}

        <Card
          sx={{
            backgroundColor: "#fff",
            boxShadow: 4,
            borderRadius: 4,
            padding: 3,
          }}
        >
          {/* Rows per Page Select */}
          <Box mb={3} display="flex" justifyContent="flex-end">
            <FormControl variant="outlined" size="small">
              <InputLabel id="rows-per-page-select-label">
                Rows per page
              </InputLabel>
              <Select
                labelId="rows-per-page-select-label"
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

          {/* Display Table */}
          <Box
            sx={{
              maxHeight: "400px", // Set a fixed height for the table container
              overflowY: "scroll", // Enable vertical scrolling
              overflowX: "auto", // Enable horizontal scrolling (if needed)
            }}
          >
            {loading ? (
              <Typography align="center">Loading data...</Typography>
            ) : data && data[activeTab] ? (
              <Table>
                <TableHead>{renderTableHeaders()}</TableHead>
                <TableBody>{renderTableRows(getCurrentData())}</TableBody>
              </Table>
            ) : (
              <Typography align="center">No data available.</Typography>
            )}
          </Box>

          {/* Pagination */}
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </Card>
      </Container>

      {/* Show Merged Data Button */}
      {data && (
        <Box textAlign="center" marginBottom={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/merged-data")}
          >
            Show Merged Data
          </Button>
        </Box>
      )}

      <Footer />
    </Box>
  );
}

export default DataAnalysis;
