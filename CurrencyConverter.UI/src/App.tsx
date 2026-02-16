import React from 'react';
import { ConversionForm } from './components/ConversionForm';
import { LatestRates } from './components/LatestRates';
import { HistoricalRates } from './components/HistoricalRates';

const App: React.FC = () => {
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Currency Converter Platform</h1>
      <ConversionForm />
      <hr />
      <LatestRates />
      <hr />
      <HistoricalRates />
    </div>
  );
};

export default App;
