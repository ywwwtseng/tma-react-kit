import type { ReactNode } from 'react';


export interface View {
  path: string;
  tab?: {
    icon: ReactNode;
    text: string;
  };
  element: ReactNode;
}