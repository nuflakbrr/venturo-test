import { FC } from 'react';

import { PageSEO } from '@/components/Common/SEO';
import { siteMetadata } from '@/data/siteMetadata';
import { useMenu } from '@/hooks/useMenu';
import { Menu } from '@/interfaces/menu';
import MenuCard from './components/MenuCard';

const ContainerHome: FC = () => {
  const { isLoading, menus } = useMenu();

  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
      />

      <main className="py-20">
        <div className="py-10">
          <section className="container mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="w-full px-4">
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-5">
                  {isLoading ? (
                    <p className="text-center">Memuat Data...</p>
                  ) : (
                    menus?.map((menu: Menu) => (
                      <MenuCard menus={menu} key={menu.id} />
                    ))
                  )}
                </div>

                {/* <details className="mt-5">
                  <summary>get menus</summary>
                  <pre>{JSON.stringify(menus, null, 2)}</pre>
                </details>

                <details className="mt-5">
                  <summary>get vouchers</summary>
                  <pre>{JSON.stringify(voucher, null, 2)}</pre>
                </details> */}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ContainerHome;
