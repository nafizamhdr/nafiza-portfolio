export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="container-tight flex items-center justify-center text-[11px] text-white/40 font-semibold tracking-[0.22em] uppercase">
        © {year} Nafiza Mahadri Portfolio
      </div>
    </footer>
  );
}
