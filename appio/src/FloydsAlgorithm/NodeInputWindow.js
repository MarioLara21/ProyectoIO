import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const NODE_COUNT_KEY = 'nodeCount';

const NodeInputWindow = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState(() => {
    const storedNodes = localStorage.getItem(NODE_COUNT_KEY);
    return storedNodes ? parseInt(storedNodes) : 0;
  });
  const [nodeNames, setNodeNames] = useState(Array.from({ length: nodes }, (_, index) => `Node ${index + 1}`));

  const handleNodeChange = (event) => {
    const newNodes = parseInt(event.target.value);
    if (newNodes >= 1 && newNodes <= 10) {
      setNodes(newNodes);
      setNodeNames(Array.from({ length: newNodes }, (_, index) => nodeNames[index] || `Node ${index + 1}`));
    }
  };

  const handleNodeNameChange = (index, name) => {
    const updatedNodeNames = [...nodeNames];
    updatedNodeNames[index] = name;
    setNodeNames(updatedNodeNames);
  };

  const handleSubmit = () => {
    localStorage.setItem(NODE_COUNT_KEY, nodes.toString());
    localStorage.setItem('nodeNames', JSON.stringify(nodeNames));
    // You may want to store node names in localStorage here if needed.
    navigate('/floyds-algorithm');
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h4">Floyd's Algorithm</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mb={15}>
        <TextField
          label="Number of Nodes"
          value={nodes}
          onChange={handleNodeChange}
          type="number"
          InputProps={{ inputProps: { min: 1, max: 10 } }}
        />
        {nodeNames.map((nodeName, index) => (
          <TextField
            key={index}
            label={`Node ${index + 1}`}
            value={nodeName}
            onChange={(e) => handleNodeNameChange(index, e.target.value)}
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Footer />
    </div>
  );
};

export default NodeInputWindow;
