export default function MainLayout({
  children,
  details,
}: {
  children: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <div className="App">
      {children}
      {details}
    </div>
  );
}