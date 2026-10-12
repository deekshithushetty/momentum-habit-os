import { useEffect, useState } from 'react';

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [standalone, setStandalone] = useState(window.matchMedia('(display-mode: standalone)').matches);
  useEffect(() => {
    const beforeInstall = event => {
      event.preventDefault();
      setPrompt(event);
    };
    const installed = () => setStandalone(true);
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);
  const install = async () => {
    if (!prompt) return false;
    prompt.prompt();
    const result = await prompt.userChoice;
    setPrompt(null);
    return result.outcome === 'accepted';
  };
  return { canInstall: Boolean(prompt), standalone, install };
}
