import Image from "next/image";
import Link from "next/link";

/**
 * Layout לאזור ההתחברות וההרשמה — ללא סרגל צד, ממורכז, רקע צבעוני.
 * לוגואים קטנים למעלה בצד.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-background to-accent/10 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
      <Link
        href="/login"
        className="absolute start-4 top-4 flex items-center gap-2 rounded-lg bg-white/95 px-2 py-1.5 shadow-sm ring-1 ring-primary/10"
      >
        <span className="flex items-center rounded bg-white px-1 py-0.5">
          <Image
            src="/logo-bat-melech.png"
            alt=""
            width={48}
            height={34}
            className="h-8 w-12 object-contain object-center"
            style={{ backgroundColor: "white" }}
          />
        </span>
        <Image
          src="/logo-chabad-youth.png"
          alt=""
          width={44}
          height={34}
          className="h-8 w-11 object-contain"
        />
      </Link>
      {children}
    </div>
  );
}
