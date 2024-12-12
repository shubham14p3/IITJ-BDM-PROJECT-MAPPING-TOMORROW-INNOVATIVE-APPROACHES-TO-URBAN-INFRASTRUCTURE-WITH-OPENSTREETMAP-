import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Container, Button } from "@mui/material";
import Layout from "../layout/Layout";

const SchemaCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableName = location.state?.tableName;

  useEffect(() => {
    if (tableName) {
      const fetchSchema = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/get_schema_for_table", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ table_name: tableName }),
          });

          const result = await response.json();
          if (result.success) {
            setSchema(result.schema);
          } else {
            console.error("Error fetching schema:", result.error);
          }
        } catch (error) {
          console.error("Error fetching schema:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSchema();
    }
  }, [tableName]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (<Layout>
    <Container maxWidth="md" sx={{
      paddingTop: 5,
      paddingBottom: 10
    }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Schema Details for {tableName}
      </Typography>

      {schema.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Field Name</strong></TableCell>
              <TableCell><strong>Field Type</strong></TableCell>
              <TableCell><strong>Mode</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schema.map((field, index) => (
              <TableRow key={index}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.mode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body1" align="center">
          No schema information available for this table.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
        }}
      >
        {/* Back Button */}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          Back
        </Button>

        {/* Next Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate("/generate-graph", { state: { tableName, schema } })
          } // Navigate to the graph generation page with table and schema data
        >
          Next
        </Button>
      </Box>
    </Container></Layout>
  );
};

export default SchemaCheck;
