import React, { useState, useEffect } from 'react';
import { firestore } from '../../context/firebase.jsx';
import { collection, getDocs } from 'firebase/firestore';
import './UsersList.css';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: '',
    subtitle: '',
    token: ''
  });
  const [commonNotificationData, setCommonNotificationData] = useState({
    title: '',
    subtitle: '',
    tokens:[]
  });
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showCommonNotificationPopup, setShowCommonNotificationPopup] = useState(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  // Open notification popup
  const openNotificationPopup = (user) => {
    setSelectedUser(user);
    setNotificationData({
      title: '',
      subtitle: '',
      token: user.token
    });
    setShowNotificationPopup(true);
  };

  // Close notification popup
  const closeNotificationPopup = () => {
    setShowNotificationPopup(false);
  };

  // Open common notification popup
  const openCommonNotificationPopup =async () => {
    const usersCollection = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const tokens = usersSnapshot.docs.map(doc => doc.data().token);

    setCommonNotificationData({
      title: '',
      subtitle: '',
      tokens: tokens
    });
    setShowCommonNotificationPopup(true);
  };

  // Close common notification popup
  const closeCommonNotificationPopup = () => {
    setShowCommonNotificationPopup(false);
  };

  // Handle sending individual notification
  const sendNotification = async () => {
    if (!selectedUser || !notificationData.title || !notificationData.subtitle) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:3000/send-notification', notificationData);
      alert('Notification sent successfully!');
      setShowNotificationPopup(false); // Close popup after sending notification
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    }
  };

  // Handle sending common notification
  const sendCommonNotification = async () => {
    if (!commonNotificationData.title || !commonNotificationData.subtitle) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:3000/sendAll', commonNotificationData);
      alert('Common notification sent successfully!');
      setShowCommonNotificationPopup(false); // Close popup after sending notification
    } catch (error) {
      console.error('Error sending common notification:', error);
      alert('Failed to send common notification. Please try again.');
    }
  };

  return (
    <div className="users-list">
      <h2>All Users</h2>
      <button className="send-all-btn" onClick={openCommonNotificationPopup}>Send Notification to All Users</button>
      <div className="users-container">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-details">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <button onClick={() => openNotificationPopup(user)}>Send Notification</button>
            </div>
          </div>
        ))}
      </div>

      {showNotificationPopup && (
        <div className="notification-popup">
          <button className="close-btn" onClick={closeNotificationPopup}>X</button>
          <h3>Send Notification to {selectedUser.name}</h3>
          <input
            type="text"
            placeholder="Title"
            value={notificationData.title}
            onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={notificationData.subtitle}
            onChange={(e) => setNotificationData({ ...notificationData, subtitle: e.target.value })}
          />
          <button onClick={sendNotification}>Send Notification</button>
        </div>
      )}

      {showCommonNotificationPopup && (
        <div className="notification-popup">
          <button className="close-btn" onClick={closeCommonNotificationPopup}>X</button>
          <h3>Send Notification to All Users</h3>
          <input
            type="text"
            placeholder="Title"
            value={commonNotificationData.title}
            onChange={(e) => setCommonNotificationData({ ...commonNotificationData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={commonNotificationData.subtitle}
            onChange={(e) => setCommonNotificationData({ ...commonNotificationData, subtitle: e.target.value })}
          />
          <button onClick={sendCommonNotification}>Send Notification</button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
