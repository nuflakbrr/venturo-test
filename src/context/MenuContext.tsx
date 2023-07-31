import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Menu } from '@/interfaces/menu';
import { useAxios } from '@/hooks/useAxios';

type ContextType = {
  menus?: Menu[];
  isLoading: boolean;
};

const defaultValue: ContextType = {
  isLoading: false,
};

const MenuContext = createContext<ContextType>(defaultValue);

export const MenuProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [menus, setMenus] = useState<Menu[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const axios = useAxios();

  const getMenus = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get('menus');
      setMenus(data.datas);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    getMenus();
  }, [getMenus]);

  return (
    <MenuContext.Provider value={{ menus, isLoading }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
