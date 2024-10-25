import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './ContactDetails.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase";

const ContactDetails = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, "contact-management"), where("uid", "==", user));
        const querySnapshot = await getDocs(q);
        
        const contactList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setContacts(contactList);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  if (loading) {
    return <p className="load">Loading contact details...</p>;
  }

  if (contacts.length === 0) {
    return <p className="load">No contacts found for this user.</p>;
  }

  return (
    <div className="contact-list">
      <h3>Contact List</h3>
      <div className="contact-grid">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-details">
              <p><span>Name:</span> {contact.name}</p>
              <p><span>Phone:</span> {contact.phone}</p>
              <p><span>Email:</span> {contact.email}</p>
            </div>
            {contact.imageUrl && (
              <img src={contact.imageUrl} alt={`${contact.name}'s profile`} className="profile-image" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDetails;
