export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-11/12 max-w-3xl min-h-screen flex flex-col items-start justify-start py-24 sm:py-24 gap-4 sm:gap-10">
      {children}
    </div>
  );
}
