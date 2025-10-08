import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Verb } from "@/data/verbs";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface VerbListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verbs: Verb[];
  onSave: (verbs: Verb[]) => void;
}

export const VerbListDialog = ({ open, onOpenChange, verbs, onSave }: VerbListDialogProps) => {
  const [editedVerbs, setEditedVerbs] = useState<Verb[]>(verbs);

  const addVerb = () => {
    setEditedVerbs([...editedVerbs, { present: "", past: "", isRegular: true }]);
  };

  const removeVerb = (index: number) => {
    setEditedVerbs(editedVerbs.filter((_, i) => i !== index));
  };

  const updateVerb = (index: number, field: keyof Verb, value: string | boolean) => {
    const updated = [...editedVerbs];
    updated[index] = { ...updated[index], [field]: value };
    setEditedVerbs(updated);
  };

  const handleSave = () => {
    const validVerbs = editedVerbs.filter(v => v.present.trim() && v.past.trim());
    
    if (validVerbs.length < 25) {
      toast.error("You need at least 25 verbs to play!");
      return;
    }

    onSave(validVerbs);
    toast.success("Verb list updated!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Customize Verb List</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Total verbs: {editedVerbs.length} (minimum 25 required)
            </p>
            <Button onClick={addVerb} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Verb
            </Button>
          </div>

          <div className="space-y-3">
            {editedVerbs.map((verb, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label htmlFor={`present-${index}`} className="text-xs">
                    Present
                  </Label>
                  <Input
                    id={`present-${index}`}
                    value={verb.present}
                    onChange={e => updateVerb(index, "present", e.target.value)}
                    placeholder="walk"
                  />
                </div>
                <div className="col-span-5">
                  <Label htmlFor={`past-${index}`} className="text-xs">
                    Past
                  </Label>
                  <Input
                    id={`past-${index}`}
                    value={verb.past}
                    onChange={e => updateVerb(index, "past", e.target.value)}
                    placeholder="walked"
                  />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs block text-center">Reg</Label>
                  <input
                    type="checkbox"
                    checked={verb.isRegular}
                    onChange={e => updateVerb(index, "isRegular", e.target.checked)}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    onClick={() => removeVerb(index)}
                    variant="outline"
                    size="icon"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
