import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductForm({
  editingProduct,
  setEditingProduct,
  refresh,
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    sku: "",
    stockQuantity: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const fetchCategories = async () => {
    const res = await api.get("/products"); // temporary (replace later with category API)
    setCategories(res.data.data.map((p) => p.category));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      await api.put(`/products/${editingProduct.id}`, form);
    } else {
      await api.post("/products", form);
    }

    setEditingProduct(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      price: "",
      sku: "",
      stockQuantity: "",
      categoryId: "",
    });

    refresh();
  };

  return (
    <div>
      <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <br />
        <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
        <br />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <br />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <br />
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
        <br />
        <input name="stockQuantity" placeholder="Stock" value={form.stockQuantity} onChange={handleChange} />
        <br />
        <button type="submit">
          {editingProduct ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}