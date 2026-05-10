import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 w-full max-w-md bg-white z-50 border-b border-gold/20 h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold tracking-tight italic text-charcoal font-poppins">
          Dove
        </Link>
        <div className="w-px h-5 bg-gold/30"></div>
        <span className="text-[9px] uppercase tracking-widest font-bold text-gold">#FixTheRoot</span>
      </div>
      <nav className="flex gap-4 text-[9px] uppercase tracking-widest font-bold">
        <Link to="/" className="text-gray-400 hover:text-gold transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-gray-400 hover:text-gold transition-colors">
          About #ScalpFokus
        </Link>
        <button onClick={() => window.scrollTo(0, document.body.scrollHeight)} className="text-gray-400 hover:text-gold transition-colors">
          Track Progress
        </button>
      </nav>
    </header>
  );
}