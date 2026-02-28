import { useState } from 'react';
import { AppState, ProductId, AgencyId, SaleItem } from '../types';
import { PRODUCTS, AGENCIES } from '../constants';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

interface POSProps {
  state: AppState;
  onSale: (agencyId: AgencyId, items: SaleItem[]) => void;
}

export default function POS({ state, onSale }: POSProps) {
  const [agency, setAgency] = useState<AgencyId>('don_goyo');
  const [cart, setCart] = useState<Record<ProductId, number>>({} as any);

  const addToCart = (productId: ProductId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: ProductId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const clearCart = () => setCart({} as any);

  const handleCheckout = () => {
    const items: SaleItem[] = Object.entries(cart).map(([productId, quantity]) => ({
      productId: productId as ProductId,
      quantity: quantity as number
    }));
    
    if (items.length === 0) return;

    onSale(agency, items);
    clearCart();
    alert('¡Venta registrada con éxito! El inventario se ha descontado.');
  };

  const totalItems = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-xl font-bold mb-4">Punto de Venta</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-600 mb-2">Agencia / Punto de Venta</label>
            <select 
              value={agency} 
              onChange={(e) => setAgency(e.target.value as AgencyId)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {Object.entries(AGENCIES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(PRODUCTS).map(([id, product]) => {
              const stock = state.inventory.products[id as ProductId] || 0;
              return (
                <button
                  key={id}
                  onClick={() => addToCart(id as ProductId)}
                  className={`${product.color} p-4 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all text-left flex flex-col justify-between h-32`}
                >
                  <span className="font-bold text-lg leading-tight">{product.name}</span>
                  <span className="text-sm opacity-80">Stock: {stock}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Carrito
            </h2>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
              {totalItems} items
            </span>
          </div>

          {Object.keys(cart).length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {Object.entries(cart).map(([id, quantity]) => {
                const product = PRODUCTS[id as ProductId];
                return (
                  <div key={id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm text-stone-500">{quantity}x</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(id as ProductId)} className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{quantity}</span>
                      <button onClick={() => addToCart(id as ProductId)} className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 space-y-3">
            <button 
              onClick={clearCart}
              disabled={Object.keys(cart).length === 0}
              className="w-full py-3 px-4 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Limpiar
            </button>
            <button 
              onClick={handleCheckout}
              disabled={Object.keys(cart).length === 0}
              className="w-full py-4 px-4 rounded-xl font-bold text-stone-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 shadow-md text-lg"
            >
              Cobrar y Descontar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
