import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff,
  Facebook,
  Chrome,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AuthPageProps {
  onBack?: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    agreeTerms: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const clearErrors = () => {
    setError("");
    setValidationErrors({});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();
    
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      
      // Navigate to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.errors) {
        setValidationErrors(error.errors);
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Client-side validation
    if (registerData.password !== registerData.password_confirmation) {
      setError("Passwords don't match");
      return;
    }
    
    if (!registerData.agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.password_confirmation,
        phone: registerData.phone || undefined,
      });
      
      // Navigate to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.errors) {
        setValidationErrors(error.errors);
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login integration
    toast.info(`${provider} login integration coming soon!`);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Show loading spinner if authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBackClick} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Rwanda-Dubai</CardTitle>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                        value={loginData.email}
                        onChange={(e) => {
                          setLoginData(prev => ({ ...prev, email: e.target.value }));
                          clearErrors();
                        }}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData(prev => ({ ...prev, password: e.target.value }));
                          clearErrors();
                        }}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.password[0]}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked: boolean) => setLoginData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                      />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isLoading}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className={`pl-10 ${validationErrors.name ? 'border-red-500' : ''}`}
                        value={registerData.name}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, name: e.target.value }));
                          clearErrors();
                        }}
                        required
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.name[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                        value={registerData.email}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, email: e.target.value }));
                          clearErrors();
                        }}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 XXX XXX XXX"
                        className={`pl-10 ${validationErrors.phone ? 'border-red-500' : ''}`}
                        value={registerData.phone}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, phone: e.target.value }));
                          clearErrors();
                        }}
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.phone[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password (min 8 characters)"
                        className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, password: e.target.value }));
                          clearErrors();
                        }}
                        required
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.password[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className={`pl-10 pr-10 ${validationErrors.password_confirmation ? 'border-red-500' : ''}`}
                        value={registerData.password_confirmation}
                        onChange={(e) => {
                          setRegisterData(prev => ({ ...prev, password_confirmation: e.target.value }));
                          clearErrors();
                        }}
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
                    {validationErrors.password_confirmation && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.password_confirmation[0]}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={registerData.agreeTerms}
                      onCheckedChange={(checked: boolean) => setRegisterData(prev => ({ ...prev, agreeTerms: checked as boolean }))}
                    />
                    <Label htmlFor="agreeTerms" className="text-sm leading-5">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account... (this may take up to 30 seconds)" : "Create Account"}
                  </Button>
                  {isLoading && (
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Setting up your account and permissions...
                      </div>
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}