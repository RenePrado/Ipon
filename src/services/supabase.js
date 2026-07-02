import { createClient } from '@supabase/supabase-js'
import { reportError } from './errorReporter'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  reportError('supabase', new Error('Missing Supabase environment variables'), {
    missingUrl: !supabaseUrl,
    missingKey: !supabaseKey,
  });
}

export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null
