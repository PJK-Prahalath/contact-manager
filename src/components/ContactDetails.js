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
  const [selectedImage, setSelectedImage] = useState(null);

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
        setFilteredContacts(contactList);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user]);

  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const matchesCategory = category === 'All' || contact.category === category;
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.bloodGroup && contact.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    setFilteredContacts(filtered);
  }, [contacts, category, searchQuery]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeOverlay = () => setSelectedImage(null);

  if (loading) {
    return <p className="load">Loading contact details...</p>;
  }

  return (
    <div>
      <div className="title-div">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name, email, phone, bloodGroup..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
  />          <select value={category} onChange={handleCategoryChange} className="category-select">
            <option value="All">All</option>
            <option value="Friends">Friends</option>
            <option value="Office">Office</option>
            <option value="Family">Family</option>
          </select>
        </div>
      </div>
      <div className="contact-list">
        {filteredContacts.length === 0 ? (
          <p style={{ color: 'white' }}>No contacts found.</p>
        ) : (
          <div className="contact-grid">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-details">
                  <p><span>Name:</span> {contact.name}</p>
                  <p><span>Phone:</span> {contact.phone}</p>
                  <p><span>Email:</span> {contact.email}</p>
                  <p id="blood">{contact.bloodGroup || 'N/A'}</p>
                </div>
                {contact.imageUrl && (
                  <img
                    src={contact.imageUrl}
                    alt={`${contact.name}'s profile`}
                    className="profile-image"
                    onClick={() => handleImageClick(contact.imageUrl)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="image-overlay active" onClick={closeOverlay}>
          <img src={selectedImage} alt="Full-screen profile" />
        </div>
      )}
    </div>
  );
};

export default ContactDetails;