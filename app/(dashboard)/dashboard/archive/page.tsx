import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ArchivePage() {
  await requireRole(["content_manager", "admin"]);
  const supabase = await createClient();
  const { data: materials } = await supabase
    .from("content_materials")
    .select("id, title, file_url, category, created_at")
    .order("created_at", { ascending: false });

  const byCategory = (materials ?? []).reduce<Record<string, { id: string; title: string; file_url: string; created_at: string }[]>>((acc, m) => {
    const cat = m.category || "כללי";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ id: m.id, title: m.title, file_url: m.file_url, created_at: m.created_at });
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">ארכיון תוכן</h1>
      <p className="text-muted-foreground">חומרי פעילות לפי קטגוריה.</p>

      {Object.keys(byCategory).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">אין חומרים בארכיון.</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(byCategory).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
              <CardDescription>{items.length} פריטים</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {items.map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                    <span className="font-medium">{m.title}</span>
                    <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">
                      הורדה
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
