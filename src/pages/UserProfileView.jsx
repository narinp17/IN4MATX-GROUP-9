import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InterestTag from "@/components/InterestTag";
import { timeAgo } from "@/lib/timeAgo";
import { ArrowLeft, User, MoreHorizontal, Hand, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function UserProfileView({ myProfile }) {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const userId = window.location.pathname.split("/user/")[1];
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    base44.entities.UserProfile.filter({ user_id: userId }).then((profiles) => {
      setProfile(profiles[0] || null);
      setLoading(false);
    });
  }, [userId]);

  const handlePing = async () => {
    const shared = (myProfile.interests || []).filter((i) =>
      (profile.interests || []).map((x) => x.toLowerCase()).includes(i.toLowerCase())
    );
    await base44.entities.Ping.create({
      sender_id: myProfile.user_id,
      sender_name: myProfile.display_name,
      receiver_id: profile.user_id,
      receiver_name: profile.display_name,
      status: "pending",
      shared_interests: shared,
    });
    toast.success("Wave sent! 👋");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Profile</h1>
        <button className="text-muted-foreground">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-gradient-to-b from-secondary/50 to-card rounded-3xl p-6 text-center mb-6 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-secondary-foreground" />
        </div>
        <h2 className="text-xl font-extrabold">{profile.display_name}</h2>
        {profile.is_verified && (
          <div className="flex items-center justify-center gap-1 mt-1 text-blue-600 text-xs font-semibold">
            <Shield className="w-3 h-3" /> Verified
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{timeAgo(profile.last_active)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {(profile.interests || []).map((tag) => (
            <InterestTag key={tag} label={tag} variant="coral" />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2">Bio</h3>
        <div className="bg-secondary/30 rounded-2xl p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {profile.bio || "No bio yet."}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handlePing}
          className="flex-1 rounded-xl h-12 text-base font-bold"
        >
          <Hand className="w-5 h-5 mr-2" /> Wave
        </Button>
        <Button variant="outline" className="w-12 h-12 rounded-xl">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}