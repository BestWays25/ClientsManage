import React, { useState } from 'react';

function ProductEditForm({ product, onSave, onCancel }) {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="editedProductName" className="form-label">
          Product Name
        </label>
        <input
          type="text"
          className="form-control"
          id="editedProductName"
          name="name"
          value={editedProduct.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="editedProductDescription" className="form-label">
          Product Description
        </label>
        <textarea
          className="form-control"
          id="editedProductDescription"
          name="description"
          value={editedProduct.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="editedProductPrice" className="form-label">
          Product Price
        </label>
        <input
          type="number"
          className="form-control"
          id="editedProductPrice"
          name="price"
          value={editedProduct.price}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-success me-2">
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProductEditForm;
