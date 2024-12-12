import React, { useState, useEffect } from "react";
import {
  Pagination,
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
} from "@mui/material";
import Layout from "../layout/Layout";

function DataAnalysis() {
  const [data, setData] = useState([]); // Holds the dataset
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true
        const response = await fetch("http://54.146.176.249:5000/api/merged_data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); // Set the fetched data
        setLoading(false); // Set loading state to false
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading state to false
      }
    };

    fetchData();
  }, []);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to the first page when items per page change
  };

  // Get paginated data
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Dynamically render table headers
  const renderTableHeaders = () => {
    if (!data.length) return null;

    const headers = Object.keys(data[0]); // Get headers from the first record
    return (
      <TableRow>
        {headers.map((header, index) => (
          <TableCell
            key={index}
            sx={{
              fontWeight: "bold",
              backgroundColor: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // Dynamically render table rows
  const renderTableRows = () => {
    const currentData = getCurrentData();
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
                : value} {/* Display everything else as it is */}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (<Layout>
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: 10
      }}
    >
      <Container maxWidth="lg" sx={{ paddingTop: 5, paddingBottom: 5 }}>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Statement 3: Data Integration and Consolidation
        </Typography>

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
            ) : data.length ? (
              <Table>
                <TableHead>{renderTableHeaders()}</TableHead>
                <TableBody>{renderTableRows()}</TableBody>
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
    </Box></Layout>
  );
}

export default DataAnalysis;
