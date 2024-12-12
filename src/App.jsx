import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './ui/Home';
import DataAnalysis from './components/DataAnalysis';
import MergedData from './components/MergedData';
import SelectTable from './components/SelectTable';
import SchemaCheck from './components/SchemaCheck';
import Graph from './components/Graph';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/merged-data" element={<MergedData />} />
        <Route path="/select-table" element={<SelectTable />} />
        <Route path="/schema-check" element={<SchemaCheck />} />
        <Route path="/generate-graph" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;
