import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';

const CROP_CYCLES: Record<string, number> = {
  "Carrot": 3,
  "Pumpkin": 4,
  "Green Chillies": 2,
  "Red Onions": 3,
  "Beans": 2,
  "Tomatoes": 3,
};

export function useCropRegistration() {
  const supabase = createClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const checkAndRegister = async (cropName: string, plantingDateStr: string) => {
    if (!user) return { success: false, status: 'error', message: "Please login to register." };
    setLoading(true);

    try {
      // 1. Calculate Harvest Month
      const plantingDate = new Date(plantingDateStr);
      const duration = CROP_CYCLES[cropName] || 3;
      const harvestDate = new Date(plantingDate);
      harvestDate.setMonth(harvestDate.getMonth() + duration);
      
      const harvestMonth = harvestDate.getMonth() + 1;
      const harvestMonthName = harvestDate.toLocaleString('default', { month: 'long' });

      // 2. Get Quota Limits
      const { data: limitData } = await supabase
        .from('production_limits')
        .select('max_farmers')
        .eq('crop_name', cropName)
        .eq('harvest_month', harvestMonth)
        .maybeSingle();

      const maxLimit = limitData?.max_farmers || 50;

      // 3. Count Current Registrations
      const { data: existingRegs } = await supabase
        .from('crop_registrations')
        .select('harvest_date')
        .eq('crop_name', cropName);

      const currentCount = existingRegs?.filter(reg => {
        return (new Date(reg.harvest_date).getMonth() + 1) === harvestMonth;
      }).length || 0;

      // --- NEW RISK CALCULATION ---
      const usagePercent = currentCount / maxLimit;
      const seatsLeft = maxLimit - currentCount;

      // A. RED LIGHT: Full
      if (currentCount >= maxLimit) {
        setLoading(false);
        return { 
          success: false, 
          status: 'error',
          harvestMonthName,
          message: `Market Full! 100% of seats taken for ${cropName} in ${harvestMonthName}. Oversupply guaranteed.` 
        };
      }

      // B. YELLOW LIGHT: High Risk (>80% Full)
      if (usagePercent >= 0.8) {
        // We still allow registration, but we warn them
        const { error } = await supabase.from('crop_registrations').insert({
            user_id: user.id,
            crop_name: cropName,
            planting_date: plantingDateStr,
            harvest_date: harvestDate.toISOString(),
            status: 'warning' // Mark as risky in DB
        });
        if (error) throw error;

        setLoading(false);
        return { 
          success: true, 
          status: 'warning', // ⚠️ Key change
          harvestMonthName,
          message: `⚠️ HIGH RISK! Market is 80% full. Only ${seatsLeft} spots left. Prices might be lower than expected.` 
        };
      }

      // C. GREEN LIGHT: Safe
      const { error } = await supabase.from('crop_registrations').insert({
        user_id: user.id,
        crop_name: cropName,
        planting_date: plantingDateStr,
        harvest_date: harvestDate.toISOString(),
        status: 'approved'
      });
      if (error) throw error;

      setLoading(false);
      return { 
        success: true, 
        status: 'success',
        harvestMonthName,
        message: `✅ Safe! Good market opportunity for ${cropName} in ${harvestMonthName}.` 
      };

    } catch (err: any) {
      console.error(err);
      setLoading(false);
      return { success: false, status: 'error', message: err.message };
    }
  };

  return { checkAndRegister, loading };
}