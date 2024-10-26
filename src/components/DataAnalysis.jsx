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
  CardContent,
} from "@mui/material";
import Footer from "../ui/Footer";

function DataAnalysis() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  const getCurrentData = (type) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (!data) return [];

    switch (type) {
      case "listings":
        return data.listings.slice(startIndex, endIndex);
      case "calendar":
        return data.calendar.slice(startIndex, endIndex);
      case "reviews":
        return data.reviews.slice(startIndex, endIndex);
      default:
        return [];
    }
  };

  const renderTableData = (data) => {
    return data.map((item, index) => (
      <TableRow key={index}>
        {Object.values(item)
          .slice(0, 5)
          .map((val, i) => (
            <TableCell key={i}>{val}</TableCell>
          ))}
      </TableRow>
    ));
  };

  const totalPages = data
    ? Math.ceil(data[activeTab].length / itemsPerPage)
    : 1;

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
      <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          IITJ - Airbnb Data Cleaning, Processing and Advanced Analysis
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="data tabs"
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Listings" value="listings" />
            <Tab label="Calendar" value="calendar" />
            <Tab label="Reviews" value="reviews" />
          </Tabs>
        </Box>

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
          <Box>
            {data ? (
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(getCurrentData(activeTab)[0] || {})
                      .slice(0, 5)
                      .map((key, i) => (
                        <TableCell key={i} sx={{ fontWeight: "bold" }}>
                          {key}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>{renderTableData(getCurrentData(activeTab))}</TableBody>
              </Table>
            ) : (
              <Typography align="center">Loading data...</Typography>
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
      <span style={{ paddingTop: '15px', display: 'inline-block' }} />
      <Footer />
    </Box>
  );
}

export default DataAnalysis;
