import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

type CmsPage = { id: string; title: string; identifier: string; content: string; is_active: boolean };

export default function CmsPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [title, setTitle] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [content, setContent] = useState("");

  const add = () => {
    if (!title.trim() || !identifier.trim()) {
      toast.error("Title and identifier are required");
      return;
    }
    const id = `${Date.now()}`;
    setPages(prev => [{ id, title, identifier, content, is_active: true }, ...prev]);
    setTitle(""); setIdentifier(""); setContent("");
    toast.success("Page created (local). Backend save to be connected.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pages</h2>
      <Card className="p-4 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs">Identifier</label>
            <Input value={identifier} onChange={e => setIdentifier(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs">Content</label>
          <Textarea rows={6} value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <Button onClick={add}>Add Page</Button>
      </Card>

      <Card className="p-0 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Identifier</th>
              <th className="text-left px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>
                  No pages yet. Add one above.
                </td>
              </tr>
            ) : (
              pages.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">{p.identifier}</td>
                  <td className="px-4 py-2">{p.is_active ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


