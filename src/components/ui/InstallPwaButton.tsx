import { useEffect, useState, useRef } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const promptReceivedRef = useRef(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      promptReceivedRef.current = true;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback: show button for PWA-capable browsers that don't fire
    // beforeinstallprompt (Firefox, Safari, etc.)
    const timeout = setTimeout(() => {
      if (!promptReceivedRef.current && 'serviceWorker' in navigator) {
        setIsInstallable(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timeout);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      toast(
        'Open browser menu → "Install Lumea App" or "Add to Home Screen"',
        { icon: 'ℹ️', duration: 5000 }
      );
    }
  };

  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold transition-all hover:bg-zinc-800 dark:hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-500/10 border border-zinc-800 dark:border-zinc-200"
      title="Install Lumea App"
    >
      <Download size={20} />
      <span>Install App</span>
    </button>
  );
}
