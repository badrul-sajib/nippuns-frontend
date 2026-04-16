import { useState } from "react";
import { X } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { settings } = useSettings();

  const phoneNumber = (settings.whatsapp_number || "").replace(/[^0-9]/g, "");
  if (!phoneNumber) return null;

  const message = encodeURIComponent(settings.whatsapp_message || "");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2">
      {showTooltip && (
        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-lg border border-border/40 animate-in fade-in slide-in-from-right-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Live Chat On WhatsApp</span>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.012-3.178 2.278-.852.18-1.964.324-5.71-1.228-4.796-1.986-7.882-6.85-8.12-7.168-.23-.318-1.876-2.498-1.876-4.764s1.188-3.38 1.608-3.842c.42-.462.918-.578 1.224-.578.306 0 .612.002.878.016.282.014.662-.108.036 1.59-.224.608-1.264 3.086-1.376 3.31-.112.226-.186.488-.036.788.15.3.672 1.102 1.444 1.786 1.422 1.258 2.62 1.648 2.992 1.832.374.184.592.154.81-.092.218-.248.928-1.08 1.176-1.454.246-.372.494-.31.832-.186.34.124 2.148 1.014 2.516 1.198.37.184.616.276.706.43.092.154.092.892-.298 1.99z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
