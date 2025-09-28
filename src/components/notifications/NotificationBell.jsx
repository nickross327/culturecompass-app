import React, { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/api/entities';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await Notification.list('-created_date', 15);
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      // This will fail for non-admins due to RLS, which is expected and handled.
      // console.log("Could not fetch notifications, likely not an admin.");
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOpenChange = async (isOpen) => {
    if (isOpen && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      try {
        await Promise.all(unreadIds.map(id => Notification.update(id, { is_read: true })));
        // Optimistically update UI
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? <BellRing className="h-5 w-5 text-blue-600 animate-pulse" /> : <Bell className="h-5 w-5 text-slate-600" />}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center p-6 text-slate-500">
            <p>Loading...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <DropdownMenuItem key={notification.id} className={`flex flex-col items-start gap-1 p-3 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                <p className="font-semibold text-slate-800">{notification.title}</p>
                <p className="text-sm text-slate-600 whitespace-normal">{notification.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <Inbox className="w-8 h-8 mb-2" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm">You have no new notifications.</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}