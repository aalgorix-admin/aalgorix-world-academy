export default function ReportCardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="print:bg-white print:p-0 print:shadow-none">{children}</div>
  );
}
