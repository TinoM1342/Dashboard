import { useState } from 'react';
import { Panel } from './components/Panel'; // adjust path if needed

type Job = {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, name: 'Process monthly report', status: 'running' },
    { id: 2, name: 'Backup database', status: 'pending' },
    { id: 3, name: 'Send newsletter', status: 'completed' },
    { id: 4, name: 'Generate invoice', status: 'failed' },
  ]);

  const [newJobName, setNewJobName] = useState('');

  const addJob = () => {
    if (!newJobName.trim()) return;
    const newJob: Job = {
      id: Date.now(),
      name: newJobName.trim(),
      status: 'pending',
    };
    setJobs((prev) => [...prev, newJob]);
    setNewJobName('');
  };

  const deleteJob = (id: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateStatus = (id: number, newStatus: Job['status']) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Jobs Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center">Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No jobs yet. Create one below.</p>
          ) : (
            <table className="w-full table-spacing">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="w-1/2 pb-4">Name</th>
                  <th className="w-1/4 pb-4">Status</th>
                  <th className="w-1/8 pb-4 text-center">Edit</th>
                  <th className="w-1/8 pb-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-gray-700">
                    <td className="py-4 pr-8">{job.name}</td>
                    <td className="py-4 pr-8 capitalize">{job.status}</td>
                    <td className="py-4 text-center">
                      <select
                        value={job.status}
                        onChange={(e) => updateStatus(job.id, e.target.value as Job['status'])}
                        className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-4 text-center">
                      <button onClick={() => deleteJob(job.id)} className="text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Create New Job Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-left">Create New Job</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={newJobName}
              onChange={(e) => setNewJobName(e.target.value)}
              placeholder="Enter job name..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addJob}
              disabled={!newJobName.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600"
            >
              Create Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;