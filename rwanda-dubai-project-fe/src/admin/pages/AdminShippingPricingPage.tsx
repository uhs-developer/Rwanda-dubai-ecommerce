import { useQuery, useMutation } from 'urql';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner';
import {
  GET_SHIPPING_METHODS,
  GET_SHIPPING_ROUTES,
  SET_METHOD_ROUTE_PRICE,
} from '../../graphql/admin';

export default function AdminShippingPricingPage() {
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [formData, setFormData] = useState({
    pricePerKg: 0,
    pricePerCbm: 0,
    minWeightKg: 0,
    maxWeightKg: 0,
    flatRate: 0,
    handlingFee: 0,
    fuelSurchargePercentage: 0,
    insurancePercentage: 0,
    customsClearanceFee: 0,
    customsDutyPercentage: 0,
    customsVatPercentage: 0,
    estimatedDaysMin: 0,
    estimatedDaysMax: 0,
    isActive: true,
  });

  // Queries
  const [methodsResult] = useQuery({
    query: GET_SHIPPING_METHODS,
    variables: { isActive: true },
  });

  const [routesResult] = useQuery({
    query: GET_SHIPPING_ROUTES,
    variables: { isActive: true },
  });

  // Mutation
  const [, setPriceMutation] = useMutation(SET_METHOD_ROUTE_PRICE);

  const methods = methodsResult.data?.shippingMethods || [];
  const routes = routesResult.data?.shippingRoutes || [];
  const loading = methodsResult.fetching || routesResult.fetching;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethodId || !selectedRouteId) {
      toast.error('Please select both a shipping method and route');
      return;
    }

    const input = {
      shippingMethodId: selectedMethodId,
      shippingRouteId: selectedRouteId,
      pricePerKg: formData.pricePerKg,
      pricePerCbm: formData.pricePerCbm,
      minWeightKg: formData.minWeightKg > 0 ? formData.minWeightKg : undefined,
      maxWeightKg: formData.maxWeightKg > 0 ? formData.maxWeightKg : undefined,
      flatRate: formData.flatRate > 0 ? formData.flatRate : undefined,
      handlingFee: formData.handlingFee,
      fuelSurchargePercentage: formData.fuelSurchargePercentage,
      insurancePercentage: formData.insurancePercentage,
      customsClearanceFee: formData.customsClearanceFee,
      customsDutyPercentage: formData.customsDutyPercentage,
      customsVatPercentage: formData.customsVatPercentage,
      estimatedDaysMin: formData.estimatedDaysMin > 0 ? formData.estimatedDaysMin : undefined,
      estimatedDaysMax: formData.estimatedDaysMax > 0 ? formData.estimatedDaysMax : undefined,
      isActive: formData.isActive,
    };

    const result = await setPriceMutation({ input });

    if (result.error) {
      toast.error(result.error.message || 'Failed to set pricing');
    } else {
      toast.success('Pricing configured successfully');
      // Reset form
      setFormData({
        pricePerKg: 0,
        pricePerCbm: 0,
        minWeightKg: 0,
        maxWeightKg: 0,
        flatRate: 0,
        handlingFee: 0,
        fuelSurchargePercentage: 0,
        insurancePercentage: 0,
        customsClearanceFee: 0,
        customsDutyPercentage: 0,
        customsVatPercentage: 0,
        estimatedDaysMin: 0,
        estimatedDaysMax: 0,
        isActive: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Shipping Pricing Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure pricing for each combination of shipping method and route
        </p>
      </div>

      {loading && <p>Loading data...</p>}

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method & Route Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Shipping Method *
              </label>
              <select
                className="w-full h-9 border rounded px-2 text-sm"
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                required
              >
                <option value="">Select a method</option>
                {methods.map((method: any) => (
                  <option key={method.id} value={method.id}>
                    {method.name} ({method.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Route *</label>
              <select
                className="w-full h-9 border rounded px-2 text-sm"
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                required
              >
                <option value="">Select a route</option>
                {routes.map((route: any) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Base Pricing */}
          <div>
            <h3 className="font-medium mb-3">Base Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price per KG ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pricePerKg}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerKg: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="15.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price per CBM ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.pricePerCbm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerCbm: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="500.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Flat Rate ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.flatRate}
                  onChange={(e) =>
                    setFormData({ ...formData, flatRate: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Weight Ranges */}
          <div>
            <h3 className="font-medium mb-3">Weight Range (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Weight (KG)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.minWeightKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minWeightKg: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Weight (KG)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.maxWeightKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxWeightKg: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Unlimited"
                />
              </div>
            </div>
          </div>

          {/* Additional Fees */}
          <div>
            <h3 className="font-medium mb-3">Additional Fees</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Handling Fee ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.handlingFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      handlingFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="50.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fuel Surcharge (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.fuelSurchargePercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelSurchargePercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="15.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Insurance (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.insurancePercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insurancePercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="2.00"
                />
              </div>
            </div>
          </div>

          {/* Customs Fees */}
          <div>
            <h3 className="font-medium mb-3">Customs Fees</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Clearance Fee ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.customsClearanceFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customsClearanceFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duty (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.customsDutyPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customsDutyPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="25.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">VAT (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.customsVatPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customsVatPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="18.00"
                />
              </div>
            </div>
          </div>

          {/* Delivery Timeframe */}
          <div>
            <h3 className="font-medium mb-3">Estimated Delivery (Days)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Days</label>
                <Input
                  type="number"
                  value={formData.estimatedDaysMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDaysMin: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Days</label>
                <Input
                  type="number"
                  value={formData.estimatedDaysMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDaysMax: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="7"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              id="isActive"
            />
            <label htmlFor="isActive" className="text-sm">
              Active
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Save Pricing Configuration</Button>
          </div>
        </form>
      </Card>

      {/* Example Calculation */}
      <Card className="p-4 bg-blue-50">
        <h3 className="font-medium mb-2">Example Cost Calculation</h3>
        <p className="text-sm text-muted-foreground mb-3">
          For a 50kg shipment worth $1,000:
        </p>
        <div className="text-sm space-y-1 font-mono">
          <div>Base Cost: 50kg × ${formData.pricePerKg}/kg = ${(50 * formData.pricePerKg).toFixed(2)}</div>
          <div>Handling Fee: ${formData.handlingFee.toFixed(2)}</div>
          <div>Fuel Surcharge: ${((50 * formData.pricePerKg) * (formData.fuelSurchargePercentage / 100)).toFixed(2)}</div>
          <div>Insurance: ${(1000 * (formData.insurancePercentage / 100)).toFixed(2)}</div>
          <div>Customs Clearance: ${formData.customsClearanceFee.toFixed(2)}</div>
          <div>Customs Duty: ${(1000 * (formData.customsDutyPercentage / 100)).toFixed(2)}</div>
          <div>Customs VAT: ${((1000 + 1000 * (formData.customsDutyPercentage / 100)) * (formData.customsVatPercentage / 100)).toFixed(2)}</div>
          <div className="border-t pt-1 mt-1 font-bold">
            Total: ${(
              50 * formData.pricePerKg +
              formData.handlingFee +
              (50 * formData.pricePerKg) * (formData.fuelSurchargePercentage / 100) +
              1000 * (formData.insurancePercentage / 100) +
              formData.customsClearanceFee +
              1000 * (formData.customsDutyPercentage / 100) +
              (1000 + 1000 * (formData.customsDutyPercentage / 100)) * (formData.customsVatPercentage / 100)
            ).toFixed(2)}
          </div>
        </div>
      </Card>
    </div>
  );
}
