'use client';

import { useState, useEffect, useCallback } from 'react';
import { getHelpDesk } from '../api/helpdesk.api';
import type { HelpDesk } from '../types';

export function useHelpDesk(id: number) {
  const [hd, setHd] = useState<HelpDesk | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHelpDesk(id);
      setHd(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { hd, loading, reload };
}
