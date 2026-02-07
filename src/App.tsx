import { Layout } from './components/Layout';
import { FileProvider } from './contexts/FileContext';

function App() {
  return (
    <FileProvider>
      <Layout />
    </FileProvider>
  );
}

export default App;
