import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ClientEditForm from './ClientEditForm';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchClients() {
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch clients from Firestore
        const clientsCollection = collection(db, 'clients');
        const querySnapshot = await getDocs(clientsCollection);

        // Convert querySnapshot to an array of client objects
        const clientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients: ', error);
      }
    }

    fetchClients();
  }, [user]);

  const handleEdit = (clientId) => {
    setEditingClientId(clientId);
  };

  const handleCancelEdit = () => {
    setEditingClientId(null);
  };

  const handleSaveEdit = async (clientId, updatedClient) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update the client in Firestore
      const clientDocRef = doc(db, 'clients', clientId);
      await setDoc(clientDocRef, updatedClient, { merge: true });

      // Update the clients state to reflect the changes
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId ? updatedClient : client
        )
      );

      setEditingClientId(null);
    } catch (error) {
      console.error('Error updating client: ', error);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete the client from Firestore
      await deleteDoc(doc(db, 'clients', clientId));

      // Update the clients state to remove the deleted client
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
    } catch (error) {
      console.error('Error deleting client: ', error);
    }
  };

  return (
    <div>
      <h2>Client List</h2>
      <ul className="list-group">
        {clients.map((client) => (
          <li
            key={client.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingClientId === client.id ? (
              <ClientEditForm
                client={client}
                onSave={(updatedClient) =>
                  handleSaveEdit(client.id, updatedClient)
                }
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {client.name}
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(client.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(client.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientList;
