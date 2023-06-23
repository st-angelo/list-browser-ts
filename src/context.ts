import { createContext } from 'react';
import { ListBrowserText } from './types';

type ListBrowserContextShape = {
  textResolver: (tooltip: ListBrowserText) => string;
};

export const ListBrowserContext = createContext<ListBrowserContextShape>({
  textResolver: () => ''
});
