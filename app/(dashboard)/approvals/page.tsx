import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApproveRejectButtons } from "./approve-reject-buttons";

const ROLE_LABELS: Record<string, string> = {
  branch_center: "מרכזת סניף",
  secretary: "מזכירה",
  branch_supervisor: "אחראית סניפים",
  content_manager: "אחראית תוכן",
  admin: "מנהלת",
  safety_officer: "אחראית בטיחות",
};

export default async function ApprovalsPage() {
  const profile = await requireRole(["secretary", "admin"]);
  const supabase = await createClient();

  const isSecretary = profile.role === "secretary";
  const pendingRoles = isSecretary
    ? ["branch_center"]
    : ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer"];

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, full_name, family_name, email, role, branch_id, branch:branches(name)")
    .eq("approval_status", "pending")
    .in("role", pendingRoles)
    .order("created_at", { ascending: false });

  const title = isSecretary
    ? "בקשות הצטרפות ממתינות (רכזות סניפים)"
    : "בקשות הצטרפות ממתינות (צוות מטה)";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-primary text-2xl font-bold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>רשימת ממתינים</CardTitle>
          <CardDescription>
            {isSecretary
              ? "אשרי או דחי בקשת הצטרפות של מרכזת סניף."
              : "אשרי או דחי בקשת הצטרפות של צוות מטה."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pending?.length ? (
            <p className="text-muted-foreground">אין בקשות ממתינות.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {pending.map((p) => {
                const branch = Array.isArray(p.branch) ? p.branch[0] : p.branch;
                return (
                  <li
                    key={p.id}
                    className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {p.full_name} {p.family_name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {p.email} · {ROLE_LABELS[p.role] ?? p.role}
                        {branch && "name" in branch && ` · ${branch.name}`}
                      </p>
                    </div>
                    <ApproveRejectButtons profileId={p.id} />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
