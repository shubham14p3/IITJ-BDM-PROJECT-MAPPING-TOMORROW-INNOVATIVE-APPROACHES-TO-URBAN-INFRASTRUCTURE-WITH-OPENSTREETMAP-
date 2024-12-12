import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Container,
} from "@mui/material";
import Layout from "../layout/Layout";

const SelectTable = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate("/schema-check", { state: { tableName: selectedTable } });
    };

    const [selectedTable, setSelectedTable] = useState(""); // To store selected table
    const tables = [
        "history_changesets",
        "planet_features",
        "planet_features_lines",
        "planet_features_points",
        "planet_layers",
        "planet_nodes",
        "planet_relations",
        "planet_ways",
    ]; // List of table names

    const handleChange = (event) => {
        setSelectedTable(event.target.value); // Update selected table
    };

    return (<Layout>
        <Box
            sx={{
                background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
                paddingBottom:10
            }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", color: "#333" }}
                >
                    Please select a table to continue with your analysis
                </Typography>

                <FormControl fullWidth sx={{ marginTop: 3, marginBottom: 3 }}>
                    <InputLabel>Select Table</InputLabel>
                    <Select
                        value={selectedTable}
                        onChange={handleChange}
                        label="Select Table"
                    >
                        {tables.map((table, index) => (
                            <MenuItem key={index} value={table}>
                                {table}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedTable && (
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            marginBottom: 3,
                            color: "#1976d2",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                        }}
                    >
                        You have selected: <em>{selectedTable}</em>
                    </Typography>
                )}

                <Box textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!selectedTable} // Disable button if no table is selected
                    >
                        Proceed to Next Step
                    </Button>
                </Box>
            </Container>
        </Box></Layout>
    );
};

export default SelectTable;
