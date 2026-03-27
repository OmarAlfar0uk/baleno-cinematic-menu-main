import { useState } from "react";
import { useStore, Branch } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const AdminSettings = () => {
  const {
    settings,
    branches,
    currentBranchId,
    categories,
    items,
    orders,
    addBranch,
    updateBranch,
    deleteBranch,
    setCurrentBranch,
    updateSettings,
  } = useStore();
  const [form, setForm] = useState({ ...settings });
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchWhatsapp, setNewBranchWhatsapp] = useState("");

  const handleSave = () => {
    updateSettings(form);
    toast.success("Settings saved!");
  };

  const handleExportBackup = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        version: 1,
        data: {
          settings,
          branches,
          currentBranchId,
          categories,
          items,
          orders,
        },
      };

      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateTag = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `baleno-backup-${dateTag}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Backup exported");
    } catch {
      toast.error("Failed to export backup");
    }
  };

  const handleAddBranch = () => {
    const name = newBranchName.trim();
    const whatsappNumber = newBranchWhatsapp.trim();

    if (!name) {
      toast.error("Branch name is required");
      return;
    }

    if (!whatsappNumber) {
      toast.error("Branch WhatsApp number is required");
      return;
    }

    addBranch({ name, whatsappNumber, isActive: true });
    setNewBranchName("");
    setNewBranchWhatsapp("");
    toast.success("Branch added");
  };

  const handleUpdateBranch = (id: string, patch: Partial<Branch>) => {
    updateBranch(id, patch);
  };

  const handleDeleteBranch = (id: string) => {
    if (branches.length <= 1) {
      toast.error("At least one branch is required");
      return;
    }

    deleteBranch(id);
    toast.success("Branch deleted");
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
          <p className="mt-1 text-[11px] text-muted-foreground">
            Used as fallback. Each branch can override this number below.
          </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button onClick={handleSave} className="bg-[#22c55e] hover:bg-[#16a34a] text-white w-full">
            Save Settings
          </Button>
          <Button onClick={handleExportBackup} variant="outline" className="w-full">
            Export Backup (JSON)
          </Button>
        </div>

        <div className="pt-3 border-t border-border space-y-3">
          <h3 className="font-heading text-lg text-foreground">Branches</h3>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Branch</label>
            <select
              value={currentBranchId}
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-muted px-3 text-sm text-foreground"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {branches.map((branch) => (
              <div key={branch.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <Input
                    value={branch.name}
                    onChange={(e) => handleUpdateBranch(branch.id, { name: e.target.value })}
                    className="bg-muted border-border"
                    placeholder="Branch name"
                  />
                  <Input
                    value={branch.whatsappNumber}
                    onChange={(e) => handleUpdateBranch(branch.id, { whatsappNumber: e.target.value })}
                    className="bg-muted border-border"
                    placeholder="WhatsApp number"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeleteBranch(branch.id)}
                    disabled={branches.length <= 1}
                    className="text-destructive border-destructive/40"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <Input
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="bg-muted border-border"
              placeholder="New branch name"
            />
            <Input
              value={newBranchWhatsapp}
              onChange={(e) => setNewBranchWhatsapp(e.target.value)}
              className="bg-muted border-border"
              placeholder="New branch WhatsApp"
            />
            <Button type="button" onClick={handleAddBranch}>
              Add Branch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
