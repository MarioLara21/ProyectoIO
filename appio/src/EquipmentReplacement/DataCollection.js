import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableCell, TableBody, TableRow, TableHead } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const DataCollection = () => {
  const [initialCost, setInitialCost] = useState(0);
  const [projectDuration, setProjectDuration] = useState(0);
  const [equipmentLifetime, setEquipmentLifetime] = useState(0);
  const [annualData, setAnnualData] = useState([]);

  useEffect(() => {
    const adjustedData = Array.from({ length: equipmentLifetime }, (_, index) => {
      // Retain existing data if it exists, otherwise initialize with defaults
      const existingData = annualData[index] || { resaleValue: 0, maintenanceCost: 0 };
      return {
        year: index + 1, // Ensures that year is included
        resaleValue: existingData.resaleValue,
        maintenanceCost: existingData.maintenanceCost,
      };
    });
    setAnnualData(adjustedData);
  }, [equipmentLifetime]); // Triggers update when equipmentLifetime changes

  const handleInputChange = (e, setter) => {
    setter(parseInt(e.target.value, 10));
  };

  const handleAnnualDataChange = (index, field, value) => {
    const newData = [...annualData];
    newData[index] = { 
      ...newData[index], 
      [field]: parseFloat(value) // Update the specific field (resaleValue or maintenanceCost)
    };
    setAnnualData(newData);
  };

  const handleCalculateClick = () => {
    const data = {
      initialCost,
      projectDuration,
      equipmentLifetime,
      annualData,
    };
    localStorage.setItem('equipmentReplacementData', JSON.stringify(data));
    window.location.href = '/equipment-replacement';
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", margin: "30px 30px" }}>
        <Typography variant="h4">Equipment Replacement Data Collection</Typography>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Box display="flex" flexDirection="row" justifyContent="center" mb={5}>
          <TextField
            label="Initial Cost"
            type="number"
            value={initialCost}
            onChange={(e) => handleInputChange(e, setInitialCost)}
            sx={{ width: '200px' }}
          />

          <TextField
            label="Project Duration (1-30)"
            type="number"
            value={projectDuration}
            onChange={(e) => handleInputChange(e, setProjectDuration)}
            InputProps={{ inputProps: { min: 1, max: 30 } }}
            sx={{ width: '200px' }}
          />

          <TextField
            label="Equipment Lifetime (1-10)"
            type="number"
            value={equipmentLifetime}
            onChange={(e) => handleInputChange(e, setEquipmentLifetime)}
            InputProps={{ inputProps: { min: 1, max: 10 } }}
            sx={{ width: '200px' }}
          />
        </Box>

        <Typography variant="h6">Annual Data</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell>Resale Value</TableCell>
              <TableCell>Maintenance Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {annualData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.year}</TableCell> {/* Display the year */}
                <TableCell>
                  <TextField
                    type="number"
                    value={data.resaleValue || ''}
                    onChange={(e) => handleAnnualDataChange(index, 'resaleValue', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={data.maintenanceCost || ''}
                    onChange={(e) => handleAnnualDataChange(index, 'maintenanceCost', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" color="primary" style={{ margin: "30px 30px" }} onClick={handleCalculateClick}>
          Calculate Replacement Plan
        </Button>
      </Box>
      <Footer />
    </div>
  );
};

export default DataCollection;
