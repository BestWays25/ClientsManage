import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { doc } from 'firebase/firestore';
import EditQuoteForm from './DevisEditForm'; 

function QuoteList() {
    const [quotes, setQuotes] = useState([]);
    const [editQuoteId, setEditQuoteId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchQuotes() {
            try {
                if (!user) {
                    throw new Error('User not authenticated');
                }

                const quotesCollection = collection(db, 'quotes');
                const quotesSnapshot = await getDocs(quotesCollection);
                const quotesData = quotesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuotes(quotesData);
            } catch (error) {
                console.error('Error fetching quotes: ', error);
            }
        }

        fetchQuotes();
    }, [user]);

    const handleDelete = async (quoteId) => {
        try {
            if (!user) {
                throw new Error('User not authenticated');
            }

            await deleteDoc(doc(db, 'quotes', quoteId));
            setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== quoteId));
        } catch (error) {
            console.error('Error deleting quote: ', error);
        }
    };

    const handleEdit = (quoteId) => {
        // Set the editQuoteId state to trigger the display of the edit form
        setEditQuoteId(quoteId);
    };

    const handleEditClose = () => {
        // Close the edit form by resetting the editQuoteId state
        setEditQuoteId(null);
    };

    return (
        <div>
            <h2>Quote List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Subtotal</th>
                        <th>VAT (20%)</th>
                        <th>Total TTC</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {quotes.map((quote) => (
                        <tr key={quote.id}>
                            <td>{quote.clientName}</td>
                            <td>{quote.subTotal}</td>
                            <td>{quote.vat}</td>
                            <td>{quote.totalTTC}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(quote.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEdit(quote.id)} // Call handleEdit with the quote ID
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editQuoteId && (
                <EditQuoteForm
                    quoteId={editQuoteId}
                    onClose={handleEditClose} // Pass the close callback function
                />
            )}
        </div>
    );
}

export default QuoteList;
