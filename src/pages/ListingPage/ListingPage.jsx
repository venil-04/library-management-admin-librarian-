import React, { useState } from 'react';
import { database, storage } from '../../context/firebase.jsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push } from 'firebase/database';
import './Listing.css';

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    isbn: '',
    title: '',
    subtitle: '',
    authors: '',
    publisher: '',
    publishedDate: '',
    description: '',
    pageCount: '',
    categories: '',
    thumbnail: null,
    language: '',
    // previewLink: '',
    // infoLink: '',
    isIssued: false,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let thumbnailUrl = '';
    if (formData.thumbnail) {
      setUploading(true);

      const storageRef = ref(storage, `thumbnails/${formData.thumbnail.name}`);
      await uploadBytes(storageRef, formData.thumbnail);
      thumbnailUrl = await getDownloadURL(storageRef);
    }

    const booksRef = dbRef(database, 'items');
    await push(booksRef, {
      id: formData.id,
      isbn: formData.isbn,
      title: formData.title,
      subtitle: formData.subtitle,
      authors: formData.authors.split(',').map((author) => author.trim()),
      publisher: formData.publisher,
      publishedDate: formData.publishedDate,
      description: formData.description,
      pageCount: parseInt(formData.pageCount, 10),
      categories: formData.categories.split(',').map((category) => category.trim()),
      thumbnail: thumbnailUrl,
      language: formData.language,
      // previewLink: formData.previewLink,
      // infoLink: formData.infoLink,
      isIssued: formData.isIssued,
    });

    setUploading(false);
    setFormData({
      id: '',
      isbn: '',
      title: '',
      subtitle: '',
      authors: '',
      publisher: '',
      publishedDate: '',
      description: '',
      pageCount: '',
      categories: '',
      thumbnail: null,
      language: '',
      previewLink: '',
      infoLink: '',
      isIssued: false,
    });
  };

  return (
    <div className="listing-page-form-container">
      <form onSubmit={handleSubmit} className="listing-page-add-book-form">
        <h2>Add a New Book</h2>
        <div className="listing-page-form-group">
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="isbn">ISBN:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="subtitle">Subtitle:</label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="authors">Authors:</label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            placeholder="Separate authors with commas"
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="publisher">Publisher:</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="publishedDate">Published Date:</label>
          <input
            type="date"
            id="publishedDate"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="pageCount">Page Count:</label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="categories">Categories:</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Separate categories with commas"
            required
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="thumbnail">Thumbnail:</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleChange}
          />
        </div>
        <div className="listing-page-form-group">
          <label htmlFor="language">Language:</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="listing-page-form-group">
          <label htmlFor="previewLink">Preview Link:</label>
          <input
            type="url"
            id="previewLink"
            name="previewLink"
            value={formData.previewLink}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div className="listing-page-form-group">
          <label htmlFor="infoLink">Info Link:</label>
          <input
            type="url"
            id="infoLink"
            name="infoLink"
            value={formData.infoLink}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div className="listing-page-form-group">
          <label htmlFor="isIssued">Is Issued:</label>
          <input
            type="checkbox"
            id="isIssued"
            name="isIssued"
            checked={formData.isIssued}
            onChange={handleChange}
          />
        </div> */}
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
