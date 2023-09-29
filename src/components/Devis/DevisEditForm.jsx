import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Select from 'react-select';
import { collection, getDocs } from 'firebase/firestore';

function EditQuoteForm({ quoteId, onClose }) {
    const [quote, setQuote] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [quoteItems, setQuoteItems] = useState([]);
    const [note, setNote] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchQuote() {
            try {
                if (!user || !quoteId) {
                    throw new Error('User not authenticated or no quote ID');
                }

                // Fetch the quote document from Firestore
                const quoteDoc = doc(db, 'quotes', quoteId);
                const quoteSnapshot = await getDoc(quoteDoc);
                if (quoteSnapshot.exists()) {
                    const quoteData = quoteSnapshot.data();
                    setQuote(quoteData);
                    setNote(quoteData.note);
                    setSubTotal(quoteData.subTotal);
                    setVat(quoteData.vat);
                    setSelectedClient({
                        label: quoteData.clientName,
                        value: quoteData.clientId,
                    });
                    setQuoteItems(quoteData.quoteItems);
                } else {
                    console.error('Quote not found');
                }
            } catch (error) {
                console.error('Error fetching quote: ', error);
            }
        }

        async function fetchClientsAndProducts() {
            try {
                if (!user) {
                    throw new Error('User not authenticated');
                }

                // Fetch clients from Firestore
                const clientsCollection = collection(db, 'clients');
                const clientsSnapshot = await getDocs(clientsCollection);
                const clientsData = clientsSnapshot.docs.map((doc) => ({
                    label: doc.data().name,
                    value: doc.id,
                }));
                setClients(clientsData);

                // Fetch products from Firestore
                const productsCollection = collection(db, 'products');
                const productsSnapshot = await getDocs(productsCollection);
                const productsData = productsSnapshot.docs.map((doc) => ({
                    label: doc.data().name,
                    value: doc.id,
                    price: doc.data().price,
                }));
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching clients and products: ', error);
            }
        }

        fetchQuote();
        fetchClientsAndProducts();
    }, [user, quoteId]);

    const handleClientSelect = (selectedOption) => {
        setSelectedClient(selectedOption);
    };

    const handleProductSelect = (selectedOption, index) => {
        const updatedQuoteItems = [...quoteItems];
        updatedQuoteItems[index].product = selectedOption;
        setQuoteItems(updatedQuoteItems);
    };

    const handleQuantityChange = (e, index) => {
        const updatedQuoteItems = [...quoteItems];
        updatedQuoteItems[index].quantity = parseInt(e.target.value, 10) || 1;
        setQuoteItems(updatedQuoteItems);
    };

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!user || !quote) {
                throw new Error('User not authenticated or no quote data');
            }

            // Update the quote document in Firestore
            const quoteDoc = doc(db, 'quotes', quoteId);
            await updateDoc(quoteDoc, {
                clientId: selectedClient.value,
                clientName: selectedClient.label,
                quoteItems,
                note,
                subTotal,
                vat,
                totalTTC: subTotal + vat,
            });

            onClose();
        } catch (error) {
            console.error('Error updating quote: ', error);
        }
    };

    return (
        <div>
            <h2>Edit Quote</h2>
            {quote && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="clientSelect" className="form-label">
                            Select Client
                        </label>
                        <Select
                            id="clientSelect"
                            options={clients}
                            value={selectedClient}
                            onChange={handleClientSelect}
                            placeholder="Select a client..."
                        />
                    </div>
                    {quoteItems.map((quoteItem, index) => (
                        <div key={index}>
                            <div className="mb-3">
                                <label htmlFor={`productSelect${index}`} className="form-label">
                                    Select Product
                                </label>
                                <Select
                                    id={`productSelect${index}`}
                                    options={products}
                                    value={quoteItem.product}
                                    onChange={(selectedOption) => handleProductSelect(selectedOption, index)}
                                    placeholder="Select a product..."
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor={`quantity${index}`} className="form-label">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id={`quantity${index}`}
                                    value={quoteItem.quantity}
                                    onChange={(e) => handleQuantityChange(e, index)}
                                    placeholder="Enter quantity"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="mb-3">
                        <label htmlFor="note" className="form-label">
                            Note
                        </label>
                        <textarea
                            className="form-control"
                            id="note"
                            rows="4"
                            value={note}
                            onChange={handleNoteChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="subTotal" className="form-label">
                            Subtotal
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="subTotal"
                            value={subTotal}
                            onChange={(e) => setSubTotal(parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="vat" className="form-label">
                            VAT (20%)
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="vat"
                            value={vat}
                            onChange={(e) => setVat(parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="mb-3">
                        <h4>Total TTC: {subTotal + vat}</h4>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    );
}

export default EditQuoteForm;
