import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const validate = () => {
    let newErrors = {};

    if (!form.name) 
      newErrors.name = "Name required";
    if (!form.email) 
      newErrors.email = "Enter valid email id";
    if (!form.password)
      newErrors.password = "Password is must";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="name" placeholder="Name" onChange={handleChange} />
          {errors.name && <span style={{color:"red"}}>{errors.name}</span>}
        </div>
        
        <div>
          <input name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <span style={{color:"red"}}>{errors.email}</span>}
        </div>

        <div>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          {errors.password && <span style={{color:"red"}}>{errors.password}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}