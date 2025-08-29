import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{t("footer.stayUpdated")}</h3>
            <p className="mb-6">
              {t("footer.newsletterDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white text-gray-900"
              />
              <Button variant="secondary">{t("footer.subscribe")}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">TechBridge</h3>
            <p className="text-sm">
              {t("footer.companyDesc")}
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">{t("footer.quickLinks")}</h4>
            <div className="space-y-4">
              {[
                { label: t("footer.aboutUs"), action: () => navigate('/about') },
                { label: t("footer.contact"), action: () => navigate('/contact') },
                { label: t("footer.returnsWarranty"), action: () => navigate('/returns') },
                { label: t("footer.faq"), action: () => navigate('/faq') },
                { label: t("footer.blog"), action: () => navigate('/blog') }
              ].map((link) => (
                <Button
                  key={link.label}
                  variant="link"
                  className="p-0 h-auto text-gray-300 hover:text-white justify-start text-sm block"
                  onClick={link.action}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-6">{t("footer.categories")}</h4>
            <div className="space-y-4">
              {[
                t("nav.electronics"),
                t("nav.autoParts"),
                t("nav.homeAppliances"),
                t("footer.newArrivals"),
                t("footer.bestSellers")
              ].map((category) => (
                <Button
                  key={category}
                  variant="link"
                  className="p-0 h-auto text-gray-300 hover:text-white justify-start text-sm block"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Dubai, UAE → Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@techbridge.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {currentYear} TechBridge. {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-6">
            {[
              t("footer.privacyPolicy"),
              t("footer.termsOfService"),
              t("footer.cookiePolicy")
            ].map((link) => (
              <Button
                key={link}
                variant="link"
                className="p-0 h-auto text-gray-400 hover:text-white text-sm"
              >
                {link}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}