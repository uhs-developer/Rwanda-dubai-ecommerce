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
  Shield, 
  Settings, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  X
} from 'lucide-react';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    permissions: []
  });

  const [errors, setErrors] = useState<Partial<AdminFormData>>({});

  const permissionGroups = [
    {
      title: 'User Management',
      icon: Users,
      permissions: [
        { id: 'view_users', label: 'View Users', description: 'Can view user profiles and lists' },
        { id: 'create_users', label: 'Create Users', description: 'Can create new user accounts' },
        { id: 'edit_users', label: 'Edit Users', description: 'Can modify user information' },
        { id: 'delete_users', label: 'Delete Users', description: 'Can remove user accounts' }
      ]
    },
    {
      title: 'Product Management',
      icon: ShoppingBag,
      permissions: [
        { id: 'view_products', label: 'View Products', description: 'Can view product listings' },
        { id: 'create_products', label: 'Create Products', description: 'Can add new products' },
        { id: 'edit_products', label: 'Edit Products', description: 'Can modify product details' },
        { id: 'delete_products', label: 'Delete Products', description: 'Can remove products' }
      ]
    },
    {
      title: 'Analytics & Reports',
      icon: BarChart3,
      permissions: [
        { id: 'view_analytics', label: 'View Analytics', description: 'Can access dashboard metrics' },
        { id: 'export_reports', label: 'Export Reports', description: 'Can download data reports' },
        { id: 'financial_data', label: 'Financial Data', description: 'Can view revenue and sales data' }
      ]
    },
    {
      title: 'System Settings',
      icon: Settings,
      permissions: [
        { id: 'system_config', label: 'System Configuration', description: 'Can modify system settings' },
        { id: 'payment_settings', label: 'Payment Settings', description: 'Can configure payment gateways' },
        { id: 'security_settings', label: 'Security Settings', description: 'Can manage security policies' }
      ]
    }
  ];

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
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
    const newErrors: Partial<AdminFormData> = {};

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
    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      // Here you would typically make an API call to create the admin
      console.log('Creating admin with data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        permissions: []
      });
      setErrors({});
      onClose();
      
      // You could show a success toast here
    } catch (error) {
      console.error('Error creating admin:', error);
      // Handle error (show error toast, etc.)
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
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
            <DialogTitle className="text-2xl font-bold">Create New Admin</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600">Set up a new administrator account with specific permissions</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
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
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role}</p>
                )}
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
              <p className="text-sm text-gray-600">Select the permissions this admin will have access to</p>
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
              Create Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;
