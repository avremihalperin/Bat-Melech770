import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BranchDocumentUploadForm } from "./branch-document-upload-form";

export default async function ContentPage() {
  const branchId = await requireBranch();
  const supabase = await createClient();

  const [
    { data: materials },
    { data: branchDocs },
  ] = await Promise.all([
    supabase.from("content_materials").select("id, title, file_url, category, created_at").order("created_at", { ascending: false }),
    supabase.from("branch_documents").select("id, name, file_url, document_type, category, created_at").eq("branch_id", branchId).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">תוכן וארכיון</h1>
      <p className="text-muted-foreground">הורדת חומרי פעילות, ארכיון סניף, העלאת תמונות.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">חומרי פעילות מהמשרד</CardTitle>
          <CardDescription>מערכים, דפי משימה וחומרי עזר — להורדה</CardDescription>
        </CardHeader>
        <CardContent>
          {!materials?.length ? (
            <p className="text-muted-foreground">אין חומרים זמינים כרגע.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {materials.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2">
                  <span className="font-medium">{m.title}</span>
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">
                    הורדה
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">ארכיון הסניף / העלאת תמונות</CardTitle>
            <CardDescription>מסמכים ותמונות של הסניף לשיתוף המטה</CardDescription>
          </div>
          <BranchDocumentUploadForm branchId={branchId} />
        </CardHeader>
        <CardContent>
          {!branchDocs?.length ? (
            <p className="text-muted-foreground">אין מסמכים או תמונות שהועלו.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {branchDocs.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2">
                  <span>{d.name}</span>
                  <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">
                    צפייה
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
