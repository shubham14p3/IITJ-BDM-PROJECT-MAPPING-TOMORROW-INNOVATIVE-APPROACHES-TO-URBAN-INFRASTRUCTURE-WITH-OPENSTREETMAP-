# IITJ-BDM-PROJECT-MAP360-WITH-OPENSTREETMAP-DATA
IITJ-BDM-PROJECT-MAP360-WITH-OPENSTREETMAP-DATA
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]


## Welcome Screen

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
   pip install flask flask-cors google-cloud-bigquery pandas numpy networkx contextily geopandas folium google-cloud-bigquery-storage db-dtypes
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

## Visualization

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


## Authors

👤 **Shubham Raj**

- Github: [@ShubhamRaj](https://github.com/shubham14p3)
- Linkedin: [Shubham Raj](https://www.linkedin.com/in/shubham14p3/)

👤 **Bhagchandani Niraj**

- Github: [@BhagchandaniNiraj](https://github.com/bhagchandaniniraj)
- Linkedin: [Niraj Bhagchandani](https://linkedin.com/in/niraj-bhagchandani-218280201)

👤 **Bhavesh Arora**

- Github: [@BhaveshArora](https://github.com/bhavesharora02)
- Linkedin: [Bhavesh Arora](https://linkedin.com/in/bhavesh-arora-11b0a319b)

## Future Upgrades

- Make the special move for Goku- Kamahamehaa.
- Make the Beerus killable..
- Limit the speed at which the main character can fire to increase difficulty.
- Create more scenes and adding more players for each scene.

## 🤝 Contributing

Feel free to check the [issues page](https://github.com/shubham14p3/iitj-vcc-gcp-react-api/issues).

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- Project requested by [IITJ](https://www.iitj.ac.in/).
- Game based on the very successful DBZ franchise. All rights reserved to DBZ Team. The use of her property is solely for educational purposes.

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/shubham14p3/iitj-vcc-gcp-react-api.svg?style=flat-square
[contributors-url]: https://github.com/shubham14p3/iitj-vcc-gcp-react-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/shubham14p3/iitj-vcc-gcp-react-api.svg?style=flat-square
[forks-url]: https://github.com/shubham14p3/iitj-vcc-gcp-react-api/network/members
[stars-shield]: https://img.shields.io/github/stars/shubham14p3/iitj-vcc-gcp-react-api.svg?style=flat-square
[stars-url]: https://github.com/shubham14p3/iitj-vcc-gcp-react-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/shubham14p3/iitj-vcc-gcp-react-api.svg?style=flat-square
[issues-url]: https://github.com/shubham14p3/iitj-vcc-gcp-react-api/issues
