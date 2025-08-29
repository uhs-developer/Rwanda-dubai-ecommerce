import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { useTranslation } from "react-i18next";
import {
  WifiOff,
  RotateCcw,
  Home,
  ShoppingCart,
  X
} from "lucide-react";

interface OfflinePageProps {
  onTryAgain: () => void;
  onGoHome: () => void;
  onViewCart: () => void;
  onDismiss?: () => void;
  cartItemCount?: number;
}

export function OfflinePage({
  onTryAgain,
  onGoHome,
  onViewCart,
  onDismiss,
  cartItemCount = 0
}: OfflinePageProps) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Offline Alert Banner */}
      <Alert className="fixed top-4 left-4 right-4 max-w-md mx-auto bg-red-500 text-white border-red-600 z-50">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{t("offline.noInternetConnection")}</span>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-auto p-0 text-white hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {/* Main Offline Content */}
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          {/* Offline Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("offline.youAreOffline")}
          </h1>

          <div className="text-gray-600 mb-8 space-y-2">
            <p>{t("offline.lostConnection")}</p>
            <p>{t("offline.featuresUnavailable")}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button
              onClick={onTryAgain}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("offline.tryAgain")}
            </Button>

            <Button
              variant="outline"
              onClick={onGoHome}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              {t("offline.goToHomepage")}
            </Button>

            <Button
              variant="outline"
              onClick={onViewCart}
              className="w-full relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t("offline.viewCart")}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Button>
          </div>

          {/* What you can still do */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-3">
              {t("offline.whatYouCanDo")}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• {t("offline.viewShoppingCart")}</li>
              <li>• {t("offline.browseProducts")}</li>
              <li>• {t("offline.editWishlist")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
