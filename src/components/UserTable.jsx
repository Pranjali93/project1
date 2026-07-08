import React, { useState, useEffect } from "react";
import {
  createContact,
  getAllContacts,
  getContactById,
} from "../services/contactService";

import { deleteUserById } from "../services/userService";

const BADGE_COLORS = [
  "#2A6F6F",
  "#5B6472",
  "#C1443D",
  "#8A6D3B",
  "#3F5FAA",
  "#6B4E9E",
];

function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  const initials =
    parts.length > 1
      ? parts[0][0] + parts[1][0]
      : parts[0].slice(0, 2);

  return initials.toUpperCase();
}

function getBadgeColor(name) {
  const sum = (name || "")
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return BADGE_COLORS[sum % BADGE_COLORS.length];
}

function UserTable({ searchTerm }) {
  const emptyForm = {
    name: "",
    email: "",
    message: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);

    try {
      const res = await getAllContacts();

      const contacts =
        res?.data ||
        res?.contacts ||
        res?.result ||
        res ||
        [];

      setUsers(Array.isArray(contacts) ? contacts : []);
    } catch (err) {
      setError("Couldn't load contacts.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      await createContact(form);

      setForm(emptyForm);

      await loadContacts();
    } catch (err) {
      setError("Couldn't add contact.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleView = async (id) => {
    try {
      const response = await getContactById(id);

      const contact =
        response.data ||
        response.contact ||
        response.result ||
        response;

      setSelectedContact(contact);
      setShowModal(true);
    } catch (err) {
      setError("Unable to fetch contact details.");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setDeletingId(id);

      const res = await deleteUserById(id);

      console.log("Delete Response:", res);

      setUsers((prev) =>
        prev.filter((item) => (item._id || item.id) !== id)
      );
    } catch (err) {
      console.log(err);
      console.log(err.response);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete contact."
      );
    } finally {
      setDeletingId(null);
    }
  };
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="panel loading-row">
        <span className="spinner" />
        Loading Contacts...
      </div>
    );
  }

  return (
    <>
      {/* Add Contact Form */}
      <div className="form-section">
        <h3 className="section-title">Add New Contact</h3>

        {error && (
          <div className="banner error-banner">
            {error}
          </div>
        )}

        <form className="contact-form-card" onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group form-message">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Enter your message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Add Contact"}
            </button>
          </div>
        </form>
      </div>

      {/* Contact List */}
      <div className="table-section">
        <h3 className="section-title">Contact List</h3>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id || user.id}>
                  <td>
                    <div className="name-cell">
                      <span
                        className="avatar-badge"
                        style={{
                          background: getBadgeColor(user.name),
                        }}
                      >
                        {getInitials(user.name)}
                      </span>

                      {user.name}
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>{user.message}</td>

                  <td className="actions-cell">
                    <button
                      className="btn btn-small"
                      onClick={() => handleView(user._id || user.id)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(user._id || user.id)}
                      disabled={deletingId === (user._id || user.id)}
                    >
                      {deletingId === (user._id || user.id)
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Contact Modal */}
      {showModal && selectedContact && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Contact Details</h3>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span>Name</span>
                <p>{selectedContact.name}</p>
              </div>

              <div className="detail-row">
                <span>Email</span>
                <p>{selectedContact.email}</p>
              </div>

              <div className="detail-row">
                <span>Message</span>
                <p>{selectedContact.message}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserTable;