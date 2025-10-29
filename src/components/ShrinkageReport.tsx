import { useRef } from 'react';
import { Download, Printer, Award, FlaskConical } from 'lucide-react';
import { ShrinkageReport as ShrinkageReportType } from '../lib/supabase';
import logoImage from '../assets/logo_no_bg.png';

interface ShrinkageReportProps {
  report: ShrinkageReportType;
}

export default function ShrinkageReport({ report }: ShrinkageReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const style = document.createElement('style');
    style.setAttribute('data-print-orientation', 'portrait');
    style.media = 'print';
    style.innerHTML = '@page { size: A4 portrait; margin: 0 !important; }';
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 0);
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  return (
    <div className="w-full max-w-[210mm] mx-auto print:m-0 print:p-0 print:max-w-none">
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
        >
          <Printer className="w-5 h-5" />
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div
        ref={reportRef}
        className="bg-white shadow-2xl w-full aspect-[210/297] print:shadow-none print:w-full print:m-0 print:h-[297mm] print:aspect-auto"
      >
        <div className="relative h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800"></div>

          <div className="px-12 pt-10 pb-12 print:px-6 print:pt-4 print:pb-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-12 print:mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={logoImage}
                  alt="Adsons Global Logo"
                  className="w-24 h-24 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    ADSONS GLOBAL
                  </h1>
                  <p className="text-sm text-slate-500 font-medium tracking-wide">
                    Pre-Shrink Elastic Experts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <FlaskConical className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-700">CERTIFIED</span>
                </div>
              </div>
            </div>

            <div className="mb-8 print:mb-5">
              <div className="bg-gray-300 text-white px-6 py-4 -mx-12 print:-mx-8">
                <h2 className="text-2xl font-bold tracking-wide uppercase text-gray-900">
                  Laboratory Test Report
                </h2>
              </div>
            </div>

            <div className="mb-6 print:mb-4">
              <div className="flex items-center gap-3 mb-4 print:mb-3">
                <div className="w-1 h-8 bg-slate-900"></div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                  Product Information
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 print:gap-2">
                <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-900 p-5 shadow-sm print:p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Test Date
                  </div>
                  <div className="text-xl font-black text-slate-900">{report.date}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-700 p-5 shadow-sm print:p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Item Number
                  </div>
                  <div className="text-xl font-black text-slate-900">{report.item_number}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-500 p-5 shadow-sm print:p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Color
                  </div>
                  <div className="text-xl font-black text-slate-900">{report.color}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 print:gap-2 mt-4 print:mt-2">
                <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-900 p-5 shadow-sm print:p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Product Description
                  </div>
                  <div className="text-lg font-bold text-slate-900">{report.product_description}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-700 p-5 shadow-sm print:p-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Purchase Order
                  </div>
                  <div className="text-lg font-bold text-slate-900">{report.po_number}</div>
                </div>
              </div>
            </div>

            <div className="mb-6 print:mb-4 flex-1">
              <div className="flex items-center gap-3 mb-4 print:mb-3">
                <div className="w-1 h-8 bg-slate-900"></div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                  Test Results & Analysis
                </h3>
              </div>

              <div className="bg-gray-200 text-white mb-6 print:mb-3 shadow-lg">
                <div className="px-6 py-5 print:px-4 print:py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                        Shrinkage Requirement
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{report.shrinkage_requirement}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                        Temperature
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{report.temp}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 print:space-y-2">
                <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow print:rounded-none">
                  <div className="bg-slate-100 px-6 py-5 print:px-4 print:py-3 flex-1 border-r-2 border-slate-200">
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                      Dimensional Change
                    </div>
                  </div>
                  <div className="px-6 py-5 print:px-4 print:py-3 flex-1 bg-white">
                    <div className="text-2xl font-black text-slate-900">{report.dimensional_change}</div>
                  </div>
                </div>

                <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow print:rounded-none">
                  <div className="bg-slate-100 px-6 py-5 print:px-4 print:py-3 flex-1 border-r-2 border-slate-200">
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                      PH Level
                    </div>
                  </div>
                  <div className="px-6 py-5 print:px-4 print:py-3 flex-1 bg-white">
                    <div className="text-2xl font-black text-slate-900">{report.ph}</div>
                  </div>
                </div>

                <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow print:rounded-none">
                  <div className="bg-slate-100 px-6 py-5 print:px-4 print:py-3 flex-1 border-r-2 border-slate-200">
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                      Test Result
                    </div>
                  </div>
                  <div className="px-6 py-5 print:px-4 print:py-3 flex-1 bg-white">
                    <div className="inline-flex items-center gap-3">
                      <span
                        className={`px-8 py-3 print:px-6 print:py-2 rounded-lg print:rounded font-black text-xl text-white shadow-lg ${
                          report.result === 'Pass'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30'
                        }`}
                      >
                        {report.result.toUpperCase()}
                      </span>
                      {report.result === 'Pass' && (
                        <Award className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 print:pt-5 border-t-2 border-slate-200">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Authorized By
                  </p>
                  <p className="text-xl font-black text-slate-900">ADSONS GLOBAL</p>
                  <p className="text-sm text-slate-600 mt-1">Quality Control Department</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 font-medium">
                    193-VIP Block Canal Park, Faisalabad, Pakistan
                  </p>
                  <a
                    href="mailto:info@adsonent.com"
                    className="text-xs text-slate-900 hover:text-slate-700 font-semibold"
                  >
                    info@adsonent.com
                  </a>
                </div>
              </div>
              <div className="text-center pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 italic">
                  This is a system-generated report, does not need any sign or stamp.
                </p>
              </div>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800"></div>
        </div>
      </div>
    </div>
  );
}
