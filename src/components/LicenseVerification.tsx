import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { verifyGumroadLicense, updateSubscriptionFromGumroad } from '@/services/gumroadService';
import { UserProfile } from '@/types/profile';
import { Check, X, Loader2 } from 'lucide-react';

interface LicenseVerificationProps {
  profile: UserProfile;
  onVerificationSuccess: () => void;
}

export default function LicenseVerification({ profile, onVerificationSuccess }: LicenseVerificationProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerifyLicense = async () => {
    if (!licenseKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a license key',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    console.log('Verifying license:', licenseKey);

    try {
      const result = await verifyGumroadLicense(licenseKey);
      console.log('Verification result:', result);

      if (result.success && result.purchase) {
        // Update subscription in Supabase
        const { error } = await updateSubscriptionFromGumroad(
          profile.id,
          licenseKey,
          result.purchase
        );

        if (error) {
          toast({
            title: 'Error',
            description: 'Failed to update subscription. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Success!',
          description: 'Your license has been verified successfully!',
        });

        setLicenseKey('');
        onVerificationSuccess();
      } else {
        toast({
          title: 'Invalid License',
          description: result.message || 'Invalid or expired license key.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('License verification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify license. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const isPaidUser = (profile.subscription_type as any) === 1 || profile.subscription_type === 'paid';
  const hasActiveLicense = isPaidUser && profile.license_key;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>License Verification</CardTitle>
            <CardDescription>
              Verify your Gumroad license to unlock Pro features
            </CardDescription>
          </div>
          {isPaidUser ? (
            <Badge className="bg-green-500 hover:bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          ) : (
            <Badge variant="outline">
              Free Plan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActiveLicense ? (
          <div className="space-y-2">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span className="font-medium">License Active</span>
              </div>
              {profile.subscription_end_date && (
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  Active until {new Date(profile.subscription_end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Your license is verified and you have access to all Pro features.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="license-key">Enter Your License Key</Label>
              <Input
                id="license-key"
                type="text"
                placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleVerifyLicense}
              disabled={isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify License'
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Don't have a license yet?</p>
              <a
                href="/pricing"
                className="text-primary hover:underline font-medium"
              >
                View pricing and purchase →
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
