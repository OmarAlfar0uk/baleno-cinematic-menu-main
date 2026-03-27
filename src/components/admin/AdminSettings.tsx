import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSettings = () => {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({ ...settings });

  const handleSave = () => {
    updateSettings(form);
    toast.success("Settings saved!");
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="font-heading text-xl text-foreground mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Restaurant Name</label>
          <Input value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} className="bg-muted border-border" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">WhatsApp Phone Number (with country code, no +)</label>
          <Input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="bg-muted border-border" placeholder="201XXXXXXXXX" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Hero Tagline</label>
          <Textarea value={form.heroTagline} onChange={(e) => setForm({ ...form, heroTagline: e.target.value })} className="bg-muted border-border" rows={2} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Currency Label</label>
          <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="bg-muted border-border" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Opening Hours</label>
          <Input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} className="bg-muted border-border" />
        </div>
        <Button onClick={handleSave} className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
