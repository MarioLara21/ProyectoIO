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

  useEffect(() => {
    const storedNodes = localStorage.getItem(NODE_COUNT_KEY);
    if (storedNodes) {
      const n = parseInt(storedNodes);
      setNodes(n);
      setDistances(Array(n).fill(0).map(() => Array(n).fill(-1)));
      setPaths(Array(n).fill(0).map(() => Array(n).fill(0)));
      const storedNodeNames = localStorage.getItem('nodeNames');
      if (storedNodeNames) {
        const names = JSON.parse(storedNodeNames);
        setNodeNames(names);
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
      row.map(value => (value === -1 ? MAX_VALUE : value))
    );

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        console.log("CurrentIteration: ", currentIteration);
        if (i !== currentIteration && j !== currentIteration) {
          if (mirrorDist[i][j] > mirrorDist[i][currentIteration] + mirrorDist[currentIteration][j]) {
            console.log("i: ", i, " j: ", j, " mirrorDist[i][j]: ", mirrorDist[i][j], " mirrorDist[i][k]: ", mirrorDist[i][currentIteration], "mirrorDist[k][j]: ", mirrorDist[currentIteration][j], "Suma: ", mirrorDist[i][currentIteration] + mirrorDist[currentIteration][j])
            mirrorDist[i][j] = mirrorDist[i][currentIteration] + mirrorDist[currentIteration][j];
            path[i][j] = currentIteration;
          }
        }
      }
    }

    const restoredDist = mirrorDist.map(row =>
      row.map(value => (value === MAX_VALUE ? -1 : value))
    );

    setDistances(restoredDist);
    setPaths(path);
    setCurrentIteration(currentIteration + 1);
    console.log("CurrentIteration: ", currentIteration);
    console.log("Nodes: ", nodes - 1);
    if (currentIteration === nodes - 1) {
      setShowPaths(true);
    }
  };


  const getPath = (start, end) => {
    if (!paths[start] || !paths[start][end]) {
      return [];
    }
  
    const path = [];
    let current = start;
    path.push(nodeNames[current]);
  
    while (current !== end) {
      const next = paths[current][end];
      if (next === null || next === undefined || next < 0 || next >= nodes) {
        return []; // Verificar si el próximo nodo es válido
      }
      path.push(nodeNames[next-1]);
      current = next;
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
    const start = nodeNames.indexOf(startNode);
    const end = nodeNames.indexOf(endNode);
    setResultPath(getPath(start, end));
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>From/To</TableCell>
            {nodeNames.map((nodeName, index) => (
              <TableCell key={index}>{nodeName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {nodeNames.map((nodeName, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{nodeName}</TableCell>
              {nodeNames.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <TextField
                    value={distances[rowIndex][colIndex] === -1 ? -1 : distances[rowIndex][colIndex]}
                    onChange={(event) => {
                      const newValue = parseInt(event.target.value);
                      handleDistanceChange(rowIndex, colIndex, isNaN(newValue) ? -1 : newValue);
                    }}
                    type="number"
                    InputProps={{ inputProps: { min: -1 } }}
                  />
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
        style={{ display: currentIteration < nodes ? 'block' : 'none' }}
      >
        Run Next Iteration
      </Button>
      {showPaths && (
        <div>
          <Typography variant="h6">Shortest Path:</Typography>
          <Typography>
            From {nodeNames[0]} to {nodeNames[nodes - 1]}: {getPath(0, nodes - 1).join(' -> ')}
          </Typography>
        </div>
      )}
      <Typography variant="h6">Find Path:</Typography>
      <Box display="flex" alignItems="center">
        <TextField label="Start Node" value={startNode} onChange={handleStartNodeChange} />
        <TextField label="End Node" value={endNode} onChange={handleEndNodeChange} />
        <Button variant="contained" color="primary" onClick={findPath}>
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