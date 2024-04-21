import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ReplacementAlgorithm = () => {
  const [data, setData] = useState(null);
  const [results, setResults] = useState([]);
  const [calculationMethod, setCalculationMethod] = useState('columna');

  useEffect(() => {
    const storedData = localStorage.getItem('equipmentReplacementData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (data) {
      const calculatedResults = calculationMethod === 'iteración' ? calculateByIteration() : calculateByColumn();
      setResults(calculatedResults);
    }
  }, [data, calculationMethod]);

  const calculateByIteration = () => {
    const { initialCost, projectDuration, equipmentLifetime, annualData, inflationRate } = data;
    const iterations = [];

    for (let i = 1; i <= projectDuration; i++) {
      const iteration = {};
      iteration.period = i;

      if (i <= equipmentLifetime) {
        const { resaleValue, maintenanceCost, gain } = annualData[i - 1];
        iteration.resaleValue = resaleValue;
        iteration.maintenanceCost = maintenanceCost;
        iteration.gain = gain || 0;
      } else {
        iteration.resaleValue = 0;
        iteration.maintenanceCost = 0;
        iteration.gain = 0;
      }

      iteration.inflationRate = inflationRate;
      iteration.netCost = iteration.maintenanceCost - iteration.resaleValue - iteration.gain;
      iteration.presentValue = iteration.netCost / Math.pow(1 + inflationRate, i);
      iteration.cumulativePresentValue = i === 1 ? iteration.presentValue : iterations[i - 2].cumulativePresentValue + iteration.presentValue;
      iteration.optimalReplacement = iteration.cumulativePresentValue < initialCost ? 'Keep' : 'Replace';

      iterations.push(iteration);
    }

    return iterations;
  };

  const calculateByColumn = () => {
    const { initialCost, projectDuration, equipmentLifetime, annualData, inflationRate } = data;
    const columns = [];

    for (let i = 1; i <= projectDuration; i++) {
      const column = {};
      column.period = i;
      column.resaleValue = i <= equipmentLifetime ? annualData[i - 1].resaleValue : 0;
      column.maintenanceCost = i <= equipmentLifetime ? annualData[i - 1].maintenanceCost : 0;
      column.gain = i <= equipmentLifetime ? annualData[i - 1].gain || 0 : 0;
      column.inflationRate = inflationRate;
      column.netCost = column.maintenanceCost - column.resaleValue - column.gain;
      column.presentValue = column.netCost / Math.pow(1 + inflationRate, i);
      columns.push(column);
    }

    const cumulativePresentValues = columns.reduce((acc, cur) => {
      const lastValue = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(lastValue + cur.presentValue);
      return acc;
    }, []);

    columns.forEach((column, index) => {
      column.cumulativePresentValue = cumulativePresentValues[index];
      column.optimalReplacement = column.cumulativePresentValue < initialCost ? 'Keep' : 'Replace';
    });

    return columns;
  };

  return (
    <div>
      <Typography variant="h4">Replacement Plan</Typography>
      <Typography>Calculation Method: {calculationMethod === 'iteración' ? 'Iteration' : 'Column'}</Typography>
      <button onClick={() => setCalculationMethod(calculationMethod === 'iteración' ? 'columna' : 'iteración')}>
        Switch to {calculationMethod === 'iteración' ? 'Column' : 'Iteration'}
      </button>
      {data ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Resale Value</TableCell>
              <TableCell>Maintenance Cost</TableCell>
              <TableCell>Gain</TableCell>
              <TableCell>Inflation Rate</TableCell>
              <TableCell>Net Cost</TableCell>
              <TableCell>Present Value</TableCell>
              <TableCell>Cumulative Present Value</TableCell>
              <TableCell>Optimal Replacement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.period}</TableCell>
                <TableCell>{result.resaleValue}</TableCell>
                <TableCell>{result.maintenanceCost}</TableCell>
                <TableCell>{result.gain}</TableCell>
                <TableCell>{result.inflationRate}</TableCell>
                <TableCell>{result.netCost}</TableCell>
                <TableCell>{result.presentValue.toFixed(2)}</TableCell>
                <TableCell>{result.cumulativePresentValue.toFixed(2)}</TableCell>
                <TableCell>{result.optimalReplacement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No data available. Please collect data first.</Typography>
      )}
    </div>
  );
};

export default ReplacementAlgorithm;