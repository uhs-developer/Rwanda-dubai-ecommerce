import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle, Headphones } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "../../node_modules/react-i18next";

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleStartChat = () => {
    toast.info('Live chat feature coming soon!');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/971XXXXXXX', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("contact.title")}</h1>
              <p className="text-gray-600">{t("contact.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("contact.getInTouch")}</h2>
            <p className="text-gray-600 mb-8">
              {t("contact.description")}
            </p>

            <div className="space-y-6">
              {/* Address */}
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("contact.address")}</h3>
                      <p className="text-gray-600 text-sm">
                        {t("contact.dubaiOffice")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {t("contact.kigaliOffice")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("contact.phone")}</h3>
                      <p className="text-gray-600 text-sm">
                        {t("contact.dubaiPhone")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {t("contact.kigaliPhone")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("contact.email")}</h3>
                      <p className="text-gray-600 text-sm">
                        {t("contact.supportEmail")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {t("contact.ordersEmail")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("contact.businessHours")}</h3>
                      <p className="text-gray-600 text-sm">
                        {t("contact.mondayFriday")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {t("contact.saturday")}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {t("contact.sunday")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("contact.sendMessage")}</h3>
                <p className="text-gray-600 mb-6">
                  {t("contact.formDescription")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.fullName")} *
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t("contact.fullNamePlaceholder")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.emailAddress")} *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("contact.emailPlaceholder")}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.subject")}
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={t("contact.subjectPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.message")} *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("contact.messagePlaceholder")}
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("contact.sendMessage")}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-4">{t("contact.haveQuickQuestion")}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t("contact.faqDescription")}
                    </p>
                    <Button variant="outline" className="mb-4">
                      {t("contact.viewFAQ")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Other Ways to Reach Us */}
        <div className="mt-16">
          <Card className="p-8">
            <CardContent className="pt-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t("contact.otherWaysToReachUs")}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Live Chat */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t("contact.liveChat")}</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {t("contact.liveChatDescription")}
                  </p>
                  <Button variant="outline" onClick={handleStartChat}>
                    {t("contact.startChat")}
                  </Button>
                </div>

                {/* WhatsApp Support */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t("contact.whatsappSupport")}</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {t("contact.whatsappDescription")}
                  </p>
                  <Button variant="outline" onClick={handleWhatsApp}>
                    {t("contact.messageOnWhatsapp")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
