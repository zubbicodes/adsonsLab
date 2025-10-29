import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import ShrinkageReport from './components/ShrinkageReport';
import { ShrinkageReport as ShrinkageReportType } from './lib/supabase';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentReport, setCurrentReport] = useState<ShrinkageReportType | null>(null);

  const handleGenerateReport = (report: ShrinkageReportType) => {
    setCurrentReport(report);
  };

  const handleBackToPanel = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100" data-no-watermark>
      {currentReport ? (
        <div className="min-h-screen bg-gray-100 print:bg-white" data-no-watermark>
          <div className="print:hidden bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <button
                onClick={handleBackToPanel}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Panel
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-screen p-4 print:p-0" data-no-watermark>
            <ShrinkageReport report={currentReport} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <ControlPanel onGenerateReport={handleGenerateReport} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
