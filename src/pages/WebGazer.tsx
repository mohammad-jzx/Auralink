import { useEffect } from 'react';

export function WebGazer() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="h-full">
      <iframe
        src="/webgazer/index.html"
        title="WebGazer eye-tracking demo"
        allow="camera; microphone; fullscreen; display-capture"
        allowFullScreen
        className="w-full border-0 min-h-[85vh]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
