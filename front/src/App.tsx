import './App.css';
import MovieGrid from './MovieGrid';

function App() {
  return (
    <body className='App-body'>
      <div style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          overflow: 'none',
          minHeight: '100vh',
          minWidth: '1200px',
        }}>
          <MovieGrid />
        </div>
      </div>
    </body>
  );
}

export default App;
