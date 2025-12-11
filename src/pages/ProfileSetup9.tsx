import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, DollarSign } from 'lucide-react';
import ProfileSetupLayout from '@/components/ProfileSetupLayout';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  method_type: string;
  paypal_email: string;
  stripe_email: string;
  upi_id: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  cardholder_name: string;
  is_default: boolean;
}

const ProfileSetup9 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    method_type: '',
    paypal_email: '',
    stripe_email: '',
    upi_id: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    cardholder_name: '',
    is_default: true
  });

  useEffect(() => {
    if (profile) {
      fetchPaymentMethod();
    }
  }, [profile]);

  const fetchPaymentMethod = async () => {
    if (!profile) return;
    
    const { data, error } = await supabase
      .from('profile_payment_methods')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (!error && data) {
      setPaymentMethod({
        method_type: data.method_type,
        paypal_email: data.paypal_email || '',
        stripe_email: data.stripe_email || '',
        upi_id: data.upi_id || '',
        card_number: data.card_number || '',
        card_expiry: data.card_expiry || '',
        card_cvv: data.card_cvv || '',
        cardholder_name: data.cardholder_name || '',
        is_default: data.is_default || true
      });
    }
  };

  const validatePaymentMethod = () => {
    if (!paymentMethod.method_type) {
      return "Please select a payment method";
    }

    switch (paymentMethod.method_type) {
      case 'PayPal':
        if (!paymentMethod.paypal_email) {
          return "Please enter your PayPal email";
        }
        break;
      case 'Stripe':
        if (!paymentMethod.stripe_email) {
          return "Please enter your Stripe email";
        }
        break;
      case 'UPI':
        if (!paymentMethod.upi_id) {
          return "Please enter your UPI ID";
        }
        break;
      case 'Card':
        if (!paymentMethod.card_number || !paymentMethod.card_expiry || !paymentMethod.card_cvv || !paymentMethod.cardholder_name) {
          return "Please fill in all card details";
        }
        break;
    }
    return null;
  };

  const handleComplete = async () => {
    const validationError = validatePaymentMethod();
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Update profile as completed
    const { error: profileError } = await updateProfile({
      setup_step: 9,
      is_completed: true
    });

    if (profileError) {
      toast({
        title: "Error",
        description: "Failed to complete profile setup",
        variant: "destructive",
      });
      return;
    }

    // Delete existing payment methods
    await supabase
      .from('profile_payment_methods')
      .delete()
      .eq('profile_id', profile?.id);

    // Insert new payment method
    const paymentData = {
      profile_id: profile?.id,
      method_type: paymentMethod.method_type,
      paypal_email: paymentMethod.method_type === 'PayPal' ? paymentMethod.paypal_email : null,
      stripe_email: paymentMethod.method_type === 'Stripe' ? paymentMethod.stripe_email : null,
      upi_id: paymentMethod.method_type === 'UPI' ? paymentMethod.upi_id : null,
      card_number: paymentMethod.method_type === 'Card' ? paymentMethod.card_number : null,
      card_expiry: paymentMethod.method_type === 'Card' ? paymentMethod.card_expiry : null,
      card_cvv: paymentMethod.method_type === 'Card' ? paymentMethod.card_cvv : null,
      cardholder_name: paymentMethod.method_type === 'Card' ? paymentMethod.cardholder_name : null,
      is_default: paymentMethod.is_default
    };

    const { error: paymentError } = await supabase
      .from('profile_payment_methods')
      .insert(paymentData);

    if (paymentError) {
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your developer profile is now complete!",
    });

    // Redirect to dashboard
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/profile-setup/8');
  };

  const renderPaymentFields = () => {
    switch (paymentMethod.method_type) {
      case 'PayPal':
        return (
          <div>
            <Label htmlFor="paypal_email">PayPal Email *</Label>
            <Input
              id="paypal_email"
              type="email"
              value={paymentMethod.paypal_email}
              onChange={(e) => setPaymentMethod(prev => ({ ...prev, paypal_email: e.target.value }))}
              placeholder="your-email@example.com"
              className="mt-1"
            />
          </div>
        );
      case 'Stripe':
        return (
          <div>
            <Label htmlFor="stripe_email">Stripe Email *</Label>
            <Input
              id="stripe_email"
              type="email"
              value={paymentMethod.stripe_email}
              onChange={(e) => setPaymentMethod(prev => ({ ...prev, stripe_email: e.target.value }))}
              placeholder="your-email@example.com"
              className="mt-1"
            />
          </div>
        );
      case 'UPI':
        return (
          <div>
            <Label htmlFor="upi_id">UPI ID *</Label>
            <Input
              id="upi_id"
              value={paymentMethod.upi_id}
              onChange={(e) => setPaymentMethod(prev => ({ ...prev, upi_id: e.target.value }))}
              placeholder="yourname@bank"
              className="mt-1"
            />
          </div>
        );
      case 'Card':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="cardholder_name">Cardholder Name *</Label>
              <Input
                id="cardholder_name"
                value={paymentMethod.cardholder_name}
                onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardholder_name: e.target.value }))}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="card_number">Card Number *</Label>
              <Input
                id="card_number"
                value={paymentMethod.card_number}
                onChange={(e) => setPaymentMethod(prev => ({ ...prev, card_number: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="card_expiry">Expiry Date *</Label>
              <Input
                id="card_expiry"
                value={paymentMethod.card_expiry}
                onChange={(e) => setPaymentMethod(prev => ({ ...prev, card_expiry: e.target.value }))}
                placeholder="MM/YY"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="card_cvv">CVV *</Label>
              <Input
                id="card_cvv"
                value={paymentMethod.card_cvv}
                onChange={(e) => setPaymentMethod(prev => ({ ...prev, card_cvv: e.target.value }))}
                placeholder="123"
                className="mt-1"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ProfileSetupLayout
      step={9}
      title="Payment Method"
      description="Set up how you'd like to receive payments from clients."
      onNext={handleComplete}
      onBack={handleBack}
      nextDisabled={!paymentMethod.method_type}
    >
      <div className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <Label>Preferred Payment Method *</Label>
          <Select
            value={paymentMethod.method_type}
            onValueChange={(value) => setPaymentMethod(prev => ({ 
              ...prev, 
              method_type: value,
              // Reset other fields when changing method
              paypal_email: '',
              stripe_email: '',
              upi_id: '',
              card_number: '',
              card_expiry: '',
              card_cvv: '',
              cardholder_name: ''
            }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PayPal">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  PayPal
                </div>
              </SelectItem>
              <SelectItem value="Stripe">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Stripe
                </div>
              </SelectItem>
              <SelectItem value="UPI">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  UPI (India)
                </div>
              </SelectItem>
              <SelectItem value="Card">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit/Debit Card
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method Fields */}
        {paymentMethod.method_type && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            {renderPaymentFields()}
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">🔒 Security & Privacy</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Your payment information is encrypted and secure</li>
            <li>• We never store sensitive card details</li>
            <li>• You can update your payment method anytime</li>
            <li>• Payments are processed through secure payment gateways</li>
          </ul>
        </div>

        {/* Default Payment Method */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_default"
            checked={paymentMethod.is_default}
            onCheckedChange={(checked) => setPaymentMethod(prev => ({ ...prev, is_default: !!checked }))}
          />
          <Label htmlFor="is_default">Set as default payment method</Label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🎉 Almost Done!</h3>
          <p className="text-sm text-blue-800">
            You're completing the final step of your developer profile setup. 
            Once you add your payment method, you'll be ready to start receiving project invitations from clients!
          </p>
        </div>
      </div>
    </ProfileSetupLayout>
  );
};

export default ProfileSetup9;
