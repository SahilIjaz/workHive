import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'FlowSpace - Multi-tenant Task Management',
  description: 'Manage projects and tasks across your organization',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
