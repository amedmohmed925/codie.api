import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationBell = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:6000', {
      auth: { token },
      transports: ['websocket']
    });
    socket.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnread((u) => u + 1);
    });
    return () => socket.disconnect();
  }, [token]);

  const handleBellClick = () => setShowDropdown((s) => !s);
  const handleMarkAllRead = () => {
    setUnread(0);
    // Optionally, call API to mark all as read
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleBellClick}>
        🔔 {unread > 0 && <span style={{ color: 'red' }}>({unread})</span>}
      </button>
      {showDropdown && (
        <div style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #ccc', width: 300, zIndex: 100 }}>
          <button onClick={handleMarkAllRead}>Mark all as read</button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notifications.slice(0, 10).map((notif, idx) => (
              <li key={notif._id || idx} style={{ padding: 8, borderBottom: '1px solid #eee', background: notif.isRead ? '#f9f9f9' : '#e6f7ff' }}>
                <strong>{notif.title}</strong>
                <div>{notif.description}</div>
                {notif.link && <a href={notif.link}>View</a>}
              </li>
            ))}
            {notifications.length === 0 && <li style={{ padding: 8 }}>No notifications</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
