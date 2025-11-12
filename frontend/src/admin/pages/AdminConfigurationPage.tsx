import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Placeholder pages for configuration
function TaxesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tax Rates</h3>
        <Button>Add Tax Rate</Button>
      </div>
      <Card className="p-4">
        <div className="text-muted-foreground text-center py-8">
          Tax rates configuration will be implemented here.
          <br />
          <small>Create tax rates for different countries/regions.</small>
        </div>
      </Card>
    </div>
  );
}

function ShippingTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Methods</h3>
        <Button>Add Shipping Method</Button>
      </div>
      <Card className="p-4">
        <div className="text-muted-foreground text-center py-8">
          Shipping methods configuration will be implemented here.
          <br />
          <small>Configure shipping rates, zones, and carriers.</small>
        </div>
      </Card>
    </div>
  );
}

function CouponsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Coupons & Discounts</h3>
        <Button>Create Coupon</Button>
      </div>
      <Card className="p-4">
        <div className="text-muted-foreground text-center py-8">
          Coupons and discount codes will be managed here.
          <br />
          <small>Create percentage or fixed-amount discount coupons.</small>
        </div>
      </Card>
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Methods</h3>
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <strong>Credit Card (Stripe)</strong>
              <p className="text-xs text-muted-foreground">Accept card payments via Stripe</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <strong>Mobile Money</strong>
              <p className="text-xs text-muted-foreground">MTN, Airtel, Tigo</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <strong>Cash on Delivery</strong>
              <p className="text-xs text-muted-foreground">Pay when you receive</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">General Settings</h3>
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Store Name</label>
            <Input defaultValue="TechBridge E-commerce" />
          </div>
          <div>
            <label className="text-sm font-medium">Store Email</label>
            <Input type="email" defaultValue="support@techbridge.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <select className="w-full border rounded px-3 py-2">
              <option>USD ($)</option>
              <option>RWF (₣)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Time Zone</label>
            <select className="w-full border rounded px-3 py-2">
              <option>Africa/Kigali</option>
              <option>UTC</option>
            </select>
          </div>
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminConfigurationPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Store Configuration</h2>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="taxes">
          <TaxesTab />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingTab />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponsTab />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

