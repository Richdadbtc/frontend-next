import './globals.css';

export const metadata = {
  title: 'Aurum Vault',
  description: 'Buy, store, and grow real allocated gold from $1,000. An international gold investment platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
