import { useState } from "react";
import { useStore, MenuCategory } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminCategories = () => {
  const { categories, items, addCategory, updateCategory, deleteCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", labelAr: "", icon: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditingId(null); setForm({ label: "", labelAr: "", icon: "" }); setModalOpen(true); };
  const openEdit = (c: MenuCategory) => { setEditingId(c.id); setForm({ label: c.label, labelAr: c.labelAr || "", icon: c.icon }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.label) return;
    if (editingId) updateCategory(editingId, form);
    else addCategory(form);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-heading text-xl text-foreground">Categories</h2>
        <Button onClick={openAdd} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 gap-2 shadow-[0_0_15px_hsl(40_40%_55%/0.3)] w-full sm:w-auto">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 p-4 rounded-xl bg-card border border-border">
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1 min-w-[180px]">
                <p className="text-foreground font-medium">{cat.label}</p>
                {cat.labelAr && <p className="text-muted-foreground text-xs font-arabic" dir="rtl">{cat.labelAr}</p>}
              </div>
              <span className="text-muted-foreground text-sm mr-auto sm:mr-0">{count} items</span>
              <div className="flex items-center gap-3">
                <button onClick={() => openEdit(cat)} className="text-secondary hover:text-secondary/80"><Pencil size={14} /></button>
                <button onClick={() => setDeleteId(cat.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold">{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name (English)</label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="bg-muted border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name (Arabic)</label>
              <Input value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} className="bg-muted border-border" dir="rtl" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Emoji Icon</label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="bg-muted border-border" placeholder="☕" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white">Save</Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>All items in this category will also be deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteCategory(deleteId); setDeleteId(null); }} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
