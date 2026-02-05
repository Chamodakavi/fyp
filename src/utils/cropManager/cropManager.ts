import { createClient } from "@/utils/supabase/createClient"; // ✅ Correct Import

export const cropManager = {

  // 1. Check Bucket Status
  async getBucketStatus(cropName: string) {
    const supabase = createClient(); // ✅ Create client instance here
    
    try {
      // Get Target
      const { data: targetData, error: tErr } = await supabase
        .from('national_targets')
        .select('target_limit_mt')
        .eq('crop_name', cropName)
        .single();
        
      if (tErr) throw tErr;

      // Get Filled Amount
      const { data: filledData, error: fErr } = await supabase
        .from('farmer_registrations')
        .select('amount_mt')
        .eq('crop_name', cropName);

      if (fErr) throw fErr;

      const currentFilled = filledData.reduce((sum, row) => sum + row.amount_mt, 0);
      const limit = targetData.target_limit_mt;

      return {
        limit: limit,
        current: currentFilled,
        remaining: limit - currentFilled,
        isFull: currentFilled >= limit
      };
    } catch (error) {
      console.error("Status Error:", error);
      return null;
    }
  },

  // 2. Register Crop
  async registerCrop(farmerId: string, cropName: string, amountMt: number) {
    const supabase = createClient(); // ✅ Create client instance here as well
    
    const status = await this.getBucketStatus(cropName);
    
    if (!status) return { status: "error", message: "System Error" };
    
    if (amountMt > status.remaining) {
      return { status: "rejected", message: `Quota Exceeded! Only ${status.remaining} MT left.` };
    }

    // Now 'supabase' is defined in this scope, so this works:
    const { error } = await supabase
      .from('farmer_registrations')
      .insert([{ farmer_id: farmerId, crop_name: cropName, amount_mt: amountMt }]);

    if (error) return { status: "error", message: "Database Error" };

    return { status: "approved", message: "Success!" };
  }
};