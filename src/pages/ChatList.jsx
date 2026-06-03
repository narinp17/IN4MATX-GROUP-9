import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MessageCircle, User, Hand, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ChatList({ myProfile }) {
  const queryClient = useQueryClient();

  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["chats", myProfile.user_id],
    queryFn: async () => {
      const [c1, c2] = await Promise.all([
        base44.entities.Chat.filter({ user1_id: myProfile.user_id, is_active: true }),
        base44.entities.Chat.filter({ user2_id: myProfile.user_id, is_active: true }),
      ]);
      return [...c1, ...c2].sort(
        (a, b) => new Date(b.last_message_time || b.created_date) - new Date(a.last_message_time || a.created_date)
      );
    },
  });

  const { data: incomingPings = [] } = useQuery({
    queryKey: ["incoming-pings", myProfile.user_id],
    queryFn: () => base44.entities.Ping.filter({ receiver_id: myProfile.user_id, status: "pending" }),
  });

  const acceptPingMutation = useMutation({
    mutationFn: async (ping) => {
      await base44.entities.Ping.update(ping.id, { status: "accepted" });
      await base44.entities.Chat.create({
        user1_id: ping.sender_id,
        user1_name: ping.sender_name,
        user2_id: ping.receiver_id,
        user2_name: ping.receiver_name,
        shared_interests: ping.shared_interests,
        is_active: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-pings"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success("Chat started!");
    },
  });

  const ignorePingMutation = useMutation({
    mutationFn: (ping) => base44.entities.Ping.update(ping.id, { status: "ignored" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-pings"] });
    },
  });

  const getOtherName = (chat) => {
    return chat.user1_id === myProfile.user_id ? chat.user2_name : chat.user1_name;
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-extrabold">Chats</h1>
      </div>

      {incomingPings.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-muted-foreground mb-3">INCOMING WAVES</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {incomingPings.map((ping) => (
                <motion.div
                  key={ping.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hand className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{ping.sender_name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {(ping.shared_interests || []).slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      onClick={() => acceptPingMutation.mutate(ping)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
                      onClick={() => ignorePingMutation.mutate(ping)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {chatsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No chats yet. Wave at someone nearby!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link key={chat.id} to={`/chat/${chat.id}`}>
              <div className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{getOtherName(chat)}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.last_message || "No messages yet"}
                  </p>
                </div>
                {chat.last_message_time && (
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(chat.last_message_time), "h:mm a")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}