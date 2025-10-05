import { supabase } from '@/integrations/supabase/client';

const GUMROAD_ACCESS_TOKEN = 'BEA6_TuCBnp6RYeVw7DqrrjayXpIipHu9oc8E2Gp37I';
const GUMROAD_PRODUCT_PERMALINK = 'aedrs';

export interface GumroadLicenseResponse {
  success: boolean;
  purchase?: {
    email: string;
    seller_id: string;
    product_id: string;
    product_name: string;
    permalink: string;
    product_permalink: string;
    sale_id: string;
    sale_timestamp: string;
    created_at: string;
    full_name: string;
    variants: string;
    refunded: boolean;
    disputed: boolean;
    dispute_won: boolean;
    chargebacked: boolean;
    subscription_id?: string;
    subscription_cancelled_at?: string;
    subscription_failed_at?: string;
    recurrence?: string;
  };
  message?: string;
}

export const verifyGumroadLicense = async (licenseKey: string): Promise<GumroadLicenseResponse> => {
  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        product_permalink: GUMROAD_PRODUCT_PERMALINK,
        license_key: licenseKey,
        increment_uses_count: 'false',
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying Gumroad license:', error);
    return {
      success: false,
      message: 'Failed to verify license. Please try again.',
    };
  }
};

export const updateSubscriptionFromGumroad = async (
  userId: string,
  licenseKey: string,
  gumroadData: GumroadLicenseResponse['purchase']
) => {
  if (!gumroadData) return { error: 'No purchase data available' };

  const startDate = new Date(gumroadData.created_at);
  let endDate = new Date(startDate);
  
  // Check if it's a subscription
  if (gumroadData.subscription_id) {
    // For subscriptions, set end date to 1 month from start
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    // For one-time purchases, set to 1 year
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Check if subscription is cancelled or failed
  const isActive = !gumroadData.subscription_cancelled_at && 
                   !gumroadData.subscription_failed_at &&
                   !gumroadData.refunded &&
                   !gumroadData.disputed &&
                   !gumroadData.chargebacked;

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_type: (isActive ? 1 : 0) as any,
      subscription_start_date: isActive ? startDate.toISOString() : null,
      subscription_end_date: isActive ? endDate.toISOString() : null,
      subscription_updated_at: new Date().toISOString(),
      license_key: isActive ? licenseKey : null,
      gumroad_subscription_id: gumroadData.subscription_id || null,
      gumroad_sale_id: gumroadData.sale_id,
      product_id: gumroadData.product_id,
      subscription_status: isActive ? 'active' : 'inactive',
      has_license: isActive,
    })
    .eq('id', userId);

  console.log('Subscription updated:', { userId, isActive, error });

  return { error };
};

export const checkLicenseExpiry = async (userId: string, licenseKey: string) => {
  // Verify the license with Gumroad
  const result = await verifyGumroadLicense(licenseKey);
  
  if (!result.success || !result.purchase) {
    // License is invalid or expired, downgrade to free
    await supabase
      .from('profiles')
      .update({
        subscription_type: 0 as any,
        subscription_end_date: null,
        license_key: null,
        subscription_status: 'expired',
        has_license: false,
      })
      .eq('id', userId);
    
    return { active: false, error: 'License expired or invalid' };
  }

  // Check if subscription is still active
  const isActive = !result.purchase.subscription_cancelled_at && 
                   !result.purchase.subscription_failed_at &&
                   !result.purchase.refunded &&
                   !result.purchase.disputed &&
                   !result.purchase.chargebacked;

  if (!isActive) {
    // Downgrade to free
    await supabase
      .from('profiles')
      .update({
        subscription_type: 0 as any,
        subscription_end_date: null,
        license_key: null,
        subscription_status: 'expired',
        has_license: false,
      })
      .eq('id', userId);
    
    return { active: false, error: 'Subscription inactive' };
  }

  return { active: true, purchase: result.purchase };
};
