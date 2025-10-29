import { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { supabase, Product, ShrinkageReport } from '../lib/supabase';

interface ControlPanelProps {
  onGenerateReport: (report: ShrinkageReport) => void;
}

export default function ControlPanel({ onGenerateReport }: ControlPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [poNumber, setPoNumber] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US'));
  const [itemNumber, setItemNumber] = useState('');
  const [shrinkageRequirement, setShrinkageRequirement] = useState('ASTCC 135-15 = -50');
  const [requirementOption, setRequirementOption] = useState<'ASTCC' | 'ISO' | 'OTHER'>('ASTCC');
  const [customRequirement, setCustomRequirement] = useState('');
  const [temp, setTemp] = useState('+/- 3%');
  const [dimensionalChange, setDimensionalChange] = useState('-1.65%');
  const [ph, setPh] = useState('5.2');
  const [result, setResult] = useState('Pass');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('product_code');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    setProducts(data || []);
  };

  const handleGenerateReport = async () => {
    if (!selectedProduct || !poNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const product = products.find(p => p.product_code === selectedProduct);
    if (!product) return;

    setLoading(true);

    const reportData: Omit<ShrinkageReport, 'id' | 'created_at' | 'updated_at'> = {
      product_code: product.product_code,
      po_number: poNumber,
      dc_number: '',
      date,
      item_number: itemNumber || product.product_code,
      product_description: `Elastic ${product.width}`,
      color: product.color,
      shrinkage_requirement: shrinkageRequirement,
      temp,
      dimensional_change: dimensionalChange,
      ph,
      result
    };

    const { data, error } = await supabase
      .from('shrinkage_reports')
      .insert([reportData])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report');
      return;
    }

    if (data) {
      onGenerateReport(data);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shrinkage Report Generator</h1>
          <p className="text-gray-500 text-sm">Create professional lab test reports</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          >
            <option value="">Select a product...</option>
            {products.map((product) => (
              <option key={product.id} value={product.product_code}>
                {product.product_code} - {product.description} {product.width} {product.color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            PO Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            placeholder="e.g., 57216"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Number</label>
            <input
              type="text"
              value={itemNumber}
              onChange={(e) => setItemNumber(e.target.value)}
              placeholder="Auto-filled from product"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Testing Parameters</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shrinkage Requirement
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shrinkageRequirement"
                    className="h-4 w-4 text-blue-600"
                    checked={requirementOption === 'ASTCC'}
                    onChange={() => {
                      setRequirementOption('ASTCC');
                      const value = 'ASTCC 135-15 = -50';
                      setShrinkageRequirement(value);
                    }}
                  />
                  <span className="text-sm text-gray-800">ASTCC 135-15 = -50</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shrinkageRequirement"
                    className="h-4 w-4 text-blue-600"
                    checked={requirementOption === 'ISO'}
                    onChange={() => {
                      setRequirementOption('ISO');
                      const value = 'ISO 6330 - 50 Temp';
                      setShrinkageRequirement(value);
                    }}
                  />
                  <span className="text-sm text-gray-800">ISO 6330 - 50 Temp</span>
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shrinkageRequirement"
                      className="h-4 w-4 text-blue-600"
                      checked={requirementOption === 'OTHER'}
                      onChange={() => {
                        setRequirementOption('OTHER');
                        setShrinkageRequirement(customRequirement);
                      }}
                    />
                    <span className="text-sm text-gray-800">OTHER</span>
                  </label>
                  {requirementOption === 'OTHER' && (
                    <input
                      type="text"
                      value={customRequirement}
                      onChange={(e) => {
                        setCustomRequirement(e.target.value);
                        setShrinkageRequirement(e.target.value);
                      }}
                      placeholder="Enter custom shrinkage requirement"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Temp</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dimensional Change
                </label>
                <input
                  type="text"
                  value={dimensionalChange}
                  onChange={(e) => setDimensionalChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PH</label>
                <input
                  type="text"
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Result</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading || !selectedProduct || !poNumber}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {loading ? (
            'Generating...'
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
