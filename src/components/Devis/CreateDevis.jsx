import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Select from 'react-select';

function CreateQuoteForm() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [quoteItems, setQuoteItems] = useState([]);
    const [note, setNote] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
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

        fetchClientsAndProducts();
    }, [user]);

    const handleClientSelect = (selectedOption) => {
        setSelectedClient(selectedOption);
    };

    const handleProductSelect = (selectedOption) => {
        setSelectedProduct(selectedOption);
    };

    const handleAddItem = () => {
        if (selectedProduct) {
            const product = selectedProduct;
            const unitPrice = product.price;
            const total = quantity * unitPrice;
            const newItem = {
                product,
                unit,
                quantity,
                unitPrice,
                total,
            };

            setQuoteItems([...quoteItems, newItem]);

            // Reset input fields
            setSelectedProduct(null);
            setUnit('');
            setQuantity(1);
        }
    };

    useEffect(() => {
        // Calculate subtotal
        const subtotal = quoteItems.reduce((acc, item) => acc + item.total, 0);
        setSubTotal(subtotal);

        // Calculate VAT (assuming 20% VAT)
        const vatAmount = (subtotal * 20) / 100;
        setVat(vatAmount);
    }, [quoteItems]);

    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = quoteItems.filter((_, i) => i !== index);
        setQuoteItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!user || !selectedClient || quoteItems.length === 0) {
                throw new Error('Invalid form data');
            }

            // Create a new quote document in Firestore
            const quoteRef = await addDoc(collection(db, 'quotes'), {
                clientId: selectedClient.value,
                clientName: selectedClient.label,
                quoteItems: quoteItems.map((item) => ({
                    productId: item.product.value,
                    productName: item.product.label,
                    unit: item.unit,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: item.total,
                })),
                note,
                subTotal,
                vat,
                totalTTC: subTotal + vat,
                createdBy: user.uid,
                createdAt: new Date(),
            });

            console.log('Quote added with ID: ', quoteRef.id);

            // Reset the form
            setSelectedClient(null);
            setQuoteItems([]);
            setNote('');
            setSubTotal(0);
            setVat(0);
        } catch (error) {
            console.error('Error creating quote: ', error);
        }
    };

    return (
        <div>
            <h2>Create Quote</h2>
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
                <div className="mb-3">
                    <label htmlFor="productSelect" className="form-label">
                        Select Product
                    </label>
                    <Select
                        id="productSelect"
                        options={products}
                        onChange={handleProductSelect}
                        placeholder="Select a product..."
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                        Unit
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="Enter unit"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                        Quantity
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="quantity"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(parseInt(e.target.value, 10) || 1)
                        }
                        placeholder="Enter quantity"
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddItem}
                >
                    Add Product
                </button>
                <div className="mb-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quoteItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product.label}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unitPrice}</td>
                                    <td>{item.total}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                    <h5>Subtotal: {subTotal}</h5>
                    <h5>VAT (20%): {vat}</h5>
                    <h4>Total TTC: {subTotal + vat}</h4>
                </div>
                <button type="submit" className="btn btn-primary">
                    Create Quote
                </button>
            </form>
        </div>
    );

}

export default CreateQuoteForm;
