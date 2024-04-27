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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const lines = reader.result.split('\n');

      // Extraer la primera fila para obtener los valores iniciales
      const initialLine = lines[1]; // La segunda fila tiene los valores iniciales
      const initialValues = initialLine.split(',').map((value) => parseInt(value, 10));

      const initialCost = initialValues[0]; // Primer valor para `InitialCost`
      const projectDuration = initialValues[1]; // Segundo valor para `ProjectDuration`
      const equipmentLifetime = initialValues[2]; // Tercer valor para `EquipmentLifetime`

      // Procesar el resto de las filas para obtener datos anuales
      const headers = lines[2].split(','); // La tercera fila contiene los encabezados de datos anuales
      const annualData = lines.slice(3).map((line) => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = parseInt(values[index].trim(), 10); // Convertir a número
        });
        return obj;
      });
      const data = {
        initialCost,
        projectDuration,
        equipmentLifetime,
        annualData,
      };
      localStorage.setItem('equipmentReplacementData', JSON.stringify(data));
      window.location.href = '/equipment-replacement';
    };

    reader.readAsText(file); // Leer el archivo
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
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }} // Ocultar la entrada de archivo
          onChange={handleFileUpload}
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span"> {/* Botón MUI */}
            Upload File
          </Button>
        </label>
      </Box>
      <Footer />
    </div>
  );
};

export default DataCollection;
