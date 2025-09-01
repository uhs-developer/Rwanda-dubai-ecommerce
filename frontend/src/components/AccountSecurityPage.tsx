import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserService } from "../services/user";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface AccountSecurityPageProps {
  onBack: () => void;
}

export function AccountSecurityPage({ onBack }: AccountSecurityPageProps) {
  const { user, logoutAll } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });

  const clearMessages = () => {
    setError("");
    setValidationErrors({});
    setSuccessMessage("");
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    clearMessages();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    // Client-side validation
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError("New password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await UserService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      });

      if (response.success) {
        setSuccessMessage(response.message || "Password changed successfully!");
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: ""
        });
        toast.success("Password changed successfully!");
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      
      if (error.errors) {
        setValidationErrors(error.errors);
      } else {
        setError(error.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!confirm("Are you sure you want to logout from all devices? You'll need to login again on all your devices.")) {
      return;
    }

    try {
      await logoutAll();
      toast.success("Logged out from all devices successfully!");
    } catch (error) {
      console.error('Logout all error:', error);
      toast.error("Failed to logout from all devices");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Account Security</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Password Change Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Success Message */}
              {successMessage && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      className={`pl-10 pr-10 ${validationErrors.current_password ? 'border-red-500' : ''}`}
                      value={passwordData.current_password}
                      onChange={(e) => handleInputChange("current_password", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.current_password && (
                    <p className="text-sm text-red-600">{validationErrors.current_password[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new_password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password (min 8 characters)"
                      className={`pl-10 pr-10 ${validationErrors.new_password ? 'border-red-500' : ''}`}
                      value={passwordData.new_password}
                      onChange={(e) => handleInputChange("new_password", e.target.value)}
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.new_password && (
                    <p className="text-sm text-red-600">{validationErrors.new_password[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new_password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className={`pl-10 pr-10 ${validationErrors.new_password_confirmation ? 'border-red-500' : ''}`}
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => handleInputChange("new_password_confirmation", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {validationErrors.new_password_confirmation && (
                    <p className="text-sm text-red-600">{validationErrors.new_password_confirmation[0]}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">Logout All Devices</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out from all devices and browsers
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogoutAllDevices}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Logout All
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Account Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Email:</span>
                    <span className="font-medium text-blue-900">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Last Login:</span>
                    <span className="font-medium text-blue-900">
                      {user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}