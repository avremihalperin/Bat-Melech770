"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  if (!visible || !deferredPrompt) return null;

  const onInstallClick = async () => {
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const onDismiss = () => {
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onDismiss}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-sm rounded-t-2xl border border-border bg-background p-4 shadow-lg sm:rounded-2xl">
        <h2 className="mb-2 text-lg font-semibold">התקנת אפליקציית בת מלך</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          אפשר להתקין את המערכת כאפליקציה על המסך הראשי בטלפון, ולהיכנס אליה
          בלחיצה אחת.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onDismiss}
          >
            לא עכשיו
          </Button>
          <Button size="sm" type="button" onClick={onInstallClick}>
            התקן כאפליקציה
          </Button>
        </div>
      </div>
    </div>
  );
}

