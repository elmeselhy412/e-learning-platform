import React from 'react';
import { UserManagement } from './components/usermanagment';
import { LogTable } from './components/logTable';

const App: React.FC = () => {
  return (
    <div className="App">
      <UserManagement />
      <LogTable />
    </div>
  );
};

export default App;

