import { AppState } from '../types';
import { PRODUCTS, AGENCIES } from '../constants';
import { Download, Trash2 } from 'lucide-react';

interface ReportsProps {
  state: AppState;
  onClear: () => void;
}

export default function Reports({ state, onClear }: ReportsProps) {
  
  const exportCSV = () => {
    // Generar CSV de ventas
    let csv = 'Fecha,Agencia,Producto,Cantidad\n';
    state.sales.forEach(sale => {
      const date = new Date(sale.date).toLocaleString();
      const agency = AGENCIES[sale.agencyId];
      sale.items.forEach(item => {
        const product = PRODUCTS[item.productId].name;
        csv += `"${date}","${agency}","${product}",${item.quantity}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_ventas_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes y Registros</h2>
        <div className="flex gap-2">
          <button 
            onClick={exportCSV}
            className="bg-stone-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-stone-800"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Exportar Ventas CSV</span>
          </button>
          <button 
            onClick={onClear}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-200"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Borrar Todo</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Registro de Ventas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-bold mb-4 pb-2 border-b border-stone-200">Últimas Ventas</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {state.sales.length === 0 ? (
              <p className="text-stone-500 italic">No hay ventas registradas.</p>
            ) : (
              [...state.sales].reverse().map(sale => (
                <div key={sale.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-amber-600">{AGENCIES[sale.agencyId]}</span>
                    <span className="text-xs text-stone-500">{new Date(sale.date).toLocaleString()}</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {sale.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{PRODUCTS[item.productId].name}</span>
                        <span className="font-bold">{item.quantity}x</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registro de Actividad */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 md:col-span-2">
          <h3 className="text-xl font-bold mb-6 pb-3 border-b-2 border-stone-100 flex items-center gap-2">
            Registro de Actividad (Historial)
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {state.logs.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <p className="text-stone-500 text-lg">No hay actividad registrada aún.</p>
              </div>
            ) : (
              state.logs.map(log => {
                const isSale = log.type === 'sale';
                return (
                  <div 
                    key={log.id} 
                    className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${
                      isSale 
                        ? 'bg-emerald-50 border-l-emerald-500 border-t border-r border-b border-emerald-100' 
                        : 'bg-blue-50 border-l-blue-500 border-t border-r border-b border-blue-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs uppercase font-black px-3 py-1 rounded-full tracking-wider ${
                          isSale ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'
                        }`}>
                          {isSale ? 'VENTA' : 'EDICIÓN MANUAL'}
                        </span>
                        <span className="font-bold text-stone-800 text-lg">{log.editorName}</span>
                      </div>
                      <span className="text-sm font-medium text-stone-500 bg-white px-3 py-1 rounded-lg border border-stone-200 shadow-sm">
                        {new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-stone-100/50">
                      <p className="text-stone-700 font-medium text-base leading-relaxed">
                        {log.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
