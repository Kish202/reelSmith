import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Processing from './components/Processing.jsx';
import Results from './pages/Results.jsx';
import { useJobPoller } from './hooks/useJobPoller.js';

export default function App() {
  const [jobId, setJobId] = useState(null);
  const job = useJobPoller(jobId);

  const handleReset = () => setJobId(null);

  const view = !jobId
    ? 'hero'
    : job?.status === 'done'
    ? 'results'
    : job?.status === 'error'
    ? 'error'
    : 'processing';

  return (
    <div className="min-h-screen bg-forge-bg">
      <Navbar />

      {view === 'hero' && <Hero onJobStart={setJobId} />}

      {view === 'processing' && <Processing job={job} />}

      {view === 'results' && <Results job={job} onReset={handleReset} />}

      {view === 'error' && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <div className="text-center max-w-md">
            <h2 className="font-display text-5xl tracking-wider text-red-400 mb-4">ERROR</h2>
            <p className="font-mono text-sm text-forge-sub mb-8">{job?.error || 'Something went wrong'}</p>
            <button onClick={handleReset} className="btn-primary">Try again</button>
          </div>
        </section>
      )}
    </div>
  );
}
