import { Panel } from './components/Panel'; // adjust path if needed

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Rescale Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your jobs and statuses
        </p>
      </header>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel 1: Job Overview */}
        <Panel title="Job Overview" variant="primary">
          <p>Total Jobs: 12</p>
          <p>Pending: 3</p>
          <p>Running: 5</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View All Jobs
          </button>
        </Panel>

        {/* Panel 2: Recent Activity */}
        <Panel title="Recent Activity" variant="default">
          <ul className="space-y-2">
            <li>Job #5 → Completed (2 min ago)</li>
            <li>Job #8 → Failed (15 min ago)</li>
            <li>Job #12 → Started (30 min ago)</li>
          </ul>
        </Panel>

        {/* Panel 3: Quick Actions */}
        <Panel title="Quick Actions" variant="secondary">
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Create New Job
            </button>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Refresh Statuses
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default App;