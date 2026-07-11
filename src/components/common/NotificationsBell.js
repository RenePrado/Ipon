import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { Toast } from "./Toast";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function NotificationsBell({ notifications, unreadCount, onMarkAllRead, onClear, onRemove, toast, onToastDone }) {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (toast) {
      setToastData(toast);
      setToastVisible(true);
    } else {
      setToastVisible(false);
    }
  }, [toast]);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (unreadCount > 0 && !open) onMarkAllRead();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-md text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-danger text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div
        className={`absolute right-full top-0 mr-2 z-50 origin-top-right transition-all duration-300 ease-out ${
          toastVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-3 pointer-events-none"
        }`}
      >
        {toastData && <Toast msg={toastData.msg} type={toastData.type} onDone={onToastDone} />}
      </div>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg border border-border dark:border-dark-border shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
            <div className="text-sm font-medium text-text-primary dark:text-dark-text-primary">Notifications</div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  aria-label="Clear all notifications"
                  className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-danger hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1.5 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-text-tertiary dark:text-dark-text-tertiary">
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-border dark:border-dark-border last:border-b-0 hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors ${
                    !n.read ? "bg-accent-primary/5" : ""
                  }`}
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      n.type === "success" ? "bg-success" :
                      n.type === "warning" ? "bg-warning" :
                      n.type === "danger" ? "bg-danger" : "bg-accent-primary"
                    }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary dark:text-dark-text-primary leading-snug">
                      {n.title}
                    </div>
                    {n.body && (
                      <div className="text-sm text-text-secondary dark:text-dark-text-secondary leading-snug break-words mt-0.5">
                        {n.body}
                      </div>
                    )}
                    <div className="text-xs text-text-tertiary dark:text-dark-text-tertiary mt-1">
                      {formatTime(n.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(n.id)}
                    aria-label="Remove notification"
                    className="p-1 rounded text-text-tertiary dark:text-dark-text-tertiary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors flex-shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="w-full px-4 py-2 text-xs font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors border-t border-border dark:border-dark-border flex items-center justify-center gap-1"
            >
              <Check size={12} /> Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}
