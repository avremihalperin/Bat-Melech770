/**
 * Layout לאזור ההתחברות וההרשמה — ללא סרגל צד, ממורכז, רקע צבעוני.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-background to-accent/10 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
      {children}
    </div>
  );
}
