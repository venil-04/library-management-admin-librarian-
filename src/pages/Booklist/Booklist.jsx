import React, { useEffect, useState } from 'react';
import { database } from '../../context/firebase.jsx';
import { ref, onValue, remove } from 'firebase/database';
import './Booklist.css';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'issued', 'available'

  useEffect(() => {
    const booksRef = ref(database, 'items');
    onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      if (booksData) {
        const booksList = Object.keys(booksData).map((key) => ({
          id: key,
          ...booksData[key],
        }));
        setBooks(booksList);
      }
    });
  }, []);

  // Function to delete a book by ID
  const deleteBook = async (id) => {
    try {
      console.log("id",id);
      const bookRef = ref(database, `items/${id}`);
      await remove(bookRef);
      // Optional: Update state or display a success message
    } catch (error) {
      console.error('Error deleting book:', error);
      // Handle error: Display an error message
    }
  };

  // Function to update a book (dummy function placeholder)
  const updateBook = (id) => {
    // Replace with your update logic (API call, modal opening, etc.)
    console.log(`Update book with ID ${id}`);
  };

  // Filter books based on search term and status
  const filteredBooks = books.filter((book) => {
    const { title, authors, categories, description, isIssued ,publisher} = book;
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    // Filter by search term
    const matchesSearch = (
      title.toLowerCase().includes(lowerCaseSearch) ||
      authors[0].toLowerCase().includes(lowerCaseSearch) ||
      categories[0].toLowerCase().includes(lowerCaseSearch) ||
      description.toLowerCase().includes(lowerCaseSearch)||
      publisher.toLowerCase().includes(lowerCaseSearch)

    );

    // Filter by status
    if (statusFilter === 'all') {
      return matchesSearch;
    } else if (statusFilter === 'issued') {
      return matchesSearch && (book.qty-book.totalIssuedQty)<=0 ;
    } else if (statusFilter === 'available') {
      return matchesSearch && (book.qty-book.totalIssuedQty)>0 ;
    } else {
      return false;
    }
  });

  return (
    <div className="books-list">
      <h2>Library Books</h2>
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title, author, category, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="issued">Issued</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>
      <table className="books-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>Publisher</th>
            <th>Description</th>
            <th>Categories</th>
            <th>Language</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>{book.publisher}</td>
              <td>{book.description}</td>
              <td>{book.categories}</td>
              <td>{book.language}</td>
              <td>{(book.qty-book.totalIssuedQty)<=0 ? 'Issued' : 'Available'}</td>
              <td>
                <button className="action-btn" onClick={() => updateBook(book.id)}>Update</button>
                <button className="action-btn" onClick={() => deleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksList;
