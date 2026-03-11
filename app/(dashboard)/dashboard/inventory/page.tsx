import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryAddForm } from "./inventory-add-form";
import { InventoryRow } from "./inventory-row";

export default async function InventoryPage() {
  await requireRole(["secretary", "admin"]);
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select("id, name, quantity, unit, notes, updated_at")
    .order("name");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">מלאי וציוד</h1>
      <p className="text-muted-foreground">טבלת מלאי מחסן המטה.</p>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">פריטי מלאי</CardTitle>
            <CardDescription>הוספה ועדכון כמות</CardDescription>
          </div>
          <InventoryAddForm />
        </CardHeader>
        <CardContent>
          {!items?.length ? (
            <p className="text-muted-foreground">אין פריטים במלאי.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pe-2 font-medium">שם</th>
                    <th className="pb-2 pe-2 font-medium">כמות</th>
                    <th className="pb-2 pe-2 font-medium">יחידה</th>
                    <th className="pb-2 pe-2 font-medium">הערות</th>
                    <th className="pb-2 pe-2 font-medium">עדכון</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <InventoryRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
