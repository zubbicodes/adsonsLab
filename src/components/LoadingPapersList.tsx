import { useEffect, useState } from 'react';
import { supabase, LoadingPaper, LoadingPaperItemRow } from '../lib/supabase';
import { Eye, RefreshCcw, Trash2, Printer } from 'lucide-react';
import LoadingPaperDocument, { LoadingPaperData, LoadingPaperItem } from './LoadingPaperDocument';

export default function LoadingPapersList() {
  const [papers, setPapers] = useState<LoadingPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LoadingPaperData | null>(null);

  const fetchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('loading_papers')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    setPapers(data || []);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const viewPaper = async (paper: LoadingPaper) => {
    const { data: rows, error } = await supabase
      .from('loading_paper_items')
      .select('*')
      .eq('paper_id', paper.id)
      .order('sr');
    if (error) {
      console.error(error);
      return;
    }
    const items: LoadingPaperItem[] = (rows || []).map((r: LoadingPaperItemRow) => ({
      sr: r.sr,
      detailName: r.detail_name,
      unit: r.unit,
      jobNo: r.job_no,
      pack: Number(r.pack),
      qty: Number(r.qty),
      weight: Number(r.weight),
      poNo: r.po_no,
      dcNo: r.dc_no,
      remarks: r.remarks,
    }));

    const totals = items.reduce(
      (acc, it) => {
        acc.pack += isNaN(it.pack) ? 0 : it.pack;
        acc.qty += isNaN(it.qty) ? 0 : it.qty;
        acc.weight += isNaN(it.weight) ? 0 : it.weight;
        return acc;
      },
      { pack: 0, qty: 0, weight: 0 }
    );

    setSelected({
      dcNo: paper.dc_no,
      poNo: paper.po_no,
      date: paper.date,
      accName: paper.acc_name,
      accAddress: paper.acc_address,
      remarks: paper.remarks,
      headerNote: paper.header_note,
      items,
      totals,
    });
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.setAttribute('data-print-orientation', 'landscape');
    style.media = 'print';
    style.innerHTML = '@page { size: A4 landscape; margin: 0 !important; }';
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 0);
  };

  const removePaper = async (id: string) => {
    if (!confirm('Delete this loading paper?')) return;
    const { error } = await supabase.from('loading_papers').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Failed to delete');
      return;
    }
    setPapers((prev) => prev.filter((p) => p.id !== id));
    if (selected && selected.dcNo === id) setSelected(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Saved Loading Papers</h2>
          <button onClick={fetchPapers} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Date</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">DC No</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">PO No</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Customer</th>
                <th className="px-4 py-3 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Loading...</td></tr>
              ) : papers.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No saved loading papers</td></tr>
              ) : (
                papers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-t text-gray-900 font-medium">{p.date}</td>
                    <td className="px-4 py-3 border-t text-gray-700">{p.dc_no}</td>
                    <td className="px-4 py-3 border-t text-gray-700">{p.po_no}</td>
                    <td className="px-4 py-3 border-t text-gray-700">{p.acc_name}</td>
                    <td className="px-4 py-3 border-t text-right space-x-2">
                      <button onClick={() => viewPaper(p)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button onClick={() => removePaper(p.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
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

      <div className="col-span-12 lg:col-span-7">
        {selected ? (
          <>
            <div className="flex justify-end mb-3 print:hidden">
              <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
            </div>
            <div className="flex items-center justify-center print-area">
              <div className="w-full max-w-[297mm]">
                <LoadingPaperDocument data={selected} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Select a loading paper to preview</div>
        )}
      </div>
    </div>
  );
}


