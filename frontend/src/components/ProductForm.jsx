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
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    }
  }, [editingProduct]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    //setCategories(res.data.data.map((p) => p.category));
    setCategories(res.data);
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name required";
    if (!form.slug) newErrors.slug = "Slug required";
    if (!form.price || isNaN(form.price))
      newErrors.price = "Price must be number";
    if (!Number.isInteger(Number(form.stockQuantity)))
      newErrors.stockQuantity = "Stock must be integer";
    if (!form.categoryId)
      newErrors.categoryId = "Select category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
        {errors.name && <p style={{color:"red"}}>{errors.name}</p>}
        <br />

        <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
        {errors.slug && <p style={{color:"red"}}>{errors.slug}</p>}
        <br />

        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <br />

        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        {errors.price && <p style={{color:"red"}}>{errors.price}</p>}
        <br />

        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
        <br />

        <input type="number" name="stockQuantity" placeholder="Stock" value={form.stockQuantity} onChange={handleChange} />
        {errors.stockQuantity && <p style={{color:"red"}}>{errors.stockQuantity}</p>}
        <br />

        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p style={{color:"red"}}>{errors.categoryId}</p>}
        <br/>

        <button type="submit">
          {editingProduct ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}