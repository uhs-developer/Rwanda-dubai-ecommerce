import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Users, 
  ShoppingBag, 
  X,
  Building
} from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  permissions: string[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    permissions: []
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const permissionGroups = [
    {
      title: 'Basic Access',
      icon: Users,
      permissions: [
        { id: 'view_dashboard', label: 'View Dashboard', description: 'Can access basic dashboard information' },
        { id: 'view_products', label: 'View Products', description: 'Can browse product catalog' },
        { id: 'view_orders', label: 'View Orders', description: 'Can see order information' }
      ]
    },
    {
      title: 'Content Management',
      icon: ShoppingBag,
      permissions: [
        { id: 'create_products', label: 'Create Products', description: 'Can add new products to catalog' },
        { id: 'edit_products', label: 'Edit Products', description: 'Can modify existing product details' },
        { id: 'manage_categories', label: 'Manage Categories', description: 'Can organize product categories' }
      ]
    },
    {
      title: 'Customer Support',
      icon: Users,
      permissions: [
        { id: 'view_customers', label: 'View Customers', description: 'Can access customer information' },
        { id: 'process_returns', label: 'Process Returns', description: 'Can handle customer returns' },
        { id: 'customer_support', label: 'Customer Support', description: 'Can provide customer assistance' }
      ]
    }
  ];

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Here you would typically make an API call to create the user
      console.log('Creating user with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        location: '',
        permissions: []
      });
      setErrors({});
      onClose();
      
      // You could show a success toast here
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error (show error toast, etc.)
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      location: '',
      permissions: []
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Create New User</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600">Add a new user account with appropriate role and permissions</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Work Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-600">{errors.department}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter location"
                      className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Permissions</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Select the permissions this user will have access to</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {permissionGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="flex items-center space-x-2 mb-4">
                      <group.icon className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{group.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                              {permission.label}
                            </Label>
                            <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {groupIndex < permissionGroups.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
