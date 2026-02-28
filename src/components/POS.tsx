import { useState } from 'react';
import { AppState, ProductId, AgencyId, SaleItem } from '../types';
import { PRODUCTS, AGENCIES } from '../constants';
import { ShoppingCart, Plus, Minus, Trash2, Users, Play, CheckCircle } from 'lucide-react';

interface POSProps {
  state: AppState;
  onSale: (agencyId: AgencyId, items: SaleItem[]) => void;
}

export default function POS({ state, onSale }: POSProps) {
  const [activeAgency, setActiveAgency] = useState<AgencyId | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<AgencyId>('don_goyo');
  const [groupSalesCount, setGroupSalesCount] = useState(0);
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

  const removeCompletely = (productId: ProductId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const clearCart = () => setCart({} as any);

  const handleCheckout = () => {
    if (!activeAgency) return;

    const items: SaleItem[] = Object.entries(cart).map(([productId, quantity]) => ({
      productId: productId as ProductId,
      quantity: quantity as number
    }));
    
    if (items.length === 0) return;

    onSale(activeAgency, items);
    clearCart();
    setGroupSalesCount(prev => prev + 1);
    alert('¡Venta de familia registrada! Puedes seguir cobrando a la siguiente familia.');
  };

  const handleEndGroup = () => {
    if (confirm(`¿Estás seguro de finalizar las ventas para el grupo de ${AGENCIES[activeAgency!]}? Se registraron ${groupSalesCount} ventas en total.`)) {
      setActiveAgency(null);
      setGroupSalesCount(0);
      clearCart();
    }
  };

  const totalItems = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    return sum + (PRODUCTS[id as ProductId].price * (qty as number));
  }, 0);

  // PANTALLA DE INICIO (Seleccionar Agencia)
  if (!activeAgency) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 max-w-md w-full text-center">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-stone-800">Nuevo Grupo</h2>
          <p className="text-stone-500 mb-8">Selecciona la agencia o punto de venta para iniciar la sesión de cobro.</p>
          
          <div className="text-left mb-8">
            <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">Agencia Turística</label>
            <select 
              value={selectedAgency} 
              onChange={(e) => setSelectedAgency(e.target.value as AgencyId)}
              className="w-full p-4 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none text-lg font-medium transition-all cursor-pointer"
            >
              {Object.entries(AGENCIES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => {
              setActiveAgency(selectedAgency);
              setGroupSalesCount(0);
            }}
            className="w-full py-4 rounded-xl font-bold text-stone-900 bg-amber-500 hover:bg-amber-400 shadow-md hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            Iniciar Ventas del Grupo
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA DE VENTAS (Grupo Activo)
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        
        {/* Cabecera del Grupo Activo */}
        <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-amber-500 font-bold text-sm uppercase tracking-wider block mb-1">Grupo Activo</span>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Users className="w-6 h-6 text-stone-400" />
              {AGENCIES[activeAgency]}
            </h2>
            <p className="text-stone-400 text-sm mt-1">Familias atendidas: <span className="font-bold text-white">{groupSalesCount}</span></p>
          </div>
          <button 
            onClick={handleEndGroup}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <CheckCircle className="w-5 h-5" />
            Finalizar Grupo
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-bold mb-4 text-stone-800">Menú de Cervezas</h3>
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
                    <div className="flex-1">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm text-stone-500">
                        ${product.price} x {quantity} = <span className="font-bold text-stone-800">${product.price * (quantity as number)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(id as ProductId)} className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{quantity}</span>
                      <button onClick={() => addToCart(id as ProductId)} className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeCompletely(id as ProductId)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 ml-1" title="Borrar cerveza">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex justify-between items-center mb-4 p-4 bg-stone-100 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-600 uppercase tracking-wider text-sm">Total a cobrar:</span>
              <span className="text-3xl font-black text-amber-600">${totalPrice}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={clearCart}
                disabled={Object.keys(cart).length === 0}
                className="w-1/3 py-3 px-4 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
              <button 
                onClick={handleCheckout}
                disabled={Object.keys(cart).length === 0}
                className="w-2/3 py-4 px-4 rounded-xl font-bold text-stone-900 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 shadow-md text-lg"
              >
                Cobrar a Familia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
