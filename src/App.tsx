import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import ShrinkageReport from './components/ShrinkageReport';
import { ShrinkageReport as ShrinkageReportType } from './lib/supabase';
import { ArrowLeft, FileText, Package, ClipboardList, Settings } from 'lucide-react';
import ProductsManager from './components/ProductsManager';
import ReportsList from './components/ReportsList';

function App() {
  const [currentReport, setCurrentReport] = useState<ShrinkageReportType | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'products' | 'reports' | 'settings'>('generate');

  const handleGenerateReport = (report: ShrinkageReportType) => {
    setCurrentReport(report);
  };

  const handleBackFromReport = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100" data-no-watermark>
      {currentReport ? (
        <div className="min-h-screen bg-gray-100 print:bg-white" data-no-watermark>
          <div className="print:hidden bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <button
                onClick={handleBackFromReport}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-screen p-4 print:p-0" data-no-watermark>
            <ShrinkageReport report={currentReport} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen" data-no-watermark>
          <div className="print:hidden">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">ADSONS Laboratory Dashboard</h1>
                    <p className="text-sm text-gray-500">Manage shrinkage reports and products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-12 gap-6">
              <aside className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <nav className="p-2">
                    <button
                      onClick={() => setActiveTab('generate')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === 'generate'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      Generate Report
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === 'products'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                      Products
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === 'reports'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ClipboardList className="w-5 h-5" />
                      Reports
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === 'settings'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      Settings (Coming Soon)
                    </button>
                  </nav>
                </div>
              </aside>

              <main className="col-span-12 md:col-span-9 lg:col-span-9 xl:col-span-9">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6">
                  {activeTab === 'generate' && (
                    <ControlPanel onGenerateReport={handleGenerateReport} />
                  )}
                  {activeTab === 'products' && (
                    <ProductsManager />
                  )}
                  {activeTab === 'reports' && (
                    <ReportsList onOpenReport={(r) => setCurrentReport(r)} />
                  )}
                  {activeTab === 'settings' && (
                    <div className="text-gray-600">
                      <h2 className="text-xl font-semibold mb-2">Settings</h2>
                      <p>More options will be added here in the future.</p>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
