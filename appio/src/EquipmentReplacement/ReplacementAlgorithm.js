import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const EquipmentReplacement = () => {
  const [results, setResults] = useState([]);
  const [iteration, setIteration] = useState(0); // Controla el índice de iteración

  useEffect(() => {
    const storedData = localStorage.getItem('equipmentReplacementData');
    if (storedData) {
      const { initialCost, projectDuration, equipmentLifetime, annualData } = JSON.parse(storedData);
      const costs = calculateReplacementPlan(projectDuration, initialCost, equipmentLifetime, annualData);
      setResults(costs); // No invertir, mantener el orden de menor a mayor
    }
  }, []); // Esto ejecutará la función una vez al montar el componente

  const handleNextIteration = () => {
    if (iteration < results.length - 1) {
      setIteration(iteration + 1); // Incrementar el índice de iteración
    }
  };

  function calculateCtx(t, x, costInitial, annualData) {
    let totalMaintenance = 0;
    let differenceInstance = Math.abs(t - x);
    for (let i = 1; i <= differenceInstance; i++) {
      const cost = annualData.find((data) => data.year === i);
      totalMaintenance += cost.maintenanceCost;
    }
    return costInitial + totalMaintenance - annualData.find((data) => data.year === differenceInstance).resaleValue;
  }

  function getMin(list) {
    const minItem = list.reduce((min, item) => {
      return item.valor < min.valor ? item : min;
    }, list[0]);

    const minValue = minItem.valor;

    const itemsWithMinValue = list.filter((item) => item.valor === minValue);

    const firstT = itemsWithMinValue[0].t;

    const xValues = itemsWithMinValue.map((item) => item.x);

    const result = {
      t: firstT,
      x: xValues,
      valor: minValue,
    };

    return result;
  }

  function calculateReplacementPlan(projectDuration, costInitial, equipmentLifetime, annualData) {
    let costs = [];

    for (let i = projectDuration; i >= 0; i--) {
      if (i === projectDuration) {
        let data = {
          t: i,
          x: [0],
          valor: 0,
        };
        costs.push(data);
        continue;
      }

      let min = [];
      for (let x = i + 1; Math.abs(i - x) <= equipmentLifetime && x <= projectDuration; x++) {
        let ctx = calculateCtx(i, x, costInitial, annualData);
        let v = costs.find((data) => data.t === x);

        if (!costs.find((data) => data.t === i && data.x.includes(x))) {
          min.push({
            t: i,
            x: [x],
            valor: ctx + v.valor,
          });
        }
      }

      costs.push(getMin(min));
    }

    return costs;
  }

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", margin: "30px 30px" }}>
        <Typography variant="h4">Equipment Replacement</Typography>
      </div>
      <Box
        display="flex" // Para centrar toda la tabla
        justifyContent="center"
        alignItems="center"
        margin={10}
      >
        <Table style={{ width: '50%' }}> {/* Controlar el ancho de la tabla */}
          <TableHead>
            <TableRow>
              {/* Centrando los encabezados */}
              <TableCell style={{ textAlign: 'center' }}>T</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Valor</TableCell>
              <TableCell style={{ textAlign: 'center' }}>X</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {results.slice(0, iteration + 1).map((result, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: 'center' }}>{result.t}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{result.valor}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{result.x.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box style={{ textAlign: 'center', margin: '30px 30px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextIteration}
            disabled={iteration >= results.length - 1}
            style={{ margin: '30px 30px' }}
          >
            Next Iteration
          </Button>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default EquipmentReplacement;
