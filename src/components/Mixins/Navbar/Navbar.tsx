import { FC, useState, useEffect } from 'react';
import { FaConciergeBell, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

import styles from './Navbar.module.css';
import { useCart } from '@/hooks/useCart';
import MenuCart from '@/components/Common/MenuCart';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const { carts } = useCart();

  // Navbar fixed position if scrolling
  useEffect(() => {
    window.onscroll = () => {
      const header = document.querySelector('header');
      const fixNav = header?.offsetTop ?? 0;

      if (window.pageYOffset > fixNav) {
        header?.classList.add(styles.navbarFixed);
      } else {
        header?.classList.remove(styles.navbarFixed);
      }
    };
  }, []);

  // Hamburger menu handler
  const hamburgerHandler = () => {
    const hamburger = document.querySelector('#hamburger');
    const navMenu = document.querySelector('#navMenu');

    setIsOpen(!isOpen);

    if (isOpen) {
      hamburger?.classList.remove(styles.hamburgerActive);
      navMenu?.classList.add('hidden');
    } else {
      hamburger?.classList.add(styles.hamburgerActive);
      navMenu?.classList.remove('hidden');
    }
  };

  return (
    <>
      <header className="bg-transparent absolute top-0 left-0 w-full flex items-center z-10">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="px-4">
                <Link href="/" legacyBehavior>
                  <a
                    className="inline-flex items-center gap-2 font-primary font-bold text-xl lg:text-2xl py-6 text-teal-500"
                    aria-label="logo"
                  >
                    <FaConciergeBell />
                    Main Course
                  </a>
                </Link>
              </div>
              <div className="flex items-center px-4">
                <button
                  id="hamburger"
                  name="hamburger"
                  type="button"
                  className="right-4 block absolute lg:hidden"
                  onClick={hamburgerHandler}
                >
                  <span
                    className={`${styles.hamburgerLine} origin-top-left transition duration-300 ease-in-out`}
                  ></span>
                  <span
                    className={`${styles.hamburgerLine} transition duration-300 ease-in-out`}
                  ></span>
                  <span
                    className={`${styles.hamburgerLine} origin-bottom-left transition duration-300 ease-in-out`}
                  ></span>
                </button>

                <nav
                  id="navMenu"
                  className="hidden absolute py-5 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none"
                >
                  <div className="block lg:flex">
                    <button
                      onClick={() => setCartOpen(!cartOpen)}
                      className="relative border border-teal-500 px-3 py-2 mx-8 lg:mx-2 rounded text-teal-500 hover:bg-teal-500 hover:text-white transition ease-in-out duration-200"
                    >
                      <div className="flex items-center justify-center">
                        <FaShoppingCart className="mr-2" />
                        Keranjang
                      </div>

                      {carts?.length > 0 && (
                        <div className="absolute w-6 h-6 right-0 top-0 -mt-2 -mr-2 rounded-full bg-red-500 text-white flex justify-center items-center">
                          {carts?.length || 0}
                        </div>
                      )}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {cartOpen && <MenuCart cartOpen={cartOpen} setCartOpen={setCartOpen} />}
    </>
  );
};

export default Navbar;
