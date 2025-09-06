import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  ArrowLeft,
  Check,
  Truck,
  Shield
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "../../node_modules/react-i18next";
import { useCart } from "../contexts/CartContext";
import { FlutterwavePayment } from "./FlutterwavePayment";
import { FlutterwaveResponse, FlutterwaveError } from "../services/flutterwaveService";

interface CheckoutPageProps {
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export function CheckoutPage({ onBack, onPlaceOrder }: CheckoutPageProps) {
  const { cartItems } = useCart();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    // Payment Information
    paymentMethod: "flutterwave",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    // Mobile Money
    mobileNumber: "",
    mobileProvider: "",
    // Additional
    saveInfo: false,
    differentBilling: false,
    agreeTerms: false,
  });

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const shipping = 35; // Fixed shipping cost
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  // Debug logging for payment calculation
  console.log('Payment calculation debug:', {
    cartItems: cartItems.length,
    subtotal,
    shipping,
    tax,
    total,
    totalType: typeof total,
    isNaN: isNaN(total)
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSuccess = useCallback((response: FlutterwaveResponse) => {
    console.log('Payment successful:', response);
    setPaymentStatus('success');
    
    const orderData = {
      items: cartItems,
      shipping: formData,
      payment: {
        method: formData.paymentMethod,
        tx_ref: response.data?.tx_ref,
        flw_ref: response.data?.flw_ref,
        status: 'completed'
      },
      totals: { subtotal, shipping, tax, total },
      timestamp: new Date(),
    };

    // Delay to show success state before proceeding
    setTimeout(() => {
      onPlaceOrder(orderData);
    }, 2000);
  }, [cartItems, formData, subtotal, shipping, tax, total, onPlaceOrder]);

  const handlePaymentError = useCallback((error: FlutterwaveError) => {
    console.error('Payment failed:', error);
    setPaymentStatus('error');
    setPaymentError(error.message);
  }, []);

  const handleSubmit = () => {
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    if (formData.paymentMethod === 'flutterwave') {
      // Payment will be handled by FlutterwavePayment component
      return;
    }

    // For other payment methods (mobile money, bank transfer)
    const orderData = {
      items: cartItems,
      shipping: formData,
      payment: {
        method: formData.paymentMethod,
        ...(formData.paymentMethod === 'card' ? {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
        } : {
          mobileNumber: formData.mobileNumber,
          provider: formData.mobileProvider,
        })
      },
      totals: { subtotal, shipping, tax, total },
      timestamp: new Date(),
    };

    onPlaceOrder(orderData);
  };

  const steps = [
    { id: 1, title: t("checkout.shipping"), icon: Truck },
    { id: 2, title: t("checkout.payment"), icon: CreditCard },
    { id: 3, title: t("checkout.review"), icon: Check },
  ];

  const rwandanDistricts = [
    "Kigali", "Nyanza", "Huye", "Muhanga", "Kamonyi", "Ruhango", "Nyaruguru",
    "Gisagara", "Nyamagabe", "Rusizi", "Nyamasheke", "Karongi", "Rutsiro",
    "Rubavu", "Nyabihu", "Ngororero", "Musanze", "Burera", "Gicumbi",
    "Rulindo", "Gakenke", "Gasabo", "Kicukiro", "Nyarugenge", "Rwamagana",
    "Nyagatare", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Bugesera"
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("checkout.backToCart")}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("checkout.title")}</h1>
          <p className="text-muted-foreground">{t("checkout.subtitle")}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-muted-foreground text-muted-foreground'
            }`}>
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span className={`ml-2 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t("checkout.shippingInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("checkout.firstName")} *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("checkout.lastName")} *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t("checkout.emailAddress")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("checkout.phoneNumber")} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House number, street name"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City/Town *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {rwandanDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save this information for faster checkout next time
                  </Label>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.district}
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flutterwave" id="flutterwave" />
                    <Label htmlFor="flutterwave" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Flutterwave (Card, Mobile Money, USSD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Transfer
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === 'flutterwave' && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely with Flutterwave. Supports Card, Mobile Money, and USSD payments.
                      </p>
                      <FlutterwavePayment
                        email={formData.email || ''}
                        amount={Number(total) || 0}
                        customerName={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
                        phoneNumber={formData.phone || ''}
                        metadata={{
                          customer_name: String(`${formData.firstName || ''} ${formData.lastName || ''}`.trim()),
                          phone: String(formData.phone || ''),
                          address: String(formData.address || ''),
                          city: String(formData.city || ''),
                          district: String(formData.district || ''),
                          items: cartItems.map(item => ({
                            name: String(item.product?.name || ''),
                            quantity: String(Number(item.quantity) || 0),
                            price: String(Number(item.total_price) || 0)
                          }))
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        disabled={!formData.email || !formData.firstName || !formData.lastName}
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'mobile' && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <div>
                      <Label htmlFor="mobileProvider">Mobile Provider *</Label>
                      <Select value={formData.mobileProvider} onValueChange={(value) => handleInputChange('mobileProvider', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Rwanda</SelectItem>
                          <SelectItem value="airtel">Airtel Rwanda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input
                        id="mobileNumber"
                        placeholder="+250 XXX XXX XXX"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'bank' && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      You will receive bank transfer instructions after placing your order.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => setCurrentStep(3)}
                  >
                    Review Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Review Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                        <div className="w-16 h-16 rounded overflow-hidden">
                                                  <ImageWithFallback
                          src={item.product.image || ''}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.product.brand?.name || 'Unknown Brand'}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-semibold">${item.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.district}</p>
                    <p>{formData.phone}</p>
                    <p>{formData.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div>
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="text-sm text-muted-foreground">
                    {formData.paymentMethod === 'flutterwave' && (
                      <p>Flutterwave (Card, Mobile Money, USSD)</p>
                    )}
                    {formData.paymentMethod === 'card' && (
                      <p>Credit/Debit Card ending in {formData.cardNumber.slice(-4)}</p>
                    )}
                    {formData.paymentMethod === 'mobile' && (
                      <p>{formData.mobileProvider?.toUpperCase()} Mobile Money - {formData.mobileNumber}</p>
                    )}
                    {formData.paymentMethod === 'bank' && (
                      <p>Bank Transfer</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-5">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Terms and Conditions</a>,{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>, and{" "}
                    <a href="#" className="text-primary hover:underline">Return Policy</a>
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setCurrentStep(2)}
                    disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                  >
                    Back
                  </Button>
                  {formData.paymentMethod === 'flutterwave' ? (
                    <div className="flex-1">
                      <FlutterwavePayment
                        email={formData.email || ''}
                        amount={Number(total) || 0}
                        customerName={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
                        phoneNumber={formData.phone || ''}
                        metadata={{
                          customer_name: String(`${formData.firstName || ''} ${formData.lastName || ''}`.trim()),
                          phone: String(formData.phone || ''),
                          address: String(formData.address || ''),
                          city: String(formData.city || ''),
                          district: String(formData.district || ''),
                          items: cartItems.map(item => ({
                            name: String(item.product?.name || ''),
                            quantity: String(Number(item.quantity) || 0),
                            price: String(Number(item.total_price) || 0)
                          }))
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        disabled={!formData.agreeTerms || !formData.email || !formData.firstName || !formData.lastName}
                      />
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!formData.agreeTerms}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Security Features */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>7-14 day delivery to Rwanda</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}