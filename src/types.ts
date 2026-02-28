export type ProductId = 'fumarola' | 'ceniza_ale' | 'bocho_cheve' | 'pata_de_perro' | 'atlixco_flores' | 'serenata';
export type SupplyId = 'etiqueta_fumarola' | 'etiqueta_ceniza_ale' | 'etiqueta_bocho_cheve' | 'etiqueta_pata_de_perro' | 'etiqueta_atlixco_flores' | 'etiqueta_serenata' | 'corcholata_plateada' | 'corcholata_dorada' | 'corcholata_verde' | 'corcholata_negra' | 'corcholata_roja' | 'botella_vacia';
export type AgencyId = 'la_vottorina' | 'el_cerrito' | 'atlixtour' | 'don_goyo' | 'independiente';

export interface InventoryState {
  products: Record<ProductId, number>;
  supplies: Record<SupplyId, number>;
}

export interface SaleItem {
  productId: ProductId;
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  agencyId: AgencyId;
  items: SaleItem[];
}

export interface InventoryLog {
  id: string;
  date: string;
  editorName: string;
  type: 'manual_edit' | 'sale';
  description: string;
}

export interface AppState {
  inventory: InventoryState;
  sales: Sale[];
  logs: InventoryLog[];
}
