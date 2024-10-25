import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const contacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
  // Add more contacts
];

const DeleteContact = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const navigate = useNavigate();

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleDeleteClick = () => {
    if (selectedContact) {
      // Perform delete action here
      console.log(`Deleted contact: ${selectedContact.name}`);
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Select Contact to Delete</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <button onClick={() => handleSelectContact(contact)}>
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedContact && (
        <button onClick={handleDeleteClick}>Delete Contact</button>
      )}
    </div>
  );
};

export default DeleteContact;
