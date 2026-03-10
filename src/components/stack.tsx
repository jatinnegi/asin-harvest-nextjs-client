export function HStack({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex gap-1 sm:gap-2">{children}</div>;
}
