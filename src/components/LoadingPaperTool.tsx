import { useMemo, useRef, useState } from 'react';
import { Upload, FileJson, Printer, Download, AlertCircle, Save } from 'lucide-react';
import LoadingPaperDocument, { LoadingPaperData, LoadingPaperItem } from './LoadingPaperDocument';

export default function LoadingPaperTool() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoadingPaperData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();

  const parseJson = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      // Expect structure like the provided DC.json
      const rows = Array.isArray(parsed?.Rows) ? parsed.Rows : [];
      if (rows.length === 0) {
        throw new Error('No rows found in JSON');
      }
      // Derive header fields from first row
      const first = rows[0];
      const header = {
        dcNo: String(first.DcNo ?? ''),
        poNo: String(first.PoNo ?? ''),
        date: String(first.Date ?? ''),
        accName: String(first.AccName ?? ''),
        accAddress: String(first.AccAddress ?? ''),
        remarks: String(first.Remarks ?? ''),
      };
      let items: LoadingPaperItem[] = rows.map((r: any, idx: number) => ({
        sr: idx + 1,
        detailName: String(r.DetailName ?? ''),
        unit: String(r.DetailUnit ?? ''),
        jobNo: String(r.JobNo ?? ''),
        pack: Number(r.Pack ?? 0),
        qty: Number(r.Qty ?? 0),
        weight: Number(r.Weight ?? 0),
        poNo: String(r.PoNo ?? header.poNo),
        dcNo: String(r.DcNo ?? header.dcNo),
        remarks: '',
      }));

      // Sort by DC number (numeric if possible)
      items = items.sort((a, b) => {
        const an = Number(a.dcNo);
        const bn = Number(b.dcNo);
        if (!isNaN(an) && !isNaN(bn)) return an - bn;
        return String(a.dcNo || '').localeCompare(String(b.dcNo || ''));
      });

      // Reindex sr after sort
      items = items.map((it, i) => ({ ...it, sr: i + 1 }));

      const totals = items.reduce(
        (acc, it) => {
          acc.pack += isNaN(it.pack) ? 0 : it.pack;
          acc.qty += isNaN(it.qty) ? 0 : it.qty;
          acc.weight += isNaN(it.weight) ? 0 : it.weight;
          return acc;
        },
        { pack: 0, qty: 0, weight: 0 }
      );

      const lpData: LoadingPaperData = {
        ...header,
        items,
        totals,
        headerNote: '',
      };
      setData(lpData);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Invalid JSON');
      setData(null);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    parseJson(text);
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

  const handleChangeRemark = (sr: number, value: string) => {
    if (!data) return;
    const items = data.items.map((it) => (it.sr === sr ? { ...it, remarks: value } : it));
    setData({ ...data, items });
  };

  const recomputeTotals = (items: LoadingPaperItem[]) =>
    items.reduce(
      (acc, it) => {
        acc.pack += isNaN(it.pack) ? 0 : it.pack;
        acc.qty += isNaN(it.qty) ? 0 : it.qty;
        acc.weight += isNaN(it.weight) ? 0 : it.weight;
        return acc;
      },
      { pack: 0, qty: 0, weight: 0 }
    );

  const handleDeleteItem = (sr: number) => {
    if (!data) return;
    let items = data.items.filter((it) => it.sr !== sr);
    // Reindex and recompute totals after delete
    items = items.map((it, i) => ({ ...it, sr: i + 1 }));
    const totals = recomputeTotals(items);
    setData({ ...data, items, totals });
  };

  const handleChangeHeaderNote = (value: string) => {
    if (!data) return;
    setData({ ...data, headerNote: value });
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      const { data: paper, error: err1 } = await (window as any).supabaseClient?.from?.('loading_papers')
        ? (window as any).supabaseClient.from('loading_papers').insert([
            {
              dc_no: data.dcNo,
              po_no: data.poNo,
              date: data.date,
              acc_name: data.accName,
              acc_address: data.accAddress,
              remarks: data.remarks,
              header_note: data.headerNote || '',
            },
          ]).select().single()
        : await (async () => {
            // Fallback: use local supabase import
            const { supabase } = await import('../lib/supabase');
            return await supabase.from('loading_papers').insert([
              {
                dc_no: data.dcNo,
                po_no: data.poNo,
                date: data.date,
                acc_name: data.accName,
                acc_address: data.accAddress,
                remarks: data.remarks,
                header_note: data.headerNote || '',
              },
            ]).select().single();
          })();

      if (err1) throw err1;
      const paperId = (paper as any)?.id;
      if (!paperId) throw new Error('Failed to create loading paper');

      const itemsPayload = data.items.map((it) => ({
        paper_id: paperId,
        sr: it.sr,
        detail_name: it.detailName,
        unit: it.unit,
        job_no: it.jobNo,
        pack: it.pack,
        qty: it.qty,
        weight: it.weight,
        po_no: it.poNo || '',
        dc_no: it.dcNo || '',
        remarks: it.remarks || '',
      }));

      const { error: err2 } = await (window as any).supabaseClient?.from?.('loading_paper_items')
        ? (window as any).supabaseClient.from('loading_paper_items').insert(itemsPayload)
        : await (async () => {
            const { supabase } = await import('../lib/supabase');
            return await supabase.from('loading_paper_items').insert(itemsPayload);
          })();
      if (err2) throw err2;
      alert('Loading Paper saved successfully');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to save Loading Paper');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Loading Paper</h2>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFileChange}
          />
          <button
            onClick={handlePick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <Upload className="w-4 h-4" /> Upload JSON
          </button>
          {data && (
            <>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {!data ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-600">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
            <FileJson className="w-6 h-6 text-gray-600" />
          </div>
          <p className="font-medium">Upload a JSON file to generate Loading Paper</p>
          <p className="text-sm text-gray-500">Expected structure like your DC.json</p>
        </div>
      ) : (
        <div className="flex items-center justify-center print-area">
          <div className="w-full max-w-[297mm]">
            <LoadingPaperDocument
              data={data}
              onChangeRemark={handleChangeRemark}
              onDeleteItem={handleDeleteItem}
              onChangeHeaderNote={handleChangeHeaderNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}


