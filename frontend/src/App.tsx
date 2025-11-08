import { useState } from 'react';
import { MessageBoard } from './components/MessageBoard';
import './App.css';

function App() {
  const [navigationStack, setNavigationStack] = useState<(string | null)[]>([null]);

  const currentParentId = navigationStack[navigationStack.length - 1];

  const handleNavigate = (postId: string) => {
    setNavigationStack([...navigationStack, postId]);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>The Forum</h1>
        <p>Organizing movements and ideas</p>
      </header>
      <main className="app-main">
        <MessageBoard
          parentId={currentParentId}
          onNavigate={handleNavigate}
          onBack={handleBack}
        />
      </main>
    </div>
  );
}

export default App;
