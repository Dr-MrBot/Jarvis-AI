import React, { useState } from 'react';

const ApiTest = () => {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    if (!apiKey.trim()) {
      setResult('Please enter an API key');
      return;
    }

    setLoading(true);
    setResult('Testing...');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Say 'Hello World'"
            }]
          }]
        })
      });

      setResult(`Status: ${response.status}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + `Success! Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.json();
        setResult(prev => prev + `Error: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      setResult(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Test</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">API Key:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Gemini API key"
          />
        </div>
        <button
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        <div>
          <label className="block text-sm font-medium mb-2">Result:</label>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 