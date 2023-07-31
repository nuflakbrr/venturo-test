import { ItemCart } from './itemCart';

export interface Cart {
  voucher_id: number;
  nominal_diskon: string | number;
  nominal_pesanan: string | number;
  items: ItemCart[];
}
