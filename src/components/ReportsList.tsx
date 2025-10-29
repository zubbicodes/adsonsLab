import { useEffect, useState } from 'react';
import { supabase, ShrinkageReport } from '../lib/supabase';
import { RefreshCcw, Eye, Trash2 } from 'lucide-react';

interface ReportsListProps {
  onOpenReport: (report: ShrinkageReport) => void;
}

export default function ReportsList({ onOpenReport }: ReportsListProps) {
  const [reports, setReports] = useState<ShrinkageReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shrinkage_reports')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }
    setReports(data || []);
  };

  const removeReport = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    const { error } = await supabase.from('shrinkage_reports').delete().eq('id', id);
    if (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
      return;
    }
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Date</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">PO Number</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Item</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Color</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Result</th>
              <th className="px-4 py-3 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center px-4 py-6 text-gray-500">Loading...</td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center px-4 py-6 text-gray-500">No reports found</td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-t text-gray-900 font-medium">{r.date}</td>
                  <td className="px-4 py-3 border-t text-gray-700">{r.po_number}</td>
                  <td className="px-4 py-3 border-t text-gray-700">{r.item_number}</td>
                  <td className="px-4 py-3 border-t text-gray-700">{r.color}</td>
                  <td className="px-4 py-3 border-t">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${r.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {r.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-t text-right space-x-2">
                    <button
                      onClick={() => onOpenReport(r)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => removeReport(r.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


