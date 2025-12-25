import { createContext } from 'react';

import type { YjsContextValue } from '@/types';

export const YjsContext = createContext<YjsContextValue | null>(null);
