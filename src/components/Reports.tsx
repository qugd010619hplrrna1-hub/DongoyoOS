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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-bold mb-4 pb-2 border-b border-stone-200">Registro de Actividad</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {state.logs.length === 0 ? (
              <p className="text-stone-500 italic">No hay actividad registrada.</p>
            ) : (
              state.logs.map(log => (
                <div key={log.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-stone-700">{log.editorName}</span>
                    <span className="text-xs text-stone-500">{new Date(log.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-stone-600">{log.description}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${log.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {log.type === 'sale' ? 'Venta' : 'Edición Manual'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
