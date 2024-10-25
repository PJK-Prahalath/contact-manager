import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { useAuth } from "./Contexts/AuthContext";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddContact.css';

function AddContact() {
  const [contact, setContact] = useState({ name: "", phone: "", email: "", image: null });
  const [useWebcam, setUseWebcam] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const storage = getStorage();
  const webcamRef = useRef(null);

  const captureImage = useCallback(() => {
    setIsCapturing(true); // Start loading animation for capture
    const imageSrc = webcamRef.current.getScreenshot();
    setContact({ ...contact, image: dataURLtoFile(imageSrc, `webcam-photo-${uuidv4()}.jpg`) });
    toast.success('Photo captured successfully!', {
      position: "bottom-right",
      autoClose: 3000,
    });
    setIsCapturing(false); // Stop loading animation after capture
  }, [contact]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setContact({ ...contact, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true); // Start loading animation for add process

    if (!user) {
      console.error("User is not authenticated!");
      setIsAdding(false);
      return;
    }

    try {
      let imageDownloadUrl = "";
      if (contact.image) {
        const storageRef = ref(storage, `contact-images/${contact.image.name}-${Date.now()}`);
        await uploadBytes(storageRef, contact.image);
        imageDownloadUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "contact-management"), {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        imageUrl: imageDownloadUrl,
        uid: user
      });

      toast.success('Contact added successfully!', {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      setIsAdding(false); // Stop loading animation after contact added
      navigate("/list");
    } catch (error) {
      console.error("Error adding contact: ", error);
      setIsAdding(false);
    }
  };

  return (
    <div className="add-contact-container">
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />

        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="imageSource"
              value="file"
              checked={!useWebcam}
              onChange={() => setUseWebcam(false)}
            />
            Upload Image
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="imageSource"
              value="webcam"
              checked={useWebcam}
              onChange={() => setUseWebcam(true)}
            />
            Use Webcam
          </label>
        </div>

        {!useWebcam ? (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        ) : (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
            <button type="button" onClick={captureImage} disabled={isCapturing}>
              {isCapturing ? 'Capturing...' : 'Capture Image'}
            </button>
          </div>
        )}

        <button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>

      <ToastContainer /> {/* Position notification container */}
    </div>
  );
}

export default AddContact;
