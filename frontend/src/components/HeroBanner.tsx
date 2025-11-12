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
      {/* Background decorative elements - hidden on mobile */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 hidden md:block"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 hidden md:block">
        <div className="w-72 h-72 bg-gradient-to-br from-gray-400/20 to-slate-600/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 hidden md:block">
        <div className="w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-gray-600/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Mobile: Compact hero with image overlay (50vh) */}
      <div className="md:hidden relative" style={{ minHeight: '50vh' }}>
        {/* Background image - right 50% */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {/* Gradient overlay to blend text */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450"
              alt="Electronics and tech products"
              className="w-full h-full object-cover object-right"
            />
          </div>
        </div>

        {/* Content overlay */}
        <div className="container mx-auto px-4 py-6 relative z-20" style={{ minHeight: '50vh' }}>
          <div className="flex flex-col justify-center h-full space-y-4 max-w-[60%]">
            {/* Title with adaptive color */}
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <span className="text-slate-900">{t("hero.title")}</span>
              </h1>
              <p className="text-xs font-medium text-slate-600">{t("header.subtitle")}</p>
            </div>

            {/* CTA Button */}
            <Button
              size="sm"
              className="group bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg w-full"
              onClick={onShopNow}
            >
              {t("hero.shopNow")}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Compact benefits strip */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                <Truck className="h-4 w-4 text-gray-600" />
                <span className="text-[10px] font-semibold text-slate-800 whitespace-nowrap">
                  {t("hero.freeShipping")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-semibold text-slate-800 whitespace-nowrap">
                  {t("hero.authenticProducts")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-[10px] font-semibold text-slate-800 whitespace-nowrap">
                  {t("hero.fastDelivery")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Full hero */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 animate-slide-in-left">
              <Badge className="bg-gradient-to-r from-gray-600 to-slate-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                ✨ {t("hero.platformLaunch")}
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 bg-clip-text text-transparent">
                  {t("hero.title")}
                  <span className="block text-base lg:text-lg text-slate-600 font-medium">
                    {t("header.subtitle")}
                  </span>
                </h1>

                <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </div>

              <Button
                size="lg"
                className="group bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
                onClick={onShopNow}
              >
                {t("hero.shopNow")}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Compact benefits strip */}
              <div className="flex flex-wrap items-center gap-4 pt-6">
                <div className="inline-flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 shadow-sm ring-1 ring-slate-200">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-slate-800">{t("hero.freeShipping")}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 shadow-sm ring-1 ring-slate-200">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-800">{t("hero.authenticProducts")}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 shadow-sm ring-1 ring-slate-200">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-800">{t("hero.fastDelivery")}</span>
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
              
              {/* Floating cards removed to reduce visual clutter */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}