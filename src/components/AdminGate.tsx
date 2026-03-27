import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

interface AdminGateProps {
  onAuthenticated: () => void;
}

const AdminGate = ({ onAuthenticated }: AdminGateProps) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "baleno2005") {
      setOpen(false);
      setPassword("");
      setError(false);
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-muted/50 text-muted-foreground
          flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity"
        title="Content Admin"
      >
        <Settings size={16} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold gold-glow">Content Admin</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Enter the password to open your classic admin dashboard, then publish changes live when you are ready.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-muted border-border ${error ? "border-destructive" : ""}`}
                autoFocus
              />
              {error && <p className="text-destructive text-xs mt-1">Wrong password</p>}
            </motion.div>
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Open Dashboard
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminGate;
