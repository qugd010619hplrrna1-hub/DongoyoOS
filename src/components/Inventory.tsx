import { useState, useEffect } from 'react';
import { AppState, ProductId, SupplyId } from '../types';
import { PRODUCTS, SUPPLIES } from '../constants';
import { Save, AlertCircle } from 'lucide-react';

interface InventoryProps {
  state: AppState;
  onUpdate: (editorName: string, products: Record<ProductId, number>, supplies: Record<SupplyId, number>) => void;
}

export default function Inventory({ state, onUpdate }: InventoryProps) {
  const [editorName, setEditorName] = useState('');
  const [products, setProducts] = useState<Record<ProductId, number>>({ ...state.inventory.products });
  const [supplies, setSupplies] = useState<Record<SupplyId, number>>({ ...state.inventory.supplies });

  // Actualiza lo que ves si el inventario cambia por una venta
  useEffect(() => {
    setProducts({ ...state.inventory.products });
    setSupplies({ ...state.inventory.supplies });
  }, [state.inventory]);

  const handleSave = () => {
    if (!editorName.trim()) {
      alert('Por favor, ingresa tu nombre para registrar el cambio.');
      return;
    }

    const hasProductChanges = Object.keys(products).some(id => products[id as ProductId] !== state.inventory.products[id as ProductId]);
    const hasSupplyChanges = Object.keys(supplies).some(id => supplies[id as SupplyId] !== state.inventory.supplies[id as SupplyId]);
    
    if (!hasProductChanges && !hasSupplyChanges) {
      alert('No has realizado ningún cambio en las cantidades.');
      return;
    }

    onUpdate(editorName, products, supplies);
    setEditorName('');
    alert('Inventario actualizado correctamente.');
  };

  const handleProductChange = (id: ProductId, value: string) => {
    const num = parseInt(value) || 0;
    setProducts(prev => ({ ...prev, [id]: num }));
  };

  const handleSupplyChange = (id: SupplyId, value: string) => {
    const num = parseInt(value) || 0;
    setSupplies(prev => ({ ...prev, [id]: num }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Ajuste de Inventario</h2>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Tu nombre (Obligatorio)" 
              value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button 
              onClick={handleSave}
              className="bg-stone-900 text-amber-500 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-stone-800"
            >
              <Save className="w-5 h-5" />
              Guardar
            </button>
          </div>
        </div>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 mb-8">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Nota:</strong> Al vender una cerveza en el Punto de Venta, el inventario se descuenta automáticamente (1 cerveza, 1 etiqueta, 1 corcholata, 1 botella). Usa esta pantalla solo para agregar mercancía nueva o corregir errores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Cervezas */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b border-stone-200">Cervezas (Producto Terminado)</h3>
            <div className="space-y-3">
              {Object.entries(PRODUCTS).map(([id, product]) => (
                <div key={id} className="flex items-center justify-between">
                  <label className="font-medium text-stone-700">{product.name}</label>
                  <input 
                    type="number" 
                    value={products[id as ProductId]}
                    onChange={(e) => handleProductChange(id as ProductId, e.target.value)}
                    className="w-24 px-3 py-1.5 border border-stone-300 rounded-lg text-right focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Insumos */}
          <div>
            <h3 className="text-lg font-bold mb-4 pb-2 border-b border-stone-200">Insumos</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-stone-500 text-sm uppercase mb-2">Etiquetas</h4>
                <div className="space-y-2">
                  {Object.entries(SUPPLIES).filter(([_, s]) => s.type === 'etiqueta').map(([id, supply]) => (
                    <div key={id} className="flex items-center justify-between">
                      <label className="text-stone-700 text-sm">{supply.name}</label>
                      <input 
                        type="number" 
                        value={supplies[id as SupplyId]}
                        onChange={(e) => handleSupplyChange(id as SupplyId, e.target.value)}
                        className="w-24 px-3 py-1 border border-stone-300 rounded-lg text-right text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-500 text-sm uppercase mb-2">Corcholatas</h4>
                <div className="space-y-2">
                  {Object.entries(SUPPLIES).filter(([_, s]) => s.type === 'corcholata').map(([id, supply]) => (
                    <div key={id} className="flex items-center justify-between">
                      <label className="text-stone-700 text-sm">{supply.name}</label>
                      <input 
                        type="number" 
                        value={supplies[id as SupplyId]}
                        onChange={(e) => handleSupplyChange(id as SupplyId, e.target.value)}
                        className="w-24 px-3 py-1 border border-stone-300 rounded-lg text-right text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-500 text-sm uppercase mb-2">Botellas</h4>
                <div className="space-y-2">
                  {Object.entries(SUPPLIES).filter(([_, s]) => s.type === 'botella').map(([id, supply]) => (
                    <div key={id} className="flex items-center justify-between">
                      <label className="text-stone-700 text-sm">{supply.name}</label>
                      <input 
                        type="number" 
                        value={supplies[id as SupplyId]}
                        onChange={(e) => handleSupplyChange(id as SupplyId, e.target.value)}
                        className="w-24 px-3 py-1 border border-stone-300 rounded-lg text-right text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
