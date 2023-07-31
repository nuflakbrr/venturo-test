import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';

import { Menu } from '@/interfaces/menu';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/formatCurrency';

type Props = {
  menus?: Menu;
};

const MenuCard: FC<Props> = ({ menus }) => {
  const { addItem } = useCart();

  return (
    <section className="col-span-2">
      <div className="bg-white shadow-md rounded p-3">
        <div className="flex flex-col justify-center">
          <img
            src={menus?.gambar}
            alt="menu"
            className="w-full h-40 object-cover rounded"
            loading="lazy"
          />
          <h1 className="font-semibold text-xl mt-1">{menus?.nama}</h1>
          <p className="font-medium text-lg mt-1 mb-2 text-teal-500">
            {formatCurrency(menus?.harga)}
          </p>
          <button
            onClick={() =>
              addItem({
                id: menus?.id,
                gambar: menus?.gambar,
                nama: menus?.nama,
                harga: menus?.harga,
                catatan: '',
              })
            }
            className="flex items-center justify-center px-3 py-2 bg-teal-500 text-white text-sm font-bold rounded"
          >
            <FaPlus className="mr-2" /> Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuCard;
