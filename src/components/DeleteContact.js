import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './DeleteContact.css';
import { collection, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteContact = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null); 
  const [tempDeletedContact, setTempDeletedContact] = useState(null); // Temp storage for undo

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
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredContacts(filtered);
  }, [contacts, category, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Prompt for deletion confirmation
  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    const contactToDelete = contacts.find(contact => contact.id === id);
    setTempDeletedContact(contactToDelete);
    setDeletingId(id);

    try {
      const contactRef = doc(db, "contact-management", id);
      await deleteDoc(contactRef);

      setContacts(contacts.filter((contact) => contact.id !== id));
      
      toast.success(
        <div>
          Contact deleted successfully!
          {/* <button onClick={undoDelete} className="undo-button">Undo</button> */}
        </div>,
        { autoClose: 5000 }
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Error deleting contact. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Undo delete by restoring the temporarily stored contact
  const undoDelete = async () => {
    if (tempDeletedContact) {
      try {
        const contactRef = doc(db, "contact-management", tempDeletedContact.id);
        await setDoc(contactRef, tempDeletedContact);
        
        setContacts([...contacts, tempDeletedContact]);
        setFilteredContacts([...filteredContacts, tempDeletedContact]);
        
        toast.success("Contact restored!");
        setTempDeletedContact(null);
      } catch (error) {
        console.error("Error restoring contact:", error);
        toast.error("Error restoring contact. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className='load'>Loading contact details...</p>;
  }

  return (
    <div>
      <ToastContainer />
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />

        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="All">All</option>
          <option value="Friends">Friends</option>
          <option value="Office">Office</option>
          <option value="Family">Family</option>
        </select>
      </div>

      <div className="contact-list">
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
                  <button
                    onClick={() => confirmDelete(contact.id)}
                    disabled={deletingId === contact.id}
                  >
                    {deletingId === contact.id ? "Deleting..." : "Delete"}
                  </button>
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

export default DeleteContact;
