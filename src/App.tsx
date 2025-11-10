import { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import StagedFunding from './components/StagedFunding';
import ExportOptions from './components/ExportOptions';
import type { UserInputs, CalculationResults } from './types/calculator';
import { calculateInvestment, calculateStagedFunding } from './utils/calculations';
import { loadCalculation } from './utils/storage';
import { generatePDF } from './utils/pdfGenerator';

// Screen management
type Screen = 'input' | 'results' | 'staged' | 'export';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [inputs, setInputs] = useState<UserInputs | null>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Check for ?load= parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loadId = params.get('load');
    if (loadId) {
      const saved = loadCalculation(loadId);
      if (saved) {
        setInputs(saved.inputs);
        setResults(saved.results);
        setCurrentScreen('results');
      }
    }
  }, []);

  // Handle form submission
  const handleCalculate = (formInputs: UserInputs) => {
    setInputs(formInputs);
    const calculated = calculateInvestment(formInputs);
    setResults(calculated);
    setCurrentScreen('results');
  };

  const handleViewStagedFunding = () => {
    setCurrentScreen('staged');
  };

  const handleExport = () => {
    if (inputs && results) {
      const stagedFunding = calculateStagedFunding(results.realistic);
      generatePDF(inputs, results, stagedFunding);
    }
  };

  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  const handleBackToResults = () => {
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Innovation Investment Calculator</h1>
                <p className="text-sm text-gray-600">Evidence-based investment estimates</p>
              </div>
            </div>

            {currentScreen !== 'input' && (
              <button
                onClick={handleBackToInput}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Calculation
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentScreen === 'input' && (
          <InputForm onSubmit={handleCalculate} />
        )}

        {currentScreen === 'results' && results && (
          <ResultsDisplay
            results={results}
            onViewStagedFunding={handleViewStagedFunding}
            onExport={handleExport}
          />
        )}

        {currentScreen === 'staged' && results && (
          <StagedFunding
            phases={calculateStagedFunding(results.realistic)}
            onBack={handleBackToResults}
          />
        )}

        {currentScreen === 'export' && inputs && results && (
          <ExportOptions inputs={inputs} results={results} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">About This Calculator</h3>
              <p className="text-sm text-gray-600">
                Professional investment estimation tool based on industry research and real-world data.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/methodology.pdf" className="text-gray-600 hover:text-primary">
                    Methodology
                  </a>
                </li>
                <li>
                  <a href="#data-sources" className="text-gray-600 hover:text-primary">
                    Data Sources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Privacy</h3>
              <p className="text-sm text-gray-600">
                Your calculation data is processed locally. No information is stored or transmitted without your consent.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Innovation Investment Calculator</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
