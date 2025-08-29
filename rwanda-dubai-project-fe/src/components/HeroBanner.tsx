import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronRight, Truck, Shield, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

interface HeroBannerProps {
  onShopNow?: () => void;
}

export function HeroBanner({ onShopNow }: HeroBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-slate-100/30 to-gray-100/40 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="w-72 h-72 bg-gradient-to-br from-gray-400/20 to-slate-600/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-gray-600/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-in-left">
            <Badge className="bg-gradient-to-r from-gray-600 to-slate-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              ✨ {t("hero.platformLaunch")}
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 bg-clip-text text-transparent">
                {t("hero.title")}
                <span className="block bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
                  Dubai to Rwanda
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
                onClick={onShopNow}
              >
                {t("hero.shopNow")}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 px-8 py-6 text-lg"
              >
                {t("hero.viewCategories")}
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl group-hover:from-gray-200 group-hover:to-slate-200 transition-all duration-300">
                  <Truck className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t("hero.freeShipping")}</p>
                  <p className="text-sm text-slate-600">{t("hero.freeShippingDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl group-hover:from-emerald-200 group-hover:to-green-200 transition-all duration-300">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t("hero.authenticProducts")}</p>
                  <p className="text-sm text-slate-600">{t("hero.authenticProductsDesc")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t("hero.fastDelivery")}</p>
                  <p className="text-sm text-slate-600">{t("hero.fastDeliveryDesc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-in-right">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100/50 to-slate-200/50 shadow-2xl ring-1 ring-slate-200/50">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450"
                alt="Electronics and tech products"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/20 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{t("hero.inStock")}</p>
                  <p className="text-sm text-slate-600">{t("hero.itemsAvailable")}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/20 animate-fade-in">
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">$2M+</p>
                <p className="text-sm text-slate-600">{t("hero.successfullyDelivered")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}