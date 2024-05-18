import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const NODE_COUNT_KEY = 'nodeCount';

const NodeInputWindow = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState(() => {
    const storedNodes = localStorage.getItem(NODE_COUNT_KEY);
    return storedNodes ? parseInt(storedNodes) : 5;
  });
  const [nodeNames, setNodeNames] = useState(Array.from({ length: nodes }, (_, index) => `Node ${index + 1}`));

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const lines = reader.result.split('\n');
      const data = lines.map(line => line.split(',').map(value => parseInt(value, 10)));
      const n = data.length; // Obtener la cantidad de nodos del tamaño del archivo
      setNodes(n);
      setNodeNames(Array.from({ length: n }, (_, index) => `Node ${index + 1}`));
      localStorage.setItem('nodeNames', JSON.stringify(nodeNames));
      localStorage.setItem('fileData', JSON.stringify(data));
      localStorage.setItem(NODE_COUNT_KEY, n.toString());
      navigate('/floyds-algorithm'); // Navegar a la siguiente pestaña
    };

    reader.readAsText(file);
  };

  const handleNodeChange = (event) => {
    const newNodes = parseInt(event.target.value);
    if (newNodes >= 1) {
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
    navigate('/floyds-algorithm');
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", margin: "30px 30px" }}>
        <Typography variant="h4">Floyd's Algorithm</Typography>
      </div>
      <Box display="flex" flexDirection="column" alignItems="center" mb={15}>
        <TextField
          label="Number of Nodes"
          value={nodes}
          onChange={handleNodeChange}
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ width: '130px' }}
        />
        {nodeNames.map((nodeName, index) => (
          <TextField
            key={index}
            label={`Node ${index + 1}`}
            value={nodeName}
            onChange={(e) => handleNodeNameChange(index, e.target.value)}
            style={{ margin: "5px 5px" }}
          />
        ))}
        <Button variant="contained" color="primary" style={{ margin: "10px 10px" }} onClick={handleSubmit}>
          Submit
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

export default NodeInputWindow;
