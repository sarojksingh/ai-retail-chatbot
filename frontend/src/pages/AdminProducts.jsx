import { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "../components/ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Admin Product Management</h2>

      <ProductForm
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        refresh={fetchProducts}
      />

      <hr />

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ₹{p.price}
            <button onClick={() => setEditingProduct(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}