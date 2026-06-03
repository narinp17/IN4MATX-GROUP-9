import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MoreHorizontal, Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatRoom({ myProfile }) {
  const navigate = useNavigate();
  const chatId = window.location.pathname.split("/chat/")[1];
  const [message, setMessage] = useState("");
  const messagesEnd = useRef(null);
  const queryClient = useQueryClient();

  const { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const chats = await base44.entities.Chat.filter({});
      return chats.find((c) => c.id === chatId);
    },
    enabled: !!chatId,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => base44.entities.ChatMessage.filter({ chat_id: chatId }),
    refetchInterval: 3000,
    enabled: !!chatId,
  });

  const sendMutation = useMutation({
    mutationFn: async (content) => {
      await base44.entities.ChatMessage.create({
        chat_id: chatId,
        sender_id: myProfile.user_id,
        sender_name: myProfile.display_name,
        content,
        is_active: true,
      });
      await base44.entities.Chat.update(chatId, {
        last_message: content,
        last_message_time: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      setMessage("");
    },
  });

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherName = chat
    ? chat.user1_id === myProfile.user_id
      ? chat.user2_name
      : chat.user1_name
    : "";

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate(message.trim());
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_date) - new Date(b.created_date)
  );

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/30 px-4 py-3 flex items-center gap-3 border-b border-border/30">
        <button onClick={() => navigate("/chats")} className="text-primary font-bold">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">{otherName}</p>
          {chat?.shared_interests?.length > 0 && (
            <div className="flex gap-1 mt-0.5">
              <span className="text-[10px] text-muted-foreground">Similar Tags:</span>
              {chat.shared_interests.slice(0, 3).map((t) => (
                <Badge key={t} variant="outline" className="text-[9px] px-1.5 py-0 rounded-full">
                  #{t}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <button className="text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : sortedMessages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">
            Say hello! 👋
          </p>
        ) : (
          <AnimatePresence>
            {sortedMessages.map((msg, i) => {
              const isMe = msg.sender_id === myProfile.user_id;
              const showTime =
                i === 0 ||
                new Date(msg.created_date).getTime() -
                  new Date(sortedMessages[i - 1].created_date).getTime() >
                  300000;
              return (
                <div key={msg.id}>
                  {showTime && (
                    <p className="text-center text-[10px] text-muted-foreground my-3">
                      {format(new Date(msg.created_date), "M/d/yyyy h:mm a")}
                    </p>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-secondary text-secondary-foreground rounded-br-md"
                          : "bg-primary text-primary-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="rounded-full bg-muted border-0 h-10 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}