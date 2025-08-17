// src/components/ImportCSV.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';

const ImportCSV = ({ onImport }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        onImport(result.data);
      },
      error: (error) => {
        console.error('Errore lettura CSV:', error);
      }
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImport}>Importa CSV</button>
    </div>
  );
};

export default ImportCSV;