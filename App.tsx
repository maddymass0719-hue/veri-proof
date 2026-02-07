
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, FilePlus, Search, History, CheckCircle, Info, Menu, X, Home, Hash, ExternalLink } from 'lucide-react';
import HomeView from './pages/Home';
import CreateProof from './pages/CreateProof';
import VerifyProof from './pages/VerifyProof';
import HistoryView from './pages/History';
import PublicVerify from './pages/PublicVerify';
import HashComparer from './pages/HashComparer';
import { ProofEntry } from './types';

const NavLink = ({ to, icon: Icon, label, current }: { to: string; icon: any; label: string; current: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      current ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [history, setHistory] = useState<ProofEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('veriproof_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const addProofEntry = (entry: ProofEntry) => {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem('veriproof_history', JSON.stringify(newHistory));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">VeriProof</span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-1">
                <NavContent history={history} />
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-slate-600 p-2"
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 p-4 space-y-2 bg-white">
              <NavContent history={history} mobile onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          )}
        </nav>

        {/* Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/create" element={<CreateProof onProofCreated={addProofEntry} />} />
            <Route path="/verify" element={<VerifyProof history={history} />} />
            <Route path="/history" element={<HistoryView history={history} setHistory={(h) => {
                setHistory(h);
                localStorage.setItem('veriproof_history', JSON.stringify(h));
            }} />} />
            <Route path="/public-verify" element={<PublicVerify history={history} />} />
            <Route path="/compare" element={<HashComparer />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-slate-900">VeriProof</span>
            </div>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Securely verify the integrity of your digital files using advanced SHA-256 cryptographic hashing. 
              We never store your actual files, ensuring total privacy.
            </p>
            <div className="mt-8 pt-8 border-t border-slate-100 text-slate-400 text-xs flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p>© {new Date().getFullYear()} VeriProof. Built for security & transparency.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                <a href="#" className="hover:text-indigo-600">Documentation</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const NavContent = ({ history, mobile, onItemClick }: { history: ProofEntry[], mobile?: boolean, onItemClick?: () => void }) => {
  const location = useLocation();
  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/create', icon: FilePlus, label: 'Create Proof' },
    { to: '/verify', icon: CheckCircle, label: 'Verify File' },
    { to: '/compare', icon: Hash, label: 'Compare Hashes' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/public-verify', icon: ExternalLink, label: 'Public Portal' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onItemClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === link.to
              ? (mobile ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600 text-white')
              : 'text-slate-600 hover:bg-slate-100'
          } ${mobile ? 'w-full' : ''}`}
        >
          <link.icon className="w-5 h-5" />
          <span className="font-medium">{link.label}</span>
        </Link>
      ))}
    </>
  );
};

export default App;
