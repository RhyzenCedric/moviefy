import Navbar from "../Navbar";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function ResultsLayout({ children }: LayoutProps) {
  return (
    <>
    <Navbar/>
    {children}
    </>
  );
}