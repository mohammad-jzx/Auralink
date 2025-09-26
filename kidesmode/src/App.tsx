import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-lg text-gray-600">Start prompting (or editing) to see magic happen :)</p>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎓 Kids Learning Module</h2>
          <p className="text-gray-600 mb-6">
            A complete inclusive learning platform for children with Arabic RTL support, accessibility features, and engaging educational content.
          </p>
          
          <Link
            to="/kids-learn"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enter Kids Learning 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;