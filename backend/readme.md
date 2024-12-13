# Interactive Map and Data Visualization API

## Setup Instructions

To set up the environment and run the application, follow these steps:

1. **Create and Activate a Virtual Environment**:
   ```bash
   python -m pip install virtualenv
   python -m venv venv
   source venv/Scripts/activate  # For Windows
   source venv/bin/activate      # For macOS/Linux
   ```

2. **Deactivate the Virtual Environment**:
   To exit the virtual environment:
   ```bash
   deactivate
   ```

3. **Install Required Dependencies**:
   ```bash
   pip install flask flask-cors google-cloud-bigquery pandas numpy networkx contextily geopandas folium google-cloud-bigquery-storage
   ```

## Summary of Routes

| Route                                | Visualization                                  |
|--------------------------------------|-----------------------------------------------|
| `/api/node_density_histogram`        | Histogram of node density by latitude         |
| `/api/scatter_plot_lat_lon`          | Scatter plot of latitude vs longitude         |
| `/api/road_length_distribution`      | Road length distribution histogram            |
| `/api/feature_type_frequency`        | Bar chart of feature type frequency           |
| `/api/node_density_heatmap`          | Heatmap of node density                       |
| `/api/road_orientation_distribution` | Histogram of road orientations                |
| `/api/fetch_raw_data`                | Fetch raw data                                |
| `/api/road_type_distribution`        | Road type distribution visualization          |
| `/api/query_all_tables`              | Get schema of all valid tables                |
| `/api/query_all_tables`              | Fetch data from all valid tables with table name in response |

## API Features

This API provides the following functionalities:

1. **Node Density Analysis**:
   - Visualize node density across regions with histograms and heatmaps.

2. **Spatial Analysis**:
   - Generate scatter plots of geographical coordinates (latitude and longitude).

3. **Road Network Insights**:
   - Analyze road lengths, types, and orientations through histograms and bar charts.

4. **Feature Type Exploration**:
   - Examine feature type frequencies to understand the distribution of data.

5. **Dynamic Data Queries**:
   - Fetch raw data and schemas for all valid tables in the dataset.

## Technologies Used

- **Flask**: Backend API framework
- **Flask-CORS**: Enable Cross-Origin Resource Sharing for frontend integration
- **Google BigQuery**: Data source for spatial and road network data
- **GeoPandas**: Spatial data manipulation and analysis
- **Folium**: Interactive map generation
- **Matplotlib**: Data visualization

## Usage

1. **Run the Application**:
   Start the Flask app:
   ```bash
   python app.py
   ```

2. **Access the API**:
   Open your browser or use a tool like Postman to access the endpoints listed above.

3. **Integrate with Frontend**:
   Use the `/api/map` endpoint to fetch an interactive map that can be embedded in a frontend application.

## Example Visualization

Once the application is running, access various routes to generate visualizations, such as:

- Road length distribution histograms
- Heatmaps of node density
- Scatter plots of road networks
- Bar charts of feature types

## Notes

- Ensure that Google Cloud credentials are properly configured for accessing BigQuery.
- Use `venv` for an isolated development environment.

## Contributions

Feel free to contribute to this project by creating pull requests or submitting issues. Let us know how we can improve or add more features!

## License

This project is open-source and available under the MIT License.