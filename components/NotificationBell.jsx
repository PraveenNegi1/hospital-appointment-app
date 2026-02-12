"use client";

import { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in → no notifications loaded");
      return;
    }

    console.log("Loading notifications for user:", user.uid);

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        console.log("Notifications received:", data.length, "items", data);

        setNotifications(data);

        // Count unread notifications
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      },
      (error) => {
        console.error("Notifications listener error:", error);
      },
    );

    return () => {
      console.log("Unsubscribing from notifications");
      unsubscribe();
    };
  }, []);

  // 🔥 Mark single notification as read
  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, "notifications", notifId), {
        isRead: true,
      });
      console.log("Marked as read:", notifId);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // 🔥 Mark all notifications as read when panel opens
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);

    try {
      await Promise.all(
        unread.map((n) =>
          updateDoc(doc(db, "notifications", n.id), {
            isRead: true,
          }),
        ),
      );

      console.log("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);

          if (newState) {
            // Instantly hide badge
            setUnreadCount(0);
            markAllAsRead();
          }
        }}
        className="relative p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="px-4 py-3 bg-indigo-600 text-white font-medium">
            Notifications
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-6 text-center text-gray-500 text-sm">
                No notifications yet
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    !notif.isRead ? "bg-indigo-50" : ""
                  }`}
                >
                  <p className="text-sm">{notif.message || "(no message)"}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    {notif.createdAt?.toDate?.()
                      ? notif.createdAt.toDate().toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
