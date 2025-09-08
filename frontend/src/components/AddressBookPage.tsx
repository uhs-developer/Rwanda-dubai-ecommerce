import { useState, useEffect } from "react";
import { CustomerDashboardService, Address, CreateAddressData } from "../services/customerDashboard";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft,
  MapPin,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AddressBookPageProps {
  onBack: () => void;
}

export function AddressBookPage({ onBack }: AddressBookPageProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateAddressData>({
    type: 'home',
    is_default: false,
    name: '',
    company: '',
    street: '',
    apartment: '',
    city: '',
    district: '',
    country: 'Rwanda',
    phone: '',
    postal_code: ''
  });

  // Load addresses data
  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await CustomerDashboardService.getAddresses();

      if (response.success && response.data) {
        setAddresses(response.data);
      } else {
        throw new Error(response.message || 'Failed to load addresses');
      }
    } catch (error: any) {
      console.error('Error loading addresses:', error);
      setError(error.message || 'Failed to load addresses');
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAddresses().finally(() => setIsRefreshing(false));
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      is_default: false,
      name: '',
      company: '',
      street: '',
      apartment: '',
      city: '',
      district: '',
      country: 'Rwanda',
      phone: '',
      postal_code: ''
    });
  };

  const handleAddAddress = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEditAddress = (addressId: number) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type,
        is_default: address.is_default,
        name: address.name,
        company: address.company || '',
        street: address.street,
        apartment: address.apartment || '',
        city: address.city,
        district: address.district,
        country: address.country,
        phone: address.phone,
        postal_code: address.postal_code || ''
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await CustomerDashboardService.deleteAddress(addressId);
      
      if (response.success) {
        toast.success('Address deleted successfully');
        loadAddresses(); // Reload addresses
      } else {
        throw new Error(response.message || 'Failed to delete address');
      }
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const response = await CustomerDashboardService.setDefaultAddress(addressId);
      
      if (response.success) {
        toast.success('Default address updated');
        loadAddresses(); // Reload addresses
      } else {
        throw new Error(response.message || 'Failed to set default address');
      }
    } catch (error: any) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const handleSubmitAddress = async () => {
    try {
      setIsSubmitting(true);

      // Basic validation
      if (!formData.name || !formData.street || !formData.city || !formData.district || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }

      let response;
      if (editingAddress) {
        // Update existing address
        response = await CustomerDashboardService.updateAddress({
          id: editingAddress.id,
          ...formData
        });
      } else {
        // Create new address
        response = await CustomerDashboardService.createAddress(formData);
      }

      if (response.success) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingAddress(null);
        resetForm();
        loadAddresses(); // Reload addresses
      } else {
        throw new Error(response.message || 'Failed to save address');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {address.name}
              {address.is_default && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Default
                </span>
            )}
          </CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {address.type} Address
            </p>
          </div>
          <div className="flex gap-2">
            {!address.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(address.id)}
              >
                Set Default
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditAddress(address.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteAddress(address.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Address:</span> {address.street}
            {address.apartment && `, ${address.apartment}`}
          </div>
          <div className="text-sm">
            <span className="font-medium">City:</span> {address.city}
          </div>
          <div className="text-sm">
            <span className="font-medium">District:</span> {address.district}
          </div>
          <div className="text-sm">
            <span className="font-medium">Country:</span> {address.country}
          </div>
          {address.postal_code && (
            <div className="text-sm">
              <span className="font-medium">Postal Code:</span> {address.postal_code}
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium">Phone:</span> {address.phone}
          </div>
          {address.company && (
            <div className="text-sm">
              <span className="font-medium">Company:</span> {address.company}
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Address Book</h1>
              {isRefreshing && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Addresses List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Loading addresses...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch your saved addresses.
              </p>
            </CardContent>
          </Card>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No addresses found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any addresses yet. Add your first address to get started.
              </p>
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        )}

        {/* Add Address Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'home' | 'work' | 'other') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="is_default">Set as default address</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <Label htmlFor="apartment">Apartment/Suite (Optional)</Label>
                <Input
                  id="apartment"
                  value={formData.apartment}
                  onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                  placeholder="Enter apartment or suite number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code (Optional)</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAddress} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Address Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'home' | 'work' | 'other') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit_is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="edit_is_default">Set as default address</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="edit_name">Full Name *</Label>
                <Input
                  id="edit_name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="edit_company">Company (Optional)</Label>
                <Input
                  id="edit_company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Label htmlFor="edit_street">Street Address *</Label>
                <Input
                  id="edit_street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <Label htmlFor="edit_apartment">Apartment/Suite (Optional)</Label>
                <Input
                  id="edit_apartment"
                  value={formData.apartment}
                  onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                  placeholder="Enter apartment or suite number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_city">City *</Label>
                  <Input
                    id="edit_city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_district">District *</Label>
                  <Input
                    id="edit_district"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_country">Country *</Label>
                  <Input
                    id="edit_country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_postal_code">Postal Code (Optional)</Label>
                  <Input
                    id="edit_postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_phone">Phone Number *</Label>
                <Input
                  id="edit_phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitAddress} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Address
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
