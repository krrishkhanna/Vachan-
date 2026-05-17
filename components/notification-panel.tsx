"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Clock, TrendingUp, AlertTriangle, Info, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  type: "fact" | "alert" | "update" | "trending"
  title: string
  content: string
  time: string
  read: boolean
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Initialize notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: "1",
        type: "trending",
        title: "Top 5 Trending Facts",
        content:
          "1. COVID-19 vaccines do not alter DNA. 2. The Earth's climate is warming due to human activities. 3. Drinking water does not wash away COVID-19. 4. 5G networks do not spread viruses. 5. Wearing masks helps reduce virus transmission.",
        time: "10 minutes ago",
        read: false,
      },
      {
        id: "2",
        type: "alert",
        title: "Viral Misinformation Alert",
        content:
          "A video claiming to show election fraud in Maharashtra is circulating. Our fact-check confirms this is manipulated content from a 2018 event.",
        time: "1 hour ago",
        read: false,
      },
      {
        id: "3",
        type: "update",
        title: "Fact-Check Update",
        content:
          "We've updated our analysis on the recent economic policy announcement with additional verified sources.",
        time: "3 hours ago",
        read: false,
      },
      {
        id: "4",
        type: "fact",
        title: "Daily Fact: Space",
        content:
          "One day on Venus is longer than one year on Venus. Venus rotates so slowly that it takes 243 Earth days to complete one rotation.",
        time: "5 hours ago",
        read: true,
      },
      {
        id: "5",
        type: "trending",
        title: "Trending Topic: Health",
        content:
          "Multiple verified reports confirm that regular exercise can reduce the risk of chronic diseases by up to 50%.",
        time: "1 day ago",
        read: true,
      },
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter((n) => !n.read).length)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id && !notification.read) {
          setUnreadCount((count) => count - 1)
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount((count) => count - 1)
      }
      return prev.filter((n) => n.id !== id)
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "fact":
        return <Info className="h-5 w-5 text-blue-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "update":
        return <Clock className="h-5 w-5 text-green-500" />
      case "trending":
        return <TrendingUp className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </SheetHeader>

          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">
                All
                {unreadCount > 0 && <Badge className="ml-1 bg-[#0077b6]">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="facts">Facts</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <AnimatePresence>
                  {notifications.length > 0 ? (
                    <div className="space-y-3 pr-4">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`p-3 rounded-lg border ${
                            notification.read ? "border-border bg-background" : "border-[#0077b6]/30 bg-[#0077b6]/5"
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              {getNotificationIcon(notification.type)}
                              <div>
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{notification.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        You're all caught up! We'll notify you when there are new updates.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="facts">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <AnimatePresence>
                  {notifications.filter((n) => n.type === "fact" || n.type === "trending").length > 0 ? (
                    <div className="space-y-3 pr-4">
                      {notifications
                        .filter((n) => n.type === "fact" || n.type === "trending")
                        .map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`p-3 rounded-lg border ${
                              notification.read ? "border-border bg-background" : "border-[#0077b6]/30 bg-[#0077b6]/5"
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                {getNotificationIcon(notification.type)}
                                <div>
                                  <h4 className="text-sm font-medium">{notification.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{notification.content}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No fact notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Stay tuned for verified facts and trending topics.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="alerts">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <AnimatePresence>
                  {notifications.filter((n) => n.type === "alert" || n.type === "update").length > 0 ? (
                    <div className="space-y-3 pr-4">
                      {notifications
                        .filter((n) => n.type === "alert" || n.type === "update")
                        .map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`p-3 rounded-lg border ${
                              notification.read ? "border-border bg-background" : "border-[#0077b6]/30 bg-[#0077b6]/5"
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                {getNotificationIcon(notification.type)}
                                <div>
                                  <h4 className="text-sm font-medium">{notification.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{notification.content}</p>
                                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        You have no active alerts or updates at this time.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}

