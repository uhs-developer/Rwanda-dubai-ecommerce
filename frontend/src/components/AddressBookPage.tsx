import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Plus,
  Home,
  Building,
  Edit,
  Trash2,
  MapPin
} from "lucide-react";

interface AddressBookPageProps {
  onBack: () => void;
}

interface Address {
  id: string;
  type: 'home' | 'work';
  isDefault: boolean;
  name: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

export function AddressBookPage({ onBack }: AddressBookPageProps) {
  // Mock data - replace with real data from your backend
  const [addresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      isDefault: true,
      name: "John Doe",
      street: "KG 123 St",
      apartment: "Apt 4B",
      city: "Kigali",
      state: "Kigali City",
      country: "Rwanda",
      phone: "+250 788 123 456"
    },
    {
      id: "2", 
      type: "work",
      isDefault: false,
      name: "John Doe",
      company: "TechBridge Ltd",
      street: "KG 456 St",
      city: "Kigali",
      state: "Kigali City", 
      country: "Rwanda",
      phone: "+250 788 123 456"
    }
  ]);

  const handleAddAddress = () => {
    // Handle add new address
    console.log("Add new address");
  };

  const handleEditAddress = (addressId: string) => {
    // Handle edit address
    console.log("Edit address:", addressId);
  };

  const handleDeleteAddress = (addressId: string) => {
    // Handle delete address
    console.log("Delete address:", addressId);
  };

  const handleSetDefault = (addressId: string) => {
    // Handle set as default
    console.log("Set as default:", addressId);
  };

  const AddressCard = ({ address }: { address: Address }) => (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {address.type === 'home' ? (
              <Home className="h-5 w-5" />
            ) : (
              <Building className="h-5 w-5" />
            )}
            <span className="capitalize">{address.type}</span>
            {address.isDefault && (
              <Badge variant="secondary">Default</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
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
          <div className="font-medium">{address.name}</div>
          {address.company && (
            <div className="text-sm text-muted-foreground">{address.company}</div>
          )}
          <div className="text-sm">
            <div>{address.street}</div>
            {address.apartment && <div>{address.apartment}</div>}
            <div>{address.city}, {address.state} 00000</div>
            <div>{address.country}</div>
          </div>
          <div className="text-sm text-muted-foreground">{address.phone}</div>
        </div>
        
        {!address.isDefault && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSetDefault(address.id)}
            >
              Set as Default
            </Button>
          </div>
        )}
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
            </div>
            <Button onClick={handleAddAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-6">
                Add your shipping and billing addresses to make checkout faster.
              </p>
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
