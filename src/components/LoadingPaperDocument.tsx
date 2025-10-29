import { useRef } from 'react';
import logoImage from '../assets/logo_no_bg.png';

export type LoadingPaperItem = {
  sr: number;
  detailName: string;
  unit: string;
  jobNo: string;
  pack: number;
  qty: number;
  weight: number;
  poNo?: string;
  dcNo?: string;
  remarks?: string;
};

export type LoadingPaperData = {
  dcNo: string;
  poNo: string;
  date: string;
  accName: string;
  accAddress: string;
  remarks: string;
  items: LoadingPaperItem[];
  totals: { pack: number; qty: number; weight: number };
  headerNote?: string;
};

export default function LoadingPaperDocument({ data, onChangeRemark, onDeleteItem, onChangeHeaderNote, onGenerateFromItem }: { data: LoadingPaperData; onChangeRemark?: (sr: number, value: string) => void; onDeleteItem?: (sr: number) => void; onChangeHeaderNote?: (value: string) => void; onGenerateFromItem?: (sr: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const fmtDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('en-GB');
    } catch {
      return iso;
    }
  };

  const fmtWeight = (value: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(
      isNaN(value) ? 0 : value
    );

  return (
    <div ref={ref} className="bg-white shadow-2xl w-full aspect-[297/210] print:shadow-none print:h-[210mm] print:aspect-auto">
      <div className="relative h-full flex flex-col">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800"></div>

        <div className="px-10 pt-8 pb-10 print:px-6 print:pt-4 print:pb-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-8 print:mb-4">
            <div className="flex items-center gap-4">
              <img src={logoImage} alt="Adsons Global Logo" className="w-20 h-20 object-contain" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">ADSONS GLOBAL</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Loading Paper</p>
              </div>
            </div>
            <div className="text-right text-sm text-slate-600">
              <div><span className="font-semibold text-slate-800">Date:</span> {fmtDate(data.date)}</div>
            </div>
          </div>

          <div className="mb-6 print:mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-900 p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer</div>
                <div className="text-lg font-bold text-slate-900">{data.accName}</div>
                <div className="text-sm text-slate-600">{data.accAddress}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-white border-l-4 border-slate-700 p-4 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remarks / Vehicle</div>
                <div className="text-sm text-slate-700">{data.remarks || '-'}</div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Additional Note</div>
                  <input
                    type="text"
                    value={data.headerNote || ''}
                    onChange={(e) => onChangeHeaderNote && onChangeHeaderNote(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none print:hidden"
                  />
                  <div className="hidden print:block font-bold text-slate-900">{data.headerNote || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="overflow-hidden border-2 border-slate-200 rounded-lg print:rounded-none">
              <div className="bg-gray-200 text-gray-900 px-4 py-3 text-sm font-bold uppercase tracking-wide">Items</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-2 border-b">Sr</th>
                    <th className="px-4 py-2 border-b">PO No</th>
                    <th className="px-4 py-2 border-b">Job No</th>
                    <th className="px-4 py-2 border-b">DC No</th>
                    <th className="px-4 py-2 border-b">Item</th>
                    <th className="px-4 py-2 border-b">Pack</th>
                    <th className="px-4 py-2 border-b">Qty</th>
                    <th className="px-4 py-2 border-b">Unit</th>
                    <th className="px-4 py-2 border-b">Net. Weight</th>
                    <th className="px-4 py-2 border-b">Remarks</th>
                    <th className="px-4 py-2 border-b print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((it) => (
                    <tr key={it.sr} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-2 border-b font-medium text-slate-900">{it.sr}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.poNo || '-'}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.jobNo}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.dcNo || '-'}</td>
                      <td className="px-4 py-2 border-b text-slate-800">{it.detailName}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.pack}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.qty}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{it.unit}</td>
                      <td className="px-4 py-2 border-b text-slate-700">{fmtWeight(it.weight)}</td>
                      <td className="px-4 py-2 border-b text-slate-700">
                        <input
                          type="text"
                          value={it.remarks || ''}
                          onChange={(e) => onChangeRemark && onChangeRemark(it.sr, e.target.value)}
                          placeholder=""
                          className="w-full px-2 py-1 rounded border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none print:hidden"
                        />
                        <div className="hidden print:block">{it.remarks || ''}</div>
                      </td>
                      <td className="px-4 py-2 border-b text-right print:hidden">
                        <button
                          onClick={() => onDeleteItem && onDeleteItem(it.sr)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-semibold">
                    <td className="px-4 py-2 border-t" colSpan={5}>Totals</td>
                    <td className="px-4 py-2 border-t">{data.totals.pack}</td>
                    <td className="px-4 py-2 border-t">{data.totals.qty}</td>
                    <td className="px-4 py-2 border-t"></td>
                    <td className="px-4 py-2 border-t">{fmtWeight(data.totals.weight)}</td>
                    <td className="px-4 py-2 border-t"></td>
                    <td className="px-4 py-2 border-t print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-auto pt-6 print:pt-5 border-t-2 border-slate-200 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <div>
                Prepared by: ADSONS GLOBAL — Logistics Department
              </div>
              <div>
                Address: 193-VIP Block Canal Park, Faisalabad, Pakistan — info@adsonent.com
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800"></div>
      </div>
    </div>
  );
}


