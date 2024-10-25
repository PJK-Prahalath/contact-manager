import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

function ContactList({ contacts }) {
  return (
    <div>
      <h2>Contact List</h2>
      {contacts.length === 0 ? (
        <p>No contacts available.</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              <strong>{contact.name}</strong>
              <br />Phone: {contact.phone}
              <br />Email: {contact.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContactList;
