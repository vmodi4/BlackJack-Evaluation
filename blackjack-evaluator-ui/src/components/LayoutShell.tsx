type Props = {
  children: React.ReactNode;
};

export function LayoutShell({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 my-8 w-full max-w-5xl rounded-3xl bg-emerald-950/70 p-6 shadow-xl ring-1 ring-emerald-700/60">
        {children}
      </div>
    </div>
  );
}

