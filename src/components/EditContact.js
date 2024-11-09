import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './EditContact.css';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditContact = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'All',
    bloodGroup: '',  // New blood group field
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const openModal = (contact) => {
    setSelectedContact(contact);
    setUpdatedData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      category: contact.category || 'All',
      bloodGroup: contact.bloodGroup || '',  // Set initial blood group value
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!imageFile || !selectedContact) return null;

    const imageRef = ref(storage, `contacts/${selectedContact.id}`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const handleUpdate = async () => {
    if (!selectedContact) return;

    try {
      setIsSaving(true);

      let newImageUrl = selectedContact.imageUrl;
      if (imageFile) {
        newImageUrl = await uploadImage();
      }

      const contactRef = doc(db, "contact-management", selectedContact.id);
      await updateDoc(contactRef, {
        ...updatedData,
        imageUrl: newImageUrl,
      });

      setContacts(contacts.map(contact =>
        contact.id === selectedContact.id ? { ...contact, ...updatedData, imageUrl: newImageUrl } : contact
      ));

      closeModal();
      toast.success("Contact updated successfully!");  // Show toast notification
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Error updating contact. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  if (loading) {
    return <p className="load">Loading contacts...</p>;
  }

  return (
    <div>
      <ToastContainer />  {/* Toast container for notifications */}
      
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

      <div className='contact-list'>
        {filteredContacts.length === 0 ? (
          <p style={{color:'white'}}>No contacts found.</p>
        ) : (
          <div className="contact-grid">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <div className="contact-details">
                  <p><span>Name:</span> {contact.name}</p>
                  <p><span>Phone:</span> {contact.phone}</p>
                  <p><span>Email:</span> {contact.email}</p>
                  <button className="edit-btn" onClick={() => openModal(contact)}>Edit</button>
                </div>
                {contact.imageUrl && (
                  <img src={contact.imageUrl} alt={contact.name} className="profile-image" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal">
        <h3>Edit Contact</h3>
        <div className="modal-content">
          <label>Name:</label>
          <input
            type="text"
            value={updatedData.name}
            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
          />
          <label>Phone:</label>
          <input
            type="text"
            value={updatedData.phone}
            onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="email"
            value={updatedData.email}
            onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
          />
          <label>Category:</label>
          <select
            value={updatedData.category}
            onChange={(e) => setUpdatedData({ ...updatedData, category: e.target.value })}
          >
            <option value="All">All</option>
            <option value="Friends">Friends</option>
            <option value="Office">Office</option>
            <option value="Family">Family</option>
          </select>
          <label>Blood Group:</label>
          <select
            value={updatedData.bloodGroup}
            onChange={(e) => setUpdatedData({ ...updatedData, bloodGroup: e.target.value })}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
                
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />

          <div className="modal-buttons">
            <button className="save-btn" onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button className="close-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditContact;
