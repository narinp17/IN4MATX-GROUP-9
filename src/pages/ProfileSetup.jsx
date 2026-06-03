import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InterestTag from "@/components/InterestTag";
import { INTEREST_OPTIONS } from "@/lib/interests";
import { motion } from "framer-motion";
import { User, ArrowRight, Sparkles } from "lucide-react";

export default function ProfileSetup({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(user?.full_name || "");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    await base44.entities.UserProfile.create({
      user_id: user.id,
      display_name: displayName,
      bio,
      interests,
      is_visible: true,
      profile_setup_complete: true,
      last_active: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10 max-w-lg mx-auto">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                Welcome to <span className="text-primary">friendli</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">Let's set up your profile</p>
            </div>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-12 h-12 text-secondary-foreground" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Display Name</label>
                <Input
                  placeholder="What should people call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 rounded-xl bg-card"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-foreground">Bio</label>
                  <span className="text-[10px] text-muted-foreground">{bio.length}/300</span>
                </div>
                <Textarea
                  placeholder="Tell people a bit about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  className="mt-1 rounded-xl bg-card h-28 resize-none"
                  maxLength={300}
                />
              </div>
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!displayName.trim()}
              className="w-full rounded-xl h-12 text-base font-bold"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-2" />
              <h2 className="text-2xl font-extrabold text-foreground">Pick your interests</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Select at least one to find like-minded people
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {INTEREST_OPTIONS.map((interest) => (
                <InterestTag
                  key={interest}
                  label={interest}
                  selected={interests.includes(interest)}
                  onClick={() => toggleInterest(interest)}
                />
              ))}
            </div>
            <Button
              onClick={handleFinish}
              disabled={interests.length === 0 || saving}
              className="w-full rounded-xl h-12 text-base font-bold"
            >
              {saving ? "Setting up..." : "Let's go!"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}