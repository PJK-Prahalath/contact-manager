import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './ContactDetails.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase";

const ContactDetails = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch contacts from Firestore
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
        setFilteredContacts(contactList); // Initially, all contacts are shown
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  // Filter contacts based on category and search query
  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const matchesCategory = category === 'All' || contact.category === category;
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase())||
        (contact.bloodGroup && contact.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())); 
      return matchesCategory && matchesSearch;
    });

    setFilteredContacts(filtered); // Update filtered contacts
  }, [contacts, category, searchQuery]);

  // Update search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update category
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) {
    return <p className="load">Loading contact details...</p>;
  }

  return (
    <div>
      
      <div className='title-div'>

      {/* Search and Category Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name, email, phone, bloodGroup..."
          value={searchQuery}
          onChange={handleSearchChange} // Update search query
          className="search-input"
        />

        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="All">All</option>
          <option value="Friends">Friends</option>
          <option value="Office">Office</option>
          <option value="Family">Family</option>
        </select>
      </div>
      </div>
      <div className='contact-list'>
      {/* Conditionally render contacts or "no contacts" message */}
      {filteredContacts.length === 0 ? (
        <p style={{color:'white'}}>No contacts found.</p>
      ) : (
        <div className="contact-grid">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-details">
                <p><span>Name:</span> {contact.name}</p>
                <p><span>Phone:</span> {contact.phone}</p>
                <p><span>Email:</span> {contact.email}</p>
                <p id='blood'>{contact.bloodGroup}</p>
              </div>
              {contact.imageUrl && (
                <img src={contact.imageUrl} alt={`${contact.name}'s profile`} className="profile-image" />
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ContactDetails;
