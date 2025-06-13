import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemTable = ({ refresh }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await await axios.get("https://billventory-server.onrender.com/api/items");

        setItems(res.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [refresh]);

  const updateQuantity = async (id, newQty) => {
    const itemToUpdate = items.find((item) => item._id === id);
    if (!itemToUpdate) return;

    try {
      const res = await axios.put(`https://billventory-server.onrender.com/api/items/${id}`, {
        name: itemToUpdate.name,
        price: itemToUpdate.price,
        quantity: newQty,
      });

      const updated = res.data;
      setItems((prevItems) =>
        prevItems.map((item) => (item._id === id ? updated : item))
      );
    } catch (error) {
      console.error('Quantity update failed:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://billventory-server.onrender.com/api/items/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grandTotal = filteredItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Inventory Items</h2>

      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {loading ? (
        <p>Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Price (₹)</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.price}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.price * item.quantity}</td>
                  <td className="border p-2">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-gray-200 px-2 rounded text-xl"
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 0}
                      >
                        –
                      </button>

                      <button
                        className="bg-gray-200 px-2 rounded text-xl"
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>

                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 text-lg font-semibold">
            Grand Total: ₹{grandTotal}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemTable;
