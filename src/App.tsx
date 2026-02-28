/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAppStore } from './store';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import { Beer, ClipboardList, BarChart3 } from 'lucide-react';

export default function App() {
  const { state, recordSale, updateInventory, clearData } = useAppStore();
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'reports'>('pos');

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <header className="bg-stone-900 text-amber-500 p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider uppercase flex items-center gap-2">
            <Beer className="w-8 h-8" />
            Don Goyo OS
          </h1>
          <nav className="flex gap-2">
            <button 
              onClick={() => setActiveTab('pos')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'pos' ? 'bg-amber-500 text-stone-900 font-bold' : 'hover:bg-stone-800'}`}
            >
              <Beer className="w-5 h-5" />
              <span className="hidden sm:inline">Vender</span>
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-amber-500 text-stone-900 font-bold' : 'hover:bg-stone-800'}`}
            >
              <ClipboardList className="w-5 h-5" />
              <span className="hidden sm:inline">Inventario</span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'reports' ? 'bg-amber-500 text-stone-900 font-bold' : 'hover:bg-stone-800'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Reportes</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 py-8">
        {activeTab === 'pos' && <POS state={state} onSale={recordSale} />}
        {activeTab === 'inventory' && <Inventory state={state} onUpdate={updateInventory} />}
        {activeTab === 'reports' && <Reports state={state} onClear={clearData} />}
      </main>
    </div>
  );
}
