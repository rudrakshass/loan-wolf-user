import { supabase } from './supabase/client';
import type { LenderPersonalDetails } from '@/types/lender';

export async function updateLenderDetails(
  lenderId: string, 
  personalDetails: LenderPersonalDetails
) {
  try {
    // First check if lender exists
    const { data: existingLender, error: fetchError } = await supabase
      .from('lenders')
      .select('id')
      .eq('id', lenderId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingLender) {
      // Update existing lender
      const { data, error } = await supabase
        .from('lenders')
        .update({
          personaldetail: personalDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', lenderId)
        .select();

      if (error) throw error;
      return { data, error: null };
    } else {
      // Insert new lender
      const { data, error } = await supabase
        .from('lenders')
        .insert({
          id: lenderId,
          personaldetail: personalDetails,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
