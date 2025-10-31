import React, { useState, useEffect } from 'react';
import './App.css'

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error('Error loading contacts:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (editingId !== null) {
      setContacts(prev =>
        prev.map(contact =>
          contact.id === editingId
            ? { ...contact, ...formData }
            : contact
        )
      );
      setEditingId(null);
    } else {
      const newContact = {
        id: Date.now(),
        ...formData
      };
      setContacts(prev => [...prev, newContact]);
    }

    setFormData({ name: '', phone: '', email: '' });
    setErrors({});
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email
    });
    setEditingId(contact.id);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', phone: '', email: '' });
    setEditingId(null);
    setErrors({});
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contact-manager">
      <div className="container">
        <h1 className="title">Contact Manager</h1>
        
        <div className="form-section">
          <h2 className="section-title">
            {editingId !== null ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          
          <div className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-actions">
              <button onClick={handleSubmit} className="btn btn-primary">
                {editingId !== null ? 'Update Contact' : 'Add Contact'}
              </button>
              {editingId !== null && (
                <button onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="contacts-section">
          <div className="section-header">
            <h2 className="section-title">Contact List ({contacts.length})</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredContacts.length === 0 ? (
            <div className="empty-state">
              {contacts.length === 0
                ? 'No contacts yet. Add your first contact above!'
                : 'No contacts found matching your search.'}
            </div>
          ) : (
            <div className="contacts-list">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-info">
                    <h3 className="contact-name">{contact.name}</h3>
                    <p className="contact-detail">
                      <strong>Phone:</strong> {contact.phone}
                    </p>
                    <p className="contact-detail">
                      <strong>Email:</strong> {contact.email}
                    </p>
                  </div>
                  <div className="contact-actions">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}