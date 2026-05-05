import { useState, useEffect, useRef } from 'react';
import api from '../api.js';

export function useJobPoller(jobId) {
  const [job, setJob] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const { data } = await api.get(`/api/status/${jobId}`);
        setJob(data);
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(intervalRef.current);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => clearInterval(intervalRef.current);
  }, [jobId]);

  return job;
}
