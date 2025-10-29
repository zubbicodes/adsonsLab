import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { Plus, Trash2, RefreshCcw } from 'lucide-react';

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    product_code: '',
    description: '',
    width: '',
    color: '',
  });
  const [form, setForm] = useState({
    product_code: '',
    description: 'ELASTIC',
    width: '',
    color: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('product_code');
    setLoading(false);
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  };

  const addProduct = async () => {
    if (!form.product_code || !form.width || !form.color) {
      alert('Please fill product code, width, and color');
      return;
    }
    setAdding(true);
    const { error } = await supabase.from('products').insert([form]);
    setAdding(false);
    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
      return;
    }
    setForm({ product_code: '', description: 'ELASTIC', width: '', color: '' });
    fetchProducts();
  };

  const removeProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm({
      product_code: p.product_code,
      description: p.description,
      width: p.width,
      color: p.color,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ product_code: '', description: '', width: '', color: '' });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.product_code || !editForm.width || !editForm.color) {
      alert('Please fill product code, width, and color');
      return;
    }
    setUpdating(true);
    const { error } = await supabase
      .from('products')
      .update(editForm)
      .eq('id', editingId);
    setUpdating(false);
    if (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
      return;
    }
    // Update local list
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, ...editForm } as Product : p))
    );
    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Product Code"
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          value={form.product_code}
          onChange={(e) => setForm({ ...form, product_code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Width (e.g., 20MM)"
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          value={form.width}
          onChange={(e) => setForm({ ...form, width: e.target.value })}
        />
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Color (WHITE/BLACK)"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <button
            onClick={addProduct}
            disabled={adding}
            className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Code</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Description</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Width</th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 border-b">Color</th>
              <th className="px-4 py-3 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">No products found</td>
              </tr>
            ) : (
              products.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-t font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          value={editForm.product_code}
                          onChange={(e) => setEditForm({ ...editForm, product_code: e.target.value })}
                        />
                      ) : (
                        p.product_code
                      )}
                    </td>
                    <td className="px-4 py-3 border-t text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      ) : (
                        p.description
                      )}
                    </td>
                    <td className="px-4 py-3 border-t text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          value={editForm.width}
                          onChange={(e) => setEditForm({ ...editForm, width: e.target.value })}
                        />
                      ) : (
                        p.width
                      )}
                    </td>
                    <td className="px-4 py-3 border-t text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          value={editForm.color}
                          onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                        />
                      ) : (
                        p.color
                      )}
                    </td>
                    <td className="px-4 py-3 border-t text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={updating}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeProduct(p.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


