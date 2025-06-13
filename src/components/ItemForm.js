import React, { useState } from 'react';
import axios from 'axios';

const ItemForm = ({ onItemAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) return alert('Please fill all fields');

    try {
      const res = await axios.post('https://billventory-server.onrender.com/api/items', {
        name,
        price: Number(price),
        quantity: Number(quantity),
      });

      onItemAdded(res.data); // notify parent
      setName('');
      setPrice('');
      setQuantity('');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Item Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-2 flex space-x-2">
        <input
          type="number"
          placeholder="Price"
          className="w-1/2 p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-1/2 p-2 border rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
