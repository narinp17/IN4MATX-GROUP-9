import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InterestTag from "@/components/InterestTag";
import { INTEREST_OPTIONS } from "@/lib/interests";
import { User, Settings, LogOut, Shield, Pencil, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function MyProfile({ myProfile, user, onProfileUpdate }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(myProfile.display_name);
  const [bio, setBio] = useState(myProfile.bio || "");
  const [interests, setInterests] = useState(myProfile.interests || []);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.UserProfile.update(myProfile.id, {
      display_name: displayName,
      bio,
      interests,
    });
    setSaving(false);
    setEditing(false);
    onProfileUpdate();
    toast.success("Profile updated!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Profile</h1>
        <Link to="/settings" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-b from-secondary/50 to-card rounded-3xl p-6 text-center mb-6 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-secondary-foreground" />
        </div>
        {editing ? (
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-center font-bold text-lg rounded-xl"
          />
        ) : (
          <h2 className="text-xl font-extrabold">{myProfile.display_name}</h2>
        )}
        {myProfile.is_verified && (
          <div className="flex items-center justify-center gap-1 mt-1 text-blue-600 text-xs font-semibold">
            <Shield className="w-3 h-3" /> Verified
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Tags</h3>
        {editing ? (
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <InterestTag
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(myProfile.interests || []).map((tag) => (
              <InterestTag key={tag} label={tag} variant="coral" />
            ))}
            {(!myProfile.interests || myProfile.interests.length === 0) && (
              <p className="text-sm text-muted-foreground">No tags selected</p>
            )}
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold">Bio</h3>
          {editing && (
            <span className="text-[10px] text-muted-foreground">{bio.length}/300</span>
          )}
        </div>
        {editing ? (
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            className="rounded-xl bg-card h-28 resize-none"
            maxLength={300}
            placeholder="Tell people about yourself..."
          />
        ) : (
          <div className="bg-secondary/30 rounded-2xl p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {myProfile.bio || "No bio yet. Tap edit to add one!"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {editing ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setEditing(false);
                setDisplayName(myProfile.display_name);
                setBio(myProfile.bio || "");
                setInterests(myProfile.interests || []);
              }}
              className="flex-1 rounded-xl h-11"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl h-11">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            className="w-full rounded-xl h-11"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => base44.auth.logout()}
          className="w-full rounded-xl h-11 text-destructive hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </motion.div>
  );
}