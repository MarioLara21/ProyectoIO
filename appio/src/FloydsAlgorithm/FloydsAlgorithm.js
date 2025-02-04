import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Box } from '@mui/material';

const NODE_COUNT_KEY = 'nodeCount';
const MAX_VALUE = Number.MAX_SAFE_INTEGER;

const FloydsAlgorithm = () => {
  const [nodes, setNodes] = useState(0);
  const [distances, setDistances] = useState([]);
  const [paths, setPaths] = useState([]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [showPaths, setShowPaths] = useState(false);
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [resultPath, setResultPath] = useState([]);
  const [nodeNames, setNodeNames] = useState([]);
  const [iterationsCompleted, setIterationsCompleted] = useState(false); // Nueva variable de estado

  useEffect(() => {
    const storedNodes = localStorage.getItem(NODE_COUNT_KEY);
    if (storedNodes) {
      const n = parseInt(storedNodes);
      setNodes(n);
      setDistances(Array(n).fill(0).map(() => Array(n).fill(0)));
      setPaths(Array(n).fill(0).map(() => Array(n).fill(null)));
      const storedNodeNames = localStorage.getItem('nodeNames');
      if (storedNodeNames) {
        const names = JSON.parse(storedNodeNames);
        setNodeNames(names);
      }
      const storedData = localStorage.getItem('fileData');
      if (storedData) {
        const data = JSON.parse(storedData);
        const updatedData = data.map(row => {
          return row.map(item => (item === null ? "Inf" : item));
        });
        setDistances(updatedData);
      }
    }
  }, []);

  const handleDistanceChange = (row, col, value) => {
    const newDistances = [...distances];
    newDistances[row][col] = value;
    setDistances(newDistances);
  };

  const runNextIteration = () => {
    setDistances(distances);
    const n = nodes;
    const dist = JSON.parse(JSON.stringify(distances));
    const path = JSON.parse(JSON.stringify(paths));

    const mirrorDist = dist.map(row =>
      row.map(value => (value === "Inf" ? MAX_VALUE : value))
    );

    console.log("Distancias: ", mirrorDist);

    // //necesito que los valores que no tengan infinito sean -2 en el path
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (mirrorDist[i][j] === MAX_VALUE) {
          path[i][j] = null;
        } else if ((0 > path[i][j] || path[i][j] > nodes - 1) || path[i][j] === null) {
          path[i][j] = -2;
        }
      }
    }

    // console.log("Distancias: ", mirrorDist);
    console.log("Rutas: ", path);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== currentIteration && j !== currentIteration) {
          if (mirrorDist[i][j] > mirrorDist[i][currentIteration] + mirrorDist[currentIteration][j]) {
            mirrorDist[i][j] = mirrorDist[i][currentIteration] + mirrorDist[currentIteration][j];
            path[i][j] = currentIteration;
          }
        }
      }
    }

    const restoredDist = mirrorDist.map(row =>
      row.map(value => (value === MAX_VALUE ? "Inf" : value))
    );

    setDistances(restoredDist);
    setPaths(path);
    setCurrentIteration(currentIteration + 1);

    if (currentIteration === nodes - 1) {
      setShowPaths(true);
      setIterationsCompleted(true); // Marcar que las iteraciones se han completado
    }
  };

  const getPath = (start, end) => {

    console.log("Start: ", start);
    console.log("End: ", end);

    const path = [];
    let current = start;
    path.push(nodeNames[current]);

    console.log("Current: ", current);

    while (current !== end) {
      console.log("IN Current: ", current);
      const next = paths[current][end];
      if (next === null || next === -1) {
        path.push('∞'); // No hay ruta directa
        break;
      } else if (next === -2) { // Ruta directa
        path.push(nodeNames[end]);
        break;
      } else {
        path.push(nodeNames[next]);
        current = next;
      }
    }
    return path;
  };

  const handleStartNodeChange = (event) => {
    setStartNode(event.target.value);
  };

  const handleEndNodeChange = (event) => {
    setEndNode(event.target.value);
  };

  const findPath = () => {
    console.log("Rutas: ", paths);
    const start = nodeNames.indexOf(startNode);
    const end = nodeNames.indexOf(endNode);
    setResultPath(getPath(start, end));
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '150px' }}>From/To</TableCell>
            {nodeNames.map((nodeName, index) => (
              <TableCell key={index} style={{ width: '150px' }}>{nodeName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {nodeNames.map((nodeName, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell style={{ width: '150px' }}>{nodeName}</TableCell>
              {nodeNames.map((_, colIndex) => (
                <TableCell key={colIndex} style={{ width: '150px' }}>
                  {distances[rowIndex][colIndex] === "Inf" ? (
                    "Inf"
                  ) : (
                    <TextField
                      value={distances[rowIndex][colIndex]}
                      onChange={(event) => {
                        const newValue = event.target.value;
                        handleDistanceChange(rowIndex, colIndex, isNaN(newValue) ? "Inf" : parseInt(newValue));
                      }}
                      type="number"
                      style={{ width: '120px' }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="primary"
        onClick={runNextIteration}
        disabled={iterationsCompleted} // Deshabilitar el botón cuando se completen las iteraciones
      >
        Run Next Iteration
      </Button>
      <Typography variant="h6">Find Path:</Typography>
      <Box display="flex" alignItems="center">
        <TextField label="Start Node" value={startNode} onChange={handleStartNodeChange} />
        <TextField label="End Node" value={endNode} onChange={handleEndNodeChange} />
        <Button variant="contained" color="primary" onClick={findPath} disabled={!iterationsCompleted}>
          Find Path
        </Button>
      </Box>
      {resultPath.length > 0 && (
        <Typography>
          Path from {startNode} to {endNode}: {resultPath.join(' -> ')}
        </Typography>
      )}
    </div>
  );
};

export default FloydsAlgorithm;