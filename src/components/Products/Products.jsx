import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ProductEditForm from './EditProducts';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch products from Firestore
        const productsCollection = collection(db, 'products');
        const querySnapshot = await getDocs(productsCollection);

        // Convert querySnapshot to an array of product objects
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    }

    fetchProducts();
  }, [user]);

  const handleEdit = (productId) => {
    setEditingProductId(productId);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  const handleSaveEdit = async (productId, updatedProduct) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update the product in Firestore
      const productDocRef = doc(db, 'products', productId);
      await setDoc(productDocRef, updatedProduct, { merge: true });

      // Update the products state to reflect the changes
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );

      setEditingProductId(null);
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete the product from Firestore
      await deleteDoc(doc(db, 'products', productId));

      // Update the products state to remove the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul className="list-group">
        {products.map((product) => (
          <li
            key={product.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingProductId === product.id ? (
              <ProductEditForm
                product={product}
                onSave={(updatedProduct) =>
                  handleSaveEdit(product.id, updatedProduct)
                }
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {product.name}
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.id)}
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

export default ProductList;
