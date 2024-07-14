import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firestore } from '../../context/firebase.jsx';
import { doc, getDoc } from 'firebase/firestore';
import './OrderPage.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterDays, setFilterDays] = useState(7);
  const [notificationData, setNotificationData] = useState({
    title: '',
    subtitle: '',
    token: ''
  });
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const ordersData = [];
      snapshot.forEach((childSnapshot) => {
        ordersData.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const calculateGap = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  const filteredOrders = orders.filter((order) => {
    const gap = calculateGap(order.startDate, order.endDate);
    return gap <= filterDays;
  });

  const openNotificationPopup = async (userId) => {
    try {
      const userDocRef = doc(firestore, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setNotificationData({
          title: '',
          subtitle: '',
          token: userData.token,
        });
        setSelectedOrder({ userId });
        setShowNotificationPopup(true);
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const closeNotificationPopup = () => {
    setShowNotificationPopup(false);
  };

  const sendNotification = async () => {
    if (!selectedOrder || !notificationData.title || !notificationData.subtitle) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:3000/send-notification', notificationData);
      console.log('sending', notificationData);

      alert('Notification sent successfully!');
      setShowNotificationPopup(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF();

    const tableColumn = ["ISBN ID", "User ID", "Start Date", "End Date", "Return Date"];
    const tableRows = [];

    filteredOrders.forEach(order => {
      const orderData = [
        order.isbnId,
        order.userId,
        order.startDate,
        order.endDate,
        order.returnDate || 'Not Returned',
      ];
      tableRows.push(orderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Order List", 14, 15);
    doc.save("order_list.pdf");
  };

  return (
    <div className="orders-page">
      <h2>All Orders</h2>
      <div className="filter-container">
        <label>Filter orders with gap less than or equal to</label>
        <input
          type="number"
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
        />
        <span>days</span>
      </div>
      <button onClick={exportToPdf}>Export to PDF</button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ISBN ID</th>
            <th>User ID</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Return Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.isbnId}</td>
              <td>{order.userId}</td>
              <td>{order.startDate}</td>
              <td>{order.endDate}</td>
              <td>{order.returnDate || 'Not Returned'}</td>
              <td>
                <button onClick={() => openNotificationPopup(order.userId)}>Send Notification</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showNotificationPopup && (
        <div className="notification-popup">
          <button className="close-btn" onClick={closeNotificationPopup}>X</button>
          <h3>Send Notification to {selectedOrder.userId}</h3>
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
    </div>
  );
};

export default OrdersPage;
