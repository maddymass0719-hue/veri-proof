
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  Shield, FilePlus, Search, History as HistoryIcon, CheckCircle, Menu, X, 
  Upload, File, Check, Download, Copy, RefreshCw, 
  AlertCircle, CheckCircle2, XCircle, Lock, Trash2, Calendar, Hash, Info, ExternalLink, Files
} from 'lucide-react';

// --- Types ---
interface ProofEntry {
  id: string;
  fileName: string;
  fileSize: number;
  hash: string;
  timestamp: number;
  description?: string;
  status: 'verified' | 'tampered' | 'original';
}

// --- Utils ---
async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateTextHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// --- UI Components ---

const NavItem = ({ to, icon: Icon, label, active, onClick }: { to: string; icon: any; label: string; active: boolean; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-semibold ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' 
        : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </Link>
);

// --- Sub-Pages ---

const HomeView = () => (
  <div className="animate-slide-up">
    <section className="bg-indigo-700 text-white py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 space-y-8 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Digital Proof <br /><span className="text-indigo-200">Simplified.</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
            Verify the integrity of any file using cryptographic fingerprints. Professional, secure, and fast.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 justify-center md:justify-start">
            <Link to="/create" className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center space-x-3 shadow-2xl hover:scale-105 active:scale-95">
              <FilePlus className="w-5 h-5" />
              <span>Generate Proof</span>
            </Link>
            <Link to="/verify" className="bg-indigo-600/50 backdrop-blur-md text-white border border-indigo-400/50 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-500/50 transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95">
              <Search className="w-5 h-5" />
              <span>Verify Now</span>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center scale-90 md:scale-110">
           <div className="bg-white/10 glass p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/20">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-6 font-mono text-xs md:text-sm text-indigo-100">
                 <p className="opacity-70 flex items-center gap-2"><Lock className="w-3 h-3" /> Initializing AES-NI engine...</p>
                 <p className="text-indigo-300">$ hashing protocol v2.5.0</p>
                 <div className="bg-black/20 p-5 rounded-2xl border border-white/10 break-all leading-relaxed">
                   <p className="text-white">ID: PRF-92X1-AZ</p>
                   <p className="text-green-300 font-bold mt-2 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> AUTHENTICATED
                   </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 -mr-32 -mt-32"></div>
    </section>

    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: Shield, title: "SHA-256 Protocol", desc: "We use the same cryptographic standard that secures global financial systems." },
          { icon: Lock, title: "100% Client-Side", desc: "Your files never leave your computer. We process everything locally in your browser." },
          { icon: HistoryIcon, title: "Archive Records", desc: "Keep a personal, locally stored history of every proof you've ever generated." }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="bg-white w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform shadow-sm">
              <feat.icon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feat.title}</h3>
            <p className="text-slate-500 leading-relaxed text-lg">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const CreateView = ({ onProofCreated }: { onProofCreated: (e: ProofEntry) => void }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProofEntry | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const hash = activeTab === 'file' ? await generateFileHash(file!) : await generateTextHash(text);
      const entry: ProofEntry = {
        id: `PRF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        fileName: activeTab === 'file' ? file!.name : 'Snippet-' + Date.now().toString().slice(-4),
        fileSize: activeTab === 'file' ? file!.size : new TextEncoder().encode(text).length,
        hash,
        timestamp: Date.now(),
        description,
        status: 'original'
      };
      setResult(entry);
      onProofCreated(entry);
    } catch (e) {
      alert("Error generating proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-slide-up">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 text-center space-y-10">
          <div className="mx-auto w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
            <Check className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Proof Established</h2>
            <p className="text-slate-400 text-lg">Record securely added to your local archive.</p>
          </div>
          <div className="bg-slate-50 rounded-[2rem] p-10 text-left space-y-6 border border-slate-100">
            <div className="grid grid-cols-2 gap-8">
              <div><p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Proof ID</p><p className="font-extrabold text-xl text-slate-900">{result.id}</p></div>
              <div><p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Certified On</p><p className="font-extrabold text-xl text-slate-900">{new Date(result.timestamp).toLocaleDateString()}</p></div>
            </div>
            <hr className="border-slate-200" />
            <div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-3">SHA-256 Signature</p>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 font-mono text-sm break-all text-indigo-600 shadow-sm select-all">
                {result.hash}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => {
                const content = `VERIPROOF SECURITY CERTIFICATE\n\nID: ${result.id}\nFile: ${result.fileName}\nHash: ${result.hash}\nDate: ${new Date(result.timestamp).toLocaleString()}`;
                const blob = new Blob([content], {type: 'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `Proof-${result.id}.txt`; a.click();
              }}
              className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            <button onClick={() => setResult(null)} className="bg-white border-2 border-slate-200 text-slate-600 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Start New Proof
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-slide-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Create Proof</h1>
        <p className="text-slate-500 text-lg font-medium">Generate a cryptographic fingerprint for your asset.</p>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex bg-slate-50 p-2 m-4 rounded-2xl">
          <button onClick={() => setActiveTab('file')} className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${activeTab === 'file' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>File Upload</button>
          <button onClick={() => setActiveTab('text')} className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all ${activeTab === 'text' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}>Paste Text</button>
        </div>
        <div className="p-10 pt-4 space-y-8">
          {activeTab === 'file' ? (
            <div className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all cursor-pointer ${file ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
              {!file ? (
                <label className="cursor-pointer space-y-6 flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center"><Upload className="w-10 h-10" /></div>
                  <div className="space-y-2"><p className="text-indigo-600 font-bold text-xl">Upload Asset</p><p className="text-slate-400">PDF, JPG, ZIP, DOC (Local processing)</p></div>
                  <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              ) : (
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg">
                  <div className="flex items-center space-x-5">
                    <div className="bg-indigo-600 p-4 rounded-xl text-white"><File className="w-7 h-7" /></div>
                    <div className="text-left"><p className="font-extrabold text-slate-900 truncate max-w-[200px]">{file.name}</p><p className="text-sm text-slate-400">{formatBytes(file.size)}</p></div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full"><X className="w-6 h-6" /></button>
                </div>
              )}
            </div>
          ) : (
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text content here..." className="w-full h-56 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-lg" />
          )}
          <div className="space-y-3">
            <label className="block font-bold text-slate-700 ml-2">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Q4 Legal Agreement v2" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium" />
          </div>
          <button onClick={handleCreate} disabled={loading || (activeTab === 'file' ? !file : !text.trim())} className="w-full py-6 rounded-2xl font-bold text-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.98]">
            {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
            <span>{loading ? 'Hashing...' : 'Generate Proof'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyView = ({ history }: { history: ProofEntry[] }) => {
  const [file, setFile] = useState<File | null>(null);
  const [inputHash, setInputHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{ status: 'verified' | 'tampered' | 'not-found'; match?: ProofEntry } | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    try {
      const hash = file ? await generateFileHash(file) : inputHash.trim().toLowerCase();
      const match = history.find(p => p.hash === hash);
      if (match) setResult({ status: 'verified', match });
      else if (file && history.find(p => p.fileName === file.name)) setResult({ status: 'tampered', match: history.find(p => p.fileName === file.name) });
      else setResult({ status: 'not-found' });
    } finally {
      setVerifying(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <div className="text-center bg-white p-16 rounded-[3rem] shadow-2xl space-y-8 border border-slate-100">
          <div className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full shadow-lg ${result.status === 'verified' ? 'bg-green-100 text-green-600' : result.status === 'tampered' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
            {result.status === 'verified' ? <CheckCircle2 className="w-14 h-14" /> : result.status === 'tampered' ? <XCircle className="w-14 h-14" /> : <AlertCircle className="w-14 h-14" />}
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight">{result.status === 'verified' ? 'Authentic Asset' : result.status === 'tampered' ? 'Tampered Version' : 'No Record Found'}</h2>
            <p className="text-slate-500 text-xl max-w-lg mx-auto leading-relaxed">{result.status === 'verified' ? 'The file matches its original proof fingerprint perfectly.' : result.status === 'tampered' ? 'The file name matches an archive record, but the data has been altered.' : 'This signature does not exist in your local proof archive.'}</p>
          </div>
          <button onClick={() => {setResult(null); setFile(null); setInputHash('');}} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all">Verify Another Asset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
      <div className="text-center mb-16"><h1 className="text-4xl font-extrabold text-slate-900 mb-4">Verification Center</h1><p className="text-slate-500 text-lg font-medium">Analyze an existing file against your secure signature history.</p></div>
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-10 border border-slate-100">
        <div className="border-2 border-dashed rounded-[2rem] p-16 text-center bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer">
          <label className="cursor-pointer space-y-6 flex flex-col items-center">
            <Upload className="w-12 h-12 text-indigo-400" />
            <span className="text-indigo-600 font-extrabold text-xl">{file ? file.name : 'Choose file to verify integrity'}</span>
            <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="relative flex items-center"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink mx-6 text-xs font-black text-slate-300 uppercase tracking-[0.2em]">OR PROVIDE HASH</span><div className="flex-grow border-t border-slate-200"></div></div>
        <input type="text" value={inputHash} onChange={e => setInputHash(e.target.value)} placeholder="Paste SHA-256 string here..." className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" />
        <button onClick={handleVerify} disabled={verifying || (!file && !inputHash.trim())} className="w-full py-6 rounded-2xl font-bold text-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all">{verifying ? <RefreshCw className="animate-spin w-6 h-6" /> : <Search className="w-6 h-6" />}<span>{verifying ? 'Scanning Archive...' : 'Verify Authenticity'}</span></button>
      </div>
    </div>
  );
};

const HistoryView = ({ history, setHistory }: { history: ProofEntry[], setHistory: (h: ProofEntry[]) => void }) => {
  const [search, setSearch] = useState('');
  const filtered = history.filter(h => h.fileName.toLowerCase().includes(search.toLowerCase()) || h.id.includes(search.toUpperCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
        <div><h1 className="text-4xl font-extrabold text-slate-900 mb-2">Proof Archive</h1><p className="text-slate-500 text-lg font-medium">Your locally stored ledger of digital proofs.</p></div>
        <div className="relative w-full md:w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all" /></div>
      </div>
      {filtered.length > 0 ? (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100"><th className="px-8 py-6">Asset & ID</th><th className="px-8 py-6">SHA-256 Signature</th><th className="px-8 py-6">Timestamp</th><th className="px-8 py-6 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-50">{filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-8 py-6"><div className="flex items-center space-x-4"><div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><File className="w-5 h-5" /></div><div><p className="font-extrabold text-slate-900 truncate max-w-[180px]">{entry.fileName}</p><p className="text-xs text-slate-400 font-bold">#{entry.id}</p></div></div></td>
                <td className="px-8 py-6"><p className="font-mono text-[10px] bg-slate-50 p-2.5 rounded-lg text-indigo-600 truncate max-w-[200px] shadow-inner">{entry.hash}</p></td>
                <td className="px-8 py-6"><span className="text-sm font-bold text-slate-700">{new Date(entry.timestamp).toLocaleDateString()}</span></td>
                <td className="px-8 py-6 text-right"><button onClick={() => { if (confirm('Permanently delete this proof?')) setHistory(history.filter(h => h.id !== entry.id)); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100"><HistoryIcon className="w-20 h-20 text-slate-100 mx-auto mb-6" /><h3 className="text-2xl font-extrabold text-slate-300">Archive Empty</h3></div>
      )}
    </div>
  );
};

const CompareView = () => {
  const [activeTab, setActiveTab] = useState<'hash' | 'file'>('hash');
  const [h1, setH1] = useState('');
  const [h2, setH2] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileHashes, setFileHashes] = useState({ h1: '', h2: '' });

  const hashMatch = useMemo(() => h1 && h2 && h1.trim().toLowerCase() === h2.trim().toLowerCase(), [h1, h2]);
  const filesMatch = useMemo(() => fileHashes.h1 && fileHashes.h2 && fileHashes.h1 === fileHashes.h2, [fileHashes]);

  const handleCompareFiles = async () => {
    if (!file1 || !file2) return;
    setLoading(true);
    try {
      const res1 = await generateFileHash(file1);
      const res2 = await generateFileHash(file2);
      setFileHashes({ h1: res1, h2: res2 });
    } catch (e) {
      alert("Error processing files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Secure Comparer</h1>
        <p className="text-slate-500 text-lg">Mathematically verify if two items are identical.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mb-12">
        <div className="flex bg-slate-50 p-2 m-4 rounded-2xl">
          <button 
            onClick={() => setActiveTab('hash')} 
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'hash' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Hash className="w-4 h-4" />
            <span>Compare Hashes</span>
          </button>
          <button 
            onClick={() => setActiveTab('file')} 
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'file' ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Files className="w-4 h-4" />
            <span>Compare Files</span>
          </button>
        </div>

        <div className="p-10 pt-4">
          {activeTab === 'hash' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="font-bold text-slate-700 ml-2 block">First Hash</label>
                <textarea value={h1} onChange={e => setH1(e.target.value)} placeholder="Paste hash 1..." className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm" />
              </div>
              <div className="space-y-4">
                <label className="font-bold text-slate-700 ml-2 block">Second Hash</label>
                <textarea value={h2} onChange={e => setH2(e.target.value)} placeholder="Paste hash 2..." className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm" />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${file1 ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                  {!file1 ? (
                    <label className="cursor-pointer space-y-4 flex flex-col items-center">
                      <Upload className="w-10 h-10 text-indigo-400" />
                      <span className="text-indigo-600 font-bold">First File</span>
                      <input type="file" className="hidden" onChange={e => {setFile1(e.target.files?.[0] || null); setFileHashes(prev => ({...prev, h1: ''}));}} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-indigo-100">
                      <div className="text-left truncate max-w-[150px] font-bold text-slate-700">{file1.name}</div>
                      <button onClick={() => {setFile1(null); setFileHashes(prev => ({...prev, h1: ''}));}}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
                    </div>
                  )}
                </div>
                <div className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${file2 ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                  {!file2 ? (
                    <label className="cursor-pointer space-y-4 flex flex-col items-center">
                      <Upload className="w-10 h-10 text-indigo-400" />
                      <span className="text-indigo-600 font-bold">Second File</span>
                      <input type="file" className="hidden" onChange={e => {setFile2(e.target.files?.[0] || null); setFileHashes(prev => ({...prev, h2: ''}));}} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-indigo-100">
                      <div className="text-left truncate max-w-[150px] font-bold text-slate-700">{file2.name}</div>
                      <button onClick={() => {setFile2(null); setFileHashes(prev => ({...prev, h2: ''}));}}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleCompareFiles} 
                disabled={!file1 || !file2 || loading}
                className="w-full py-5 rounded-2xl font-bold text-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all disabled:bg-slate-200"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Shield className="w-5 h-5" />}
                <span>{loading ? 'Processing Files...' : 'Run Mathematical Comparison'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {activeTab === 'hash' ? (
          (!h1 || !h2) ? <div className="px-10 py-6 bg-slate-100 text-slate-400 rounded-3xl font-black tracking-widest uppercase">Waiting for input</div> :
          hashMatch ? <div className="px-12 py-8 bg-green-500 text-white rounded-[2.5rem] font-black text-3xl shadow-2xl flex items-center gap-5 scale-110 animate-bounce"><CheckCircle2 className="w-10 h-10" /><span>EXACT MATCH</span></div> :
          <div className="px-12 py-8 bg-red-500 text-white rounded-[2.5rem] font-black text-3xl shadow-2xl flex items-center gap-5"><XCircle className="w-10 h-10" /><span>MISMATCH</span></div>
        ) : (
          (!fileHashes.h1 || !fileHashes.h2) ? <div className="px-10 py-6 bg-slate-100 text-slate-400 rounded-3xl font-black tracking-widest uppercase">Ready to Compare</div> :
          filesMatch ? <div className="px-12 py-8 bg-green-500 text-white rounded-[2.5rem] font-black text-3xl shadow-2xl flex items-center gap-5 scale-110 animate-bounce"><CheckCircle2 className="w-10 h-10" /><span>FILES IDENTICAL</span></div> :
          <div className="px-12 py-8 bg-red-500 text-white rounded-[2.5rem] font-black text-3xl shadow-2xl flex items-center gap-5"><XCircle className="w-10 h-10" /><span>FILES DIFFER</span></div>
        )}
      </div>

      {activeTab === 'file' && fileHashes.h1 && (
        <div className="mt-16 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-center">Calculated Fingerprints</p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">File 1 Fingerprint</p>
              <div className="bg-white p-4 rounded-xl font-mono text-xs text-indigo-600 border border-slate-200 truncate">{fileHashes.h1}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-2">File 2 Fingerprint</p>
              <div className="bg-white p-4 rounded-xl font-mono text-xs text-indigo-600 border border-slate-200 truncate">{fileHashes.h2}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PublicView = ({ history }: { history: ProofEntry[] }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<ProofEntry | null | undefined>(undefined);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => { setResult(history.find(p => p.id.toUpperCase() === query.trim().toUpperCase()) || null); setSearching(false); }, 600);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-slide-up">
      <div className="text-center mb-16"><h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Public Lookup</h1><p className="text-slate-500 text-xl max-w-xl mx-auto font-medium">Verify shared assets using their unique identifier.</p></div>
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-20">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter ID (e.g. PRF-X92F)" className="w-full pl-8 pr-40 py-7 bg-white border-2 border-slate-200 rounded-[2.5rem] text-2xl font-black shadow-2xl focus:border-indigo-500 outline-none transition-all" />
        <button type="submit" disabled={searching || !query.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-10 py-4 rounded-3xl font-bold text-lg hover:bg-indigo-700 shadow-lg disabled:bg-slate-200 flex items-center gap-3 transition-all">{searching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}<span>{searching ? 'Querying...' : 'Search'}</span></button>
      </form>
      {result ? (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-green-200 overflow-hidden animate-slide-up">
          <div className="bg-green-600 p-12 text-white text-center"><CheckCircle className="w-20 h-20 mx-auto mb-6" /><h2 className="text-4xl font-black mb-2 uppercase">Record Authentic</h2><p className="opacity-90 text-xl font-bold">Verified Security Protocol</p></div>
          <div className="p-12 space-y-10"><div className="grid grid-cols-2 gap-10"><div><p className="text-slate-400 text-xs font-black uppercase mb-2 tracking-widest">Status</p><div className="flex items-center space-x-3 text-green-600 font-black text-xl"><div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div><span>ACTIVE</span></div></div><div><p className="text-slate-400 text-xs font-black uppercase mb-2 tracking-widest">Proof ID</p><p className="text-slate-900 font-black text-2xl">{result.id}</p></div></div><hr /><div><p className="text-slate-400 text-xs font-black uppercase mb-3 tracking-widest">Asset Details</p><p className="text-slate-900 font-extrabold text-xl">{result.fileName}</p><p className="text-slate-500 font-medium">Certified on {new Date(result.timestamp).toLocaleString()}</p></div><div><p className="text-slate-400 text-xs font-black uppercase mb-3 tracking-widest">SHA-256 Fingerprint</p><div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-[11px] break-all text-indigo-700 shadow-inner">{result.hash}</div></div></div>
        </div>
      ) : result === null ? (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-red-100 p-20 text-center animate-slide-up"><XCircle className="w-24 h-24 text-red-300 mx-auto mb-8" /><h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Not Found</h2><p className="text-slate-500 text-xl font-medium">Record ID "{query}" was not found.</p></div>
      ) : null}
    </div>
  );
};

// --- App Shell ---

const App = () => {
  const [history, setHistory] = useState<ProofEntry[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('veriproof_history_v3');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); } }
  }, []);

  const addEntry = (e: ProofEntry) => {
    const updated = [e, ...history];
    setHistory(updated);
    localStorage.setItem('veriproof_history_v3', JSON.stringify(updated));
  };

  const updateHistory = (h: ProofEntry[]) => {
    setHistory(h);
    localStorage.setItem('veriproof_history_v3', JSON.stringify(h));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white/90 glass sticky top-0 z-[100] border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all group-hover:scale-110 group-active:scale-95"><Shield className="w-7 h-7 text-white" /></div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">VeriProof</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <NavItem to="/" icon={Shield} label="Home" active={location.pathname === '/'} />
            <NavItem to="/create" icon={FilePlus} label="Create" active={location.pathname === '/create'} />
            <NavItem to="/verify" icon={Search} label="Verify" active={location.pathname === '/verify'} />
            <NavItem to="/compare" icon={Hash} label="Comparer" active={location.pathname === '/compare'} />
            <NavItem to="/history" icon={HistoryIcon} label="Archive" active={location.pathname === '/history'} />
            <NavItem to="/public" icon={ExternalLink} label="Portal" active={location.pathname === '/public'} />
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all">
            {mobileMenu ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden glass border-t border-slate-100 p-6 space-y-3 animate-slide-up">
            <NavItem to="/" icon={Shield} label="Home" active={location.pathname === '/'} onClick={() => setMobileMenu(false)} />
            <NavItem to="/create" icon={FilePlus} label="Create Proof" active={location.pathname === '/create'} onClick={() => setMobileMenu(false)} />
            <NavItem to="/verify" icon={Search} label="Verify Asset" active={location.pathname === '/verify'} onClick={() => setMobileMenu(false)} />
            <NavItem to="/compare" icon={Hash} label="Hash Comparer" active={location.pathname === '/compare'} onClick={() => setMobileMenu(false)} />
            <NavItem to="/history" icon={HistoryIcon} label="Proof Archive" active={location.pathname === '/history'} onClick={() => setMobileMenu(false)} />
            <NavItem to="/public" icon={ExternalLink} label="Public Portal" active={location.pathname === '/public'} onClick={() => setMobileMenu(false)} />
          </div>
        )}
      </nav>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/create" element={<CreateView onProofCreated={addEntry} />} />
          <Route path="/verify" element={<VerifyView history={history} />} />
          <Route path="/compare" element={<CompareView />} />
          <Route path="/history" element={<HistoryView history={history} setHistory={updateHistory} />} />
          <Route path="/public" element={<PublicView history={history} />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-100 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex items-center justify-center space-x-3 text-2xl font-black tracking-tighter"><Shield className="w-7 h-7 text-indigo-600" /><span>VeriProof</span></div>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">Digital trust, engineered for transparency. No cloud storage, total privacy.</p>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">© 2024 VeriProof • SHA-256 Signature Engine</p>
        </div>
      </footer>
    </div>
  );
};

// --- Mount App ---

const mountPoint = document.getElementById('root');
if (mountPoint) {
  const root = ReactDOM.createRoot(mountPoint);
  root.render(
    <Router>
      <App />
    </Router>
  );
}
