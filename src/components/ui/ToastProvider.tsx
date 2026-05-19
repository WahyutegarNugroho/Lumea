import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right" 
      toastOptions={{
        className: 'font-outfit font-bold rounded-2xl shadow-xl',
        duration: 3000,
        style: {
          background: '#18181b', // zinc-900
          color: '#fff',
        }
      }}
    />
  );
}
