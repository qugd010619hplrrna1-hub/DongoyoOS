import { ProductId, SupplyId, AgencyId } from './types';

export const PRODUCTS: Record<ProductId, { name: string, color: string, price: number }> = {
  fumarola: { name: 'Fumarola', color: 'bg-stone-800 text-white', price: 80 },
  ceniza_ale: { name: 'Ceniza Ale', color: 'bg-amber-700 text-white', price: 50 },
  bocho_cheve: { name: 'Bocho-Cheve', color: 'bg-emerald-600 text-white', price: 50 },
  pata_de_perro: { name: 'Pata de Perro', color: 'bg-zinc-400 text-black', price: 50 },
  atlixco_flores: { name: 'Atlixco de las flores', color: 'bg-rose-500 text-white', price: 50 },
  serenata: { name: 'Serenata', color: 'bg-indigo-900 text-white', price: 80 },
};

export const SUPPLIES: Record<SupplyId, { name: string, type: 'etiqueta' | 'corcholata' | 'botella' }> = {
  etiqueta_fumarola: { name: 'Etiqueta Fumarola', type: 'etiqueta' },
  etiqueta_ceniza_ale: { name: 'Etiqueta Ceniza Ale', type: 'etiqueta' },
  etiqueta_bocho_cheve: { name: 'Etiqueta Bocho-Cheve', type: 'etiqueta' },
  etiqueta_pata_de_perro: { name: 'Etiqueta Pata de Perro', type: 'etiqueta' },
  etiqueta_atlixco_flores: { name: 'Etiqueta Atlixco de las flores', type: 'etiqueta' },
  etiqueta_serenata: { name: 'Etiqueta Serenata', type: 'etiqueta' },
  corcholata_plateada: { name: 'Corcholata Plateada', type: 'corcholata' },
  corcholata_dorada: { name: 'Corcholata Dorada', type: 'corcholata' },
  corcholata_verde: { name: 'Corcholata Verde', type: 'corcholata' },
  corcholata_negra: { name: 'Corcholata Negra', type: 'corcholata' },
  corcholata_roja: { name: 'Corcholata Roja', type: 'corcholata' },
  botella_vacia: { name: 'Botella Vacía', type: 'botella' },
};

export const AGENCIES: Record<AgencyId, string> = {
  la_vottorina: 'La Vottorina',
  el_cerrito: 'El Cerrito',
  atlixtour: 'Atlixtour',
  don_goyo: 'Don Goyo',
  independiente: 'Independiente',
};

export const RECIPES: Record<ProductId, SupplyId[]> = {
  fumarola: ['etiqueta_fumarola', 'corcholata_negra', 'botella_vacia'],
  ceniza_ale: ['etiqueta_ceniza_ale', 'corcholata_dorada', 'botella_vacia'],
  bocho_cheve: ['etiqueta_bocho_cheve', 'corcholata_verde', 'botella_vacia'],
  pata_de_perro: ['etiqueta_pata_de_perro', 'corcholata_plateada', 'botella_vacia'],
  atlixco_flores: ['etiqueta_atlixco_flores', 'corcholata_roja', 'botella_vacia'],
  serenata: ['etiqueta_serenata', 'corcholata_negra', 'botella_vacia'],
};
