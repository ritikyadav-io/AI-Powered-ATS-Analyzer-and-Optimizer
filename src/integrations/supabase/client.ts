// Automatically generated with safety fallbacks to prevent white screen crashes
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://c--bb7987ce-bd24-47cd-9ad9-06d6475ae5a8-prod.lovable.cloud";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_T9Pm9751oB0yJEB7-udQ9A_vCDPH-oQ";

function isNewSupabaseApiKey(value?: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    if (supabaseKey) {
      headers.set('apikey', supabaseKey);
    }
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient<Database>(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_PUBLISHABLE_KEY || "placeholder-key",
  {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY || ""),
    },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

