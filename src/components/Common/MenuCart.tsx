/* eslint-disable indent */
import { FC, useState, useCallback } from 'react';
import {
  FaConciergeBell,
  FaMinus,
  FaPlus,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';

import { useAxios } from '@/hooks/useAxios';
import { ItemCart } from '@/interfaces/itemCart';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/formatCurrency';
import { errorToast, successToast } from '@/lib/toastNotify';

type Props = {
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
};

const MenuCart: FC<Props> = ({ cartOpen, setCartOpen }) => {
  const [kodeVoucher, setKodeVoucher] = useState<string>('');
  const [voucher_id, setVoucherId] = useState<number | any>();
  const [messageVoucher, setMessageVoucher] = useState<string>('');
  const [nominalVoucher, setNominalVoucher] = useState<number | any>();
  const [orderId, setOrderId] = useState<number | any>();

  const axios = useAxios();
  const { carts, addNotes, removeItem, clearCart } = useCart();

  const totalHarga = carts?.reduce(
    (total: number, item: ItemCart) => total + item?.harga,
    0
  );

  const handleGetVoucher = useCallback(async () => {
    const { data, status } = await axios.get(`vouchers?kode=${kodeVoucher}`);

    if (status === 200 && data.status_code === 200) {
      setMessageVoucher('Yay! Kode voucher berhasil digunakan');
      setVoucherId(data.datas.id);
      setNominalVoucher(data.datas.nominal);
    } else {
      setMessageVoucher(data?.message);
      setVoucherId(0);
      setNominalVoucher(0);
    }
  }, [axios, kodeVoucher]);

  const handleSubmitOrder = useCallback(async () => {
    const sendData = {
      voucher_id,
      nominal_diskon: JSON.stringify(nominalVoucher),
      nominal_pesanan: JSON.stringify(totalHarga),
      items: carts?.map((item: ItemCart) => ({
        id: item.id,
        harga: item.harga,
        catatan: item.catatan,
      })),
    };

    try {
      const { data, status } = await axios.post('order', sendData);

      if (status === 200 && data.status_code === 200) {
        successToast(data?.message);
        setOrderId(data.id);
      } else {
        errorToast(data?.message);
      }
    } catch (error) {
      errorToast('Order gagal dibuat');
    }
  }, [axios, carts, nominalVoucher, totalHarga, voucher_id]);

  const handleCancelOrder = useCallback(async () => {
    try {
      const { data, status } = await axios.post(`order/cancel/${orderId}`);

      if (status === 200 && data.status_code === 200) {
        successToast(data?.message);
        setOrderId(0);
        clearCart();
        localStorage.clear();
        setCartOpen(false);
      } else {
        errorToast(data?.message);
      }
    } catch (error) {
      errorToast('Data gagal ditemukan');
    }
  }, [axios, clearCart, orderId, setCartOpen]);

  return (
    <section className="fixed container mx-auto z-50">
      <div className="relative w-full">
        <div className="absolute -z-50 w-screen h-screen bg-black opacity-70"></div>
        <div className="absolute top-0 right-0">
          <div className="bg-white top-0 right-0 w-auto h-screen px-4">
            <div className="flex items-center justify-between py-2">
              <div className="inline-flex font-primary font-bold text-xl lg:text-2xl text-teal-500 items-center gap-2">
                <FaConciergeBell />
                Main Course
              </div>

              <button onClick={() => setCartOpen(!cartOpen)}>
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden w-full max-h-[275px]">
              {carts?.length > 0 ? (
                carts?.map((cart: any, i: number) => (
                  <div key={i}>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={cart.gambar}
                          alt="img"
                          className="w-24 h-w-24 object-cover rounded"
                        />

                        <div>
                          <div className="flex flex-col">
                            <h1 className="font-semibold text-xl mt-1">
                              {cart.nama}
                            </h1>
                            <p className="font-medium text-lg mb-2 text-teal-500">
                              {formatCurrency(cart.harga)}
                            </p>
                          </div>

                          <div className="w-full flex gap-2">
                            <p>{cart.catatan || 'Tidak ada Catatan'}</p>

                            <div className="flex items-end justify-end self-end">
                              <div className="flex items-center gap-2">
                                <button className="bg-teal-500 text-white px-3 py-2 rounded">
                                  <FaMinus className="text-sm" />
                                </button>

                                <div>
                                  <span>1</span>
                                </div>

                                <button className="bg-teal-500 text-white px-3 py-2 rounded">
                                  <FaPlus className="text-sm" />
                                </button>

                                <button
                                  onClick={() => removeItem(cart.id)}
                                  className="bg-red-500 text-white px-3 py-2 rounded"
                                >
                                  <FaTrash className="text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="w-full rounded border border-gray-300 mt-2"
                      placeholder="Masukkan catatan disini... (wajib)"
                      onChange={(e) => addNotes(cart.id, e.target.value)}
                      value={cart.catatan}
                      required
                      min={0}
                      max={20}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center mt-2">Tidak ada pesanan</p>
              )}
            </div>

            <hr className="my-3" />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGetVoucher();
              }}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <label htmlFor="voucher">Tambahkan Kupon</label>
                <input
                  type="text"
                  value={kodeVoucher}
                  onChange={(e) => setKodeVoucher(e.target.value)}
                  placeholder="Masukkan kupon disini... (wajib)"
                  className="w-full rounded border border-gray-300 mt-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-teal-500 text-white rounded px-3 py-2"
              >
                Cek
              </button>

              <button
                onClick={() => {
                  setKodeVoucher('');
                  setMessageVoucher('');
                  setNominalVoucher(0);
                }}
                className="bg-red-500 text-white rounded px-3 py-2"
              >
                Hapus
              </button>
            </form>

            {messageVoucher && (
              <div className="flex items-center justify-between mt-2">
                <p>{messageVoucher}</p>
                <p>{formatCurrency(nominalVoucher || 0)}</p>
              </div>
            )}

            <hr className="my-3" />

            <div className="flex items-center justify-between">
              <p>Total Pesanan</p>
              <p>{formatCurrency(totalHarga || 0)}</p>
            </div>

            {nominalVoucher > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <p>Potongan Harga</p>
                  <p>{formatCurrency(nominalVoucher || 0)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p>Total Pembayaran</p>
                  <p>
                    {formatCurrency(
                      nominalVoucher < totalHarga
                        ? totalHarga - nominalVoucher
                        : nominalVoucher > totalHarga
                        ? 0
                        : 0
                    )}
                  </p>
                </div>
              </>
            )}

            <button
              onClick={() => clearCart()}
              className="w-full bg-red-500 text-white rounded px-3 py-2 mt-3"
            >
              Hapus Semua Pesanan
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmitOrder();
              }}
              className="w-full bg-teal-500 text-white rounded px-3 py-2 mt-3"
            >
              Buat Pesanan
            </button>

            {orderId > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCancelOrder();
                }}
                className="w-full bg-red-500 text-white rounded px-3 py-2 mt-3"
              >
                Batalkan Pesanan
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuCart;
