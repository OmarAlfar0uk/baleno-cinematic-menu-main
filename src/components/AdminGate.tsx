import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { loginPublishingAdmin, refreshPublishingSession } from "@/lib/netlifyPublishing";

interface AdminGateProps {
  initialOpen?: boolean;
  onAuthenticated: () => void;
}

const AdminGate = ({ initialOpen = false, onAuthenticated }: AdminGateProps) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialAttemptDone = useRef(false);

  const shakeError = (message: string) => {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(""), 1200);
  };

  const attemptOpen = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const session = await refreshPublishingSession();

      if (session.authenticated) {
        onAuthenticated();
        return;
      }

      setOpen(true);
    } catch {
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onAuthenticated]);

  useEffect(() => {
    if (!initialOpen || initialAttemptDone.current) return;

    initialAttemptDone.current = true;
    void attemptOpen();
  }, [attemptOpen, initialOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await loginPublishingAdmin(password);
      setOpen(false);
      setPassword("");
      onAuthenticated();
    } catch (error) {
      shakeError(error instanceof Error ? error.message : "Could not unlock the dashboard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => void attemptOpen()}
        disabled={isSubmitting}
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-muted/50 text-muted-foreground
          flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity disabled:opacity-100"
        title="Content Admin"
      >
        <Settings size={16} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold gold-glow">Content Admin</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Enter the admin password to unlock the dashboard and publish the latest menu to GitHub through Vercel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              animate={errorMessage ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-muted border-border ${errorMessage ? "border-destructive" : ""}`}
                autoFocus
                disabled={isSubmitting}
              />
              {errorMessage && <p className="text-destructive text-xs mt-1">{errorMessage}</p>}
            </motion.div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              {isSubmitting ? "Unlocking..." : "Open Dashboard"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminGate;
