import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { IoNotificationsSharp } from "react-icons/io5";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("notification", (data) => {
      // Obtener fecha y hora en formato DD/MM/AAAA HH:mm
      const now = new Date();
      const date = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true, });
      const timestamp = `${date} ${time}`;
  
      setNotifications((prevNotifications) => {
        const newNotification = { message: data.message, timestamp };
        const newNotifications = [newNotification, ...prevNotifications];
        localStorage.setItem("notifications", JSON.stringify(newNotifications));
        return newNotifications;
      });
    });

    const savedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = (event) => {
    event.stopPropagation();
    setShowNotifications((prev) => !prev);
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
    setShowNotifications(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#FE8000] text-white z-50 shadow-lg">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="text-lg font-bold ml-[50px]">Mi Aplicación</div>

        <div className="relative flex items-center ml-auto md:mr-8 mr-4">
          <button
            onClick={toggleNotifications}
            className="text-white transition-all duration-300 hover:scale-105"
            style={{ width: "39px", height: "39px" }}
          >
            <IoNotificationsSharp className="text-2xl sm:text-3xl" />
          </button>
          {notifications.length > 0 && (
            <span className="absolute top-2 left-3 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 animate-bounce">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div
              ref={notificationsRef}
              className="absolute top-12 right-0 bg-white p-4 shadow-lg w-60 max-h-60 overflow-auto rounded-lg z-50"
            >
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 mb-3 hover:bg-gray-200 px-2 py-1 rounded-md transition-all duration-300"
                    >
                      <div>{notification.message}</div>
                      <div className="text-xs text-gray-500">
                        {notification.timestamp}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-700">
                    No hay notificaciones
                  </li>
                )}
              </ul>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="mt-2 w-full bg-red-500 text-white py-1 rounded-md"
                >
                  Eliminar Notificaciones
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
