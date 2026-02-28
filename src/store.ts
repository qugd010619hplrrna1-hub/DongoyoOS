import { useState, useEffect } from 'react';
import { AppState, ProductId, SupplyId, AgencyId, SaleItem } from './types';
import { RECIPES, PRODUCTS, SUPPLIES } from './constants';

const STORAGE_KEY = 'don_goyo_os_data';

const defaultState: AppState = {
  inventory: {
    products: { fumarola: 0, ceniza_ale: 0, bocho_cheve: 0, pata_de_perro: 0, atlixco_flores: 0, serenata: 0 },
    supplies: {
      etiqueta_fumarola: 0, etiqueta_ceniza_ale: 0, etiqueta_bocho_cheve: 0, etiqueta_pata_de_perro: 0, etiqueta_atlixco_flores: 0, etiqueta_serenata: 0,
      corcholata_plateada: 0, corcholata_dorada: 0, corcholata_verde: 0, corcholata_negra: 0, corcholata_roja: 0,
      botella_vacia: 0
    }
  },
  sales: [],
  logs: []
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing local storage", e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const recordSale = (agencyId: AgencyId, items: SaleItem[]) => {
    setState(prev => {
      const newInventory = {
        products: { ...prev.inventory.products },
        supplies: { ...prev.inventory.supplies }
      };

      let descriptionParts: string[] = [];

      items.forEach(item => {
        // Descuenta la cerveza terminada
        newInventory.products[item.productId] -= item.quantity;
        descriptionParts.push(`${item.quantity} ${PRODUCTS[item.productId].name}`);
        
        // Descuenta los insumos según la receta
        const recipe = RECIPES[item.productId];
        recipe.forEach(supplyId => {
          newInventory.supplies[supplyId] -= item.quantity;
        });
      });

      const newSale = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        agencyId,
        items
      };

      const newLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        editorName: 'Sistema (Venta Automática)',
        type: 'sale' as const,
        description: `Venta registrada en ${agencyId}: ${descriptionParts.join(', ')}`
      };

      return {
        ...prev,
        inventory: newInventory,
        sales: [...prev.sales, newSale],
        logs: [newLog, ...prev.logs]
      };
    });
  };

  const updateInventory = (editorName: string, newProducts: Record<ProductId, number>, newSupplies: Record<SupplyId, number>) => {
    setState(prev => {
      const changes: string[] = [];

      (Object.keys(newProducts) as ProductId[]).forEach(id => {
        const oldVal = prev.inventory.products[id];
        const newVal = newProducts[id];
        if (oldVal !== newVal) {
          const diff = newVal - oldVal;
          const sign = diff > 0 ? '+' : '';
          changes.push(`${PRODUCTS[id].name}: ${oldVal} -> ${newVal} (${sign}${diff})`);
        }
      });

      (Object.keys(newSupplies) as SupplyId[]).forEach(id => {
        const oldVal = prev.inventory.supplies[id];
        const newVal = newSupplies[id];
        if (oldVal !== newVal) {
          const diff = newVal - oldVal;
          const sign = diff > 0 ? '+' : '';
          changes.push(`${SUPPLIES[id].name}: ${oldVal} -> ${newVal} (${sign}${diff})`);
        }
      });

      const newLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        editorName,
        type: 'manual_edit' as const,
        description: changes.length > 0 ? `Cambios: ${changes.join(', ')}` : 'Inventario guardado sin cambios'
      };

      return {
        ...prev,
        inventory: {
          products: newProducts,
          supplies: newSupplies
        },
        logs: [newLog, ...prev.logs]
      };
    });
  };

  const clearData = () => {
    if(confirm("¿Estás seguro de borrar todos los datos? Esto no se puede deshacer.")) {
        setState(defaultState);
    }
  }

  return { state, recordSale, updateInventory, clearData };
}
