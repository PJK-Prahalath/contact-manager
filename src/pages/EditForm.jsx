import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const contacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
  // Add more contacts
];

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const contact = contacts.find(contact => contact.id === parseInt(id));
  const [formData, setFormData] = useState(contact);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Update contact logic
    console.log("Updated contact: ", formData);
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Contact: {contact.name}</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
        />
        <label>Email:</label>
        <input 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
        />
        <label>Phone:</label>
        <input 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
};

export default EditForm;
