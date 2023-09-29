import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

function AddClientForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a new client document in Firestore
      const clientRef = await addDoc(collection(db, 'clients'), {
        name,
        email,
        phone,
        address,
        createdBy: user.uid,
      });

      console.log('Client added with ID: ', clientRef.id);

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setError(null);
    } catch (error) {
      console.error('Error adding client: ', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Add Client</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="clientName" className="form-label">
            Client Name
          </label>
          <input
            type="text"
            className="form-control"
            id="clientName"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientEmail" className="form-label">
            Client Email (if available)
          </label>
          <input
            type="email"
            className="form-control"
            id="clientEmail"
            placeholder="Client Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientPhone" className="form-label">
            Client Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="clientPhone"
            placeholder="Client Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="clientAddress" className="form-label">
            Client Address
          </label>
          <textarea
            className="form-control"
            id="clientAddress"
            placeholder="Client Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Client
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default AddClientForm;
