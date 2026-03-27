import { useState } from "react";
import { useStore, MenuItem } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const emptyForm = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: 0,
  image: "",
  categoryId: "",
  bestSeller: false,
  available: true,
};

const AdminMenuItems = () => {
  const { items, categories, addItem, updateItem, deleteItem } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setForm({ ...form, image: result });
      toast.success("Image uploaded");
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      nameAr: item.nameAr,
      description: item.description || "",
      descriptionAr: item.descriptionAr || "",
      price: item.price,
      image: item.image || "",
      categoryId: item.categoryId,
      bestSeller: item.bestSeller || false,
      available: item.available !== false,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const name = form.name.trim() || form.nameAr.trim();
    const nameAr = form.nameAr.trim() || form.name.trim();
    const categoryId = form.categoryId || categories[0]?.id;

    if (!name) {
      toast.error("Please enter at least one item name");
      return;
    }

    if (!categoryId) {
      toast.error("Please add a category first");
      return;
    }

    const payload = {
      ...form,
      name,
      nameAr,
      categoryId,
      description: form.description.trim(),
      descriptionAr: form.descriptionAr.trim(),
      price: Number.isFinite(form.price) ? form.price : 0,
    };

    if (editingId) {
      updateItem(editingId, payload);
      toast.success("Item updated");
    } else {
      addItem(payload);
      toast.success("Item added");
    }
    setModalOpen(false);
  };

  const getCategoryLabel = (id: string) => categories.find((c) => c.id === id)?.label || "—";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-heading text-xl text-foreground">Menu Items</h2>
        <Button onClick={openAdd} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2 shadow-[0_0_15px_hsl(40_40%_55%/0.3)] w-full sm:w-auto">
          <Plus size={16} /> Add New Item
        </Button>
      </div>

      <div className="space-y-3 xl:hidden">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-foreground font-medium">{item.name}</span>
                {item.bestSeller && <span className="ml-2 text-accent text-xs">⚡</span>}
                <p className="text-muted-foreground text-xs font-arabic" dir="rtl">{item.nameAr}</p>
              </div>
              <span className="price-badge text-xs whitespace-nowrap">{item.price} EGP</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground">{getCategoryLabel(item.categoryId)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Available</span>
                <Switch
                  checked={item.available !== false}
                  onCheckedChange={(v) => updateItem(item.id, { available: v })}
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => openEdit(item)} className="text-secondary hover:text-secondary/80"><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(item.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden hidden xl:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left p-3">Item</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/10 transition-colors">
                  <td className="p-3">
                    <div>
                      <span className="text-foreground font-medium">{item.name}</span>
                      {item.bestSeller && <span className="ml-2 text-accent text-xs">⚡</span>}
                    </div>
                    <span className="text-muted-foreground text-xs font-arabic" dir="rtl">{item.nameAr}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{getCategoryLabel(item.categoryId)}</td>
                  <td className="p-3"><span className="price-badge text-xs">{item.price} EGP</span></td>
                  <td className="p-3">
                    <Switch
                      checked={item.available !== false}
                      onCheckedChange={(v) => updateItem(item.id, { available: v })}
                    />
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="text-secondary hover:text-secondary/80"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold">{editingId ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name (English)</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-muted border-border" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name (Arabic)</label>
                <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="bg-muted border-border" dir="rtl" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full h-10 rounded-md border border-border bg-muted px-3 text-sm text-foreground"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price (EGP)</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-muted border-border" rows={2} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Product Image</label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-secondary/50 transition-colors text-center">
                    <Upload size={16} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload image</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.image && (
                  <button
                    onClick={() => setForm({ ...form, image: "" })}
                    className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {form.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img src={form.image} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} /> Available
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Switch checked={form.bestSeller} onCheckedChange={(v) => setForm({ ...form, bestSeller: v })} /> Best Seller ⚡
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white">Save</Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMenuItems;
