import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoicePage = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("https://billventory-server.onrender.com/api/items")
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const toggleItem = (item) => {
    const exists = selectedItems.find(i => i._id === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, { ...item, selectedQty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, selectedQty: Math.max(1, item.selectedQty + delta) }
          : item
      )
    );
  };

  const total = selectedItems.reduce((acc, item) => acc + item.price * item.selectedQty, 0);

  const handlePrint = () => {
    window.print(); // basic print for now
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Invoice Generator</h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div
            key={item._id}
            className={`border p-3 rounded cursor-pointer ${
              selectedItems.some(i => i._id === item._id)
                ? 'bg-green-100 border-green-500'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => toggleItem(item)}
          >
            <p className="font-semibold">{item.name}</p>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Selected Items</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => (
                <tr key={item._id}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border flex items-center justify-center gap-2">
                    <button
                      className="px-2 bg-gray-200"
                      onClick={() => updateQty(item._id, -1)}
                      disabled={item.selectedQty <= 1}
                    >
                      –
                    </button>
                    {item.selectedQty}
                    <button
                      className="px-2 bg-gray-200"
                      onClick={() => updateQty(item._id, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2 border">₹{item.price * item.selectedQty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 text-lg font-semibold">
            Grand Total: ₹{total}
          </div>

          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
            onClick={handlePrint}
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
