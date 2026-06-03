import { User, Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InterestTag from "./InterestTag";
import { timeAgo } from "@/lib/timeAgo";
import { formatDistance } from "@/lib/location";
import { motion } from "framer-motion";

export default function UserCard({ profile, distance, sharedInterests, onPing, pingStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 text-secondary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm truncate">{profile.display_name}</span>
          {profile.is_verified && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-600">✓</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {sharedInterests?.slice(0, 3).map((tag) => (
            <InterestTag key={tag} label={tag} variant="coral" />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(profile.last_active)}</p>
      </div>
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2">
          {formatDistance(distance)}
        </Badge>
        <button
          onClick={onPing}
          disabled={pingStatus === "pending" || pingStatus === "accepted"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            pingStatus === "pending"
              ? "bg-muted text-muted-foreground"
              : pingStatus === "accepted"
              ? "bg-green-100 text-green-600"
              : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
          }`}
        >
          <Hand className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}