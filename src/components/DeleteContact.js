import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './DeleteContact.css'; // Ensure this file contains the necessary CSS
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from "../firebase";

const DeleteContact = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return; // If there's no user, do nothing
      
      try {
        // Query to get contacts only for the logged-in user
        const q = query(collection(db, "contact-management"), where("uid", "==", user));
        const querySnapshot = await getDocs(q); // Execute the query
        
        const contactList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setContacts(contactList); // Set contacts in state
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchContacts(); // Fetch contacts when the component mounts
  }, [user]); // Refetch when the user changes

  // Handle contact deletion
  const handleDelete = async (id) => {
    try {
      const contactRef = doc(db, "contact-management", id);
      await deleteDoc(contactRef); // Delete the document

      // Update the UI by filtering out the deleted contact
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) {
    return <p className='load'>Loading contact details...</p>; // Show loading state while fetching
  }

  if (contacts.length === 0) {
    return <p>No contacts found for this user.</p>; // If no contacts are available
  }

  return (
    <div className="contact-list">
      <h3>Delete Contact</h3>
      <div className="contact-grid">
        {contacts.map((contact) => {
          console.log(contact.profileImage); // Debugging line to check the URL
          return (
            <div key={contact.id} className="contact-card">
              <div className="contact-details">
                <p><span>Name:</span> {contact.name}</p>
                <p><span>Phone:</span> {contact.phone}</p>
                <p><span>Email:</span> {contact.email}</p>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
                </div>
            {contact.imageUrl && (
              <img src={contact.imageUrl} alt={contact.name} className="profile-image" />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeleteContact;
