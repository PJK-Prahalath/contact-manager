import React, { useEffect, useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import './EditContact.css';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, storage } from "../firebase"; // Ensure firebase storage is imported
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import Modal from 'react-modal';

const EditContact = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: '', phone: '', email: '' });
  const [imageFile, setImageFile] = useState(null); // New state for image file

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

  const openModal = (contact) => {
    setSelectedContact(contact);
    setUpdatedData({ name: contact.name, phone: contact.phone, email: contact.email });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageFile(null); // Clear image file on close
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
      let newImageUrl = selectedContact.imageUrl;
      if (imageFile) {
        newImageUrl = await uploadImage();
      }

      const contactRef = doc(db, "contact-management", selectedContact.id);
      await updateDoc(contactRef, {
        ...updatedData,
        imageUrl: newImageUrl
      });

      setContacts(contacts.map(contact =>
        contact.id === selectedContact.id ? { ...contact, ...updatedData, imageUrl: newImageUrl } : contact
      ));

      closeModal();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  if (loading) {
    return <p className='load'>Loading contacts...</p>;
  }

  return (
    <div className="edit-contact-page">
      <h1 className='load'>Edit Contact</h1>
      <div className="contact-grid">
        {contacts.map(contact => (
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

      {/* Modal for editing contact */}
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
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} />

          <div className="modal-buttons">
            <button className="save-btn" onClick={handleUpdate}>Save</button>
            <button className="close-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditContact;
