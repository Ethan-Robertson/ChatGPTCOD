import React from 'react';
import './App.css'; // Make sure this imports your CSS
import DebuggingChallenge from './DebuggingChallenge'; // Adjust the path if necessary

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the Debugging Challenge App</h1>
            </header>
            <main>
                <DebuggingChallenge />
            </main>
        </div>
    );
}

export default App;
