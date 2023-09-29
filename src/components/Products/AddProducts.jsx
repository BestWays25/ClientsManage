import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Added success state
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const productRef = await addDoc(collection(db, 'products'), {
        name,
        description,
        price: parseFloat(price),
        createdBy: user.uid,
      });

      console.log('Product added with ID: ', productRef.id);

      // Reset form fields and show success message
      setName('');
      setDescription('');
      setPrice('');
      setError(null);
      setSuccess(true); // Set success to true

      // Clear the success message after a few seconds (optional)
      setTimeout(() => {
        setSuccess(false);
      }, 5000); // Clear success message after 5 seconds (adjust as needed)
    } catch (error) {
      console.error('Error adding product: ', error);
      setError(error.message);
      setSuccess(false); // Set success to false on error
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">
            Product Description
          </label>
          <textarea
            className="form-control"
            id="productDescription"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productPrice" className="form-label">
            Product Price
          </label>
          <input
            type="number"
            className="form-control"
            id="productPrice"
            placeholder="Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Product
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
        {success && (
          <p className="text-success mt-2">Product added successfully!</p>
        )}
      </form>
    </div>
  );
}

export default AddProductForm;
