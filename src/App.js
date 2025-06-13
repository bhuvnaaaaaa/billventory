import React, { useState } from 'react';
import ItemTable from './components/ItemTable';
import ItemForm from './components/ItemForm';
import InvoicePage from './pages/InvoicePage';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false); // toggle page

  const handleItemAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Billventory</h1>

      <div className="flex justify-end mb-4">
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded"
          onClick={() => setShowInvoice(!showInvoice)}
        >
          {showInvoice ? 'Back to Inventory' : 'Generate Invoice'}
        </button>
      </div>

      {showInvoice ? (
        <InvoicePage />
      ) : (
        <>
          <ItemForm onItemAdded={handleItemAdded} />
          <ItemTable refresh={refresh} />
        </>
      )}
    </div>
  );
}

export default App;
