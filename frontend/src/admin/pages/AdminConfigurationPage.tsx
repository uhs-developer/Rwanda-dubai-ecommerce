import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useMutation, useQuery } from 'urql';
import { GET_ADMIN_SITE_CONFIG, UPDATE_SITE_CONFIG } from '../../graphql/admin';

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
            <Input defaultValue="Kora E-commerce" />
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

function ContentTab() {
  const [configResult] = useQuery({ query: GET_ADMIN_SITE_CONFIG });
  const [, updateMutation] = useMutation(UPDATE_SITE_CONFIG);

  const contact = configResult.data?.adminSiteConfig?.contact || {};
  const [form, setForm] = useState({
    addressDubai: contact.addressDubai || '',
    addressKigali: contact.addressKigali || '',
    phoneDubai: contact.phoneDubai || '',
    phoneKigali: contact.phoneKigali || '',
    supportEmail: contact.supportEmail || '',
    ordersEmail: contact.ordersEmail || '',
    whatsappNumber: contact.whatsappNumber || '',
    businessHours: JSON.stringify(contact.businessHours || { weekday: '9:00-18:00', saturday: '10:00-16:00', sunday: 'Closed' })
  });

  const save = async () => {
    try {
      const input = {
        contact: {
          addressDubai: form.addressDubai || null,
          addressKigali: form.addressKigali || null,
          phoneDubai: form.phoneDubai || null,
          phoneKigali: form.phoneKigali || null,
          supportEmail: form.supportEmail || null,
          ordersEmail: form.ordersEmail || null,
          whatsappNumber: form.whatsappNumber || null,
          businessHours: (() => { try { return JSON.parse(form.businessHours || '{}'); } catch { return null; } })(),
        }
      };
      const res = await updateMutation({ input });
      if (res.error) {
        return alert(res.error.message || 'Failed to save content settings');
      }
      alert('Content settings saved');
    } catch (e: any) {
      alert(e?.message || 'Failed to save content settings');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Content Settings</h3>
      <Card className="p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Dubai Address</label>
            <Input value={form.addressDubai} onChange={e => setForm(prev => ({ ...prev, addressDubai: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Kigali Address</label>
            <Input value={form.addressKigali} onChange={e => setForm(prev => ({ ...prev, addressKigali: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Dubai Phone</label>
            <Input value={form.phoneDubai} onChange={e => setForm(prev => ({ ...prev, phoneDubai: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Kigali Phone</label>
            <Input value={form.phoneKigali} onChange={e => setForm(prev => ({ ...prev, phoneKigali: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Support Email</label>
            <Input type="email" value={form.supportEmail} onChange={e => setForm(prev => ({ ...prev, supportEmail: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Orders Email</label>
            <Input type="email" value={form.ordersEmail} onChange={e => setForm(prev => ({ ...prev, ordersEmail: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp Number</label>
            <Input value={form.whatsappNumber} onChange={e => setForm(prev => ({ ...prev, whatsappNumber: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Business Hours (JSON)</label>
            <Input value={form.businessHours} onChange={e => setForm(prev => ({ ...prev, businessHours: e.target.value }))} />
            <p className="text-xs text-muted-foreground mt-1">Example: {`{"weekday":"9:00-18:00","saturday":"10:00-16:00","sunday":"Closed"}`}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={save}>Save Content Settings</Button>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab />
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

