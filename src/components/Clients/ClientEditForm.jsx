import React, { useState } from 'react';

function ClientEditForm({ client, onSave, onCancel }) {
  const [editedClient, setEditedClient] = useState(client);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient({
      ...editedClient,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedClient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="editedClientName" className="form-label">
          Client Name
        </label>
        <input
          type="text"
          className="form-control"
          id="editedClientName"
          name="name"
          value={editedClient.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="editedClientEmail" className="form-label">
          Client Email (if available)
        </label>
        <input
          type="email"
          className="form-control"
          id="editedClientEmail"
          name="email"
          value={editedClient.email || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="editedClientPhone" className="form-label">
          Client Phone Number
        </label>
        <input
          type="tel"
          className="form-control"
          id="editedClientPhone"
          name="phone"
          value={editedClient.phone || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="editedClientAddress" className="form-label">
          Client Address
        </label>
        <textarea
          className="form-control"
          id="editedClientAddress"
          name="address"
          value={editedClient.address || ''}
          onChange={handleInputChange}
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

export default ClientEditForm;
