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
  const [category, setCategory] = useState(""); 
  const [bloodGroup, setBloodGroup] = useState("");  // New state for blood group
  const [useWebcam, setUseWebcam] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const storage = getStorage();
  const webcamRef = useRef(null);

  const captureImage = useCallback(() => {
    setIsCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setContact({ ...contact, image: dataURLtoFile(imageSrc, `webcam-photo-${uuidv4()}.jpg`) });
    toast.success('Photo captured successfully!', {
      position: 'bottom-right',
      autoClose: 1000,
      style:{
        top:'300px',
      },
    });
    setIsCapturing(false);
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

  const validateFields = () => {
    const newErrors = {};
    if (!contact.name.trim()) newErrors.name = "Name is required.";
    if (!contact.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!contact.email.trim()) newErrors.email = "Email is required.";
    if (!category) newErrors.category = "Please select a category.";
    if (!contact.image) newErrors.image = "Please provide an image.";
    if (!bloodGroup) newErrors.bloodGroup = "Please select a blood group.";  // Add blood group validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return; // Validate fields before submission

    setIsAdding(true);

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
        category: category,
        bloodGroup: bloodGroup,  // Include blood group
        uid: user
      });

      toast.success('Contact added successfully!', {
        position: "bottom-right",
        autoClose: 3000,
      });

      setIsAdding(false);
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
          id='in'
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="text"
          placeholder="Phone"
          id='in'
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input
          type="email"
          placeholder="Email"
          id='in'
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <select
          className="category-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" id="category-dropdown">Select Category</option>
          <option value="Friends" id="category-dropdown">Friends</option>
          <option value="Office" id="category-dropdown">Office</option>
          <option value="Family" id="category-dropdown">Family</option>
        </select>
        {errors.category && <p className="error">{errors.category}</p>}

        {/* Add blood group dropdown */}
        <select
          className="category-dropdown"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)} // Update blood group state
        >
          <option value="" id="category-dropdown">Select Blood Group</option>
          <option value="A+" id="category-dropdown">A+</option>
          <option value="A-" id="category-dropdown">A-</option>
          <option value="B+" id="category-dropdown">B+</option>
          <option value="B-" id="category-dropdown">B-</option>
          <option value="O+" id="category-dropdown">O+</option>
          <option value="O-" id="category-dropdown">O-</option>
          <option value="AB+" id="category-dropdown">AB+</option>
          <option value="AB-" id="category-dropdown">AB-</option>
        </select>
        {errors.bloodGroup && <p className="error">{errors.bloodGroup}</p>}

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
        {errors.image && <p className="error">{errors.image}</p>}

        <button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default AddContact;
