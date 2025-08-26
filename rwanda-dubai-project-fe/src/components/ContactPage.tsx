import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle, Headphones } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
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
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
              <p className="text-gray-600">Get in touch with our team for support, inquiries, or partnerships</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              We're here to help with your electronics and auto parts needs. 
              Whether you have questions about products, shipping, or need 
              technical support, our team is ready to assist you.
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
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-600 text-sm">
                        Dubai Office: Business Bay, Dubai, UAE
                      </p>
                      <p className="text-gray-600 text-sm">
                        Kigali Office: Kigali City, Rwanda
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
                      <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-600 text-sm">
                        +971 4 XXX XXXX (Dubai)
                      </p>
                      <p className="text-gray-600 text-sm">
                        +250 788 XXX XXX (Kigali)
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
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 text-sm">
                        support@techbridge.com
                      </p>
                      <p className="text-gray-600 text-sm">
                        orders@techbridge.com
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
                      <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <p className="text-gray-600 text-sm">
                        Monday - Friday: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-gray-600 text-sm">
                        Saturday: 10:00 AM - 4:00 PM
                      </p>
                      <p className="text-gray-600 text-sm">
                        Sunday: Closed
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-600 mb-6">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-4">Have a Quick Question?</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Check our FAQ section for instant answers to common questions.
                    </p>
                    <Button variant="outline" className="mb-4">
                      View FAQ
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
                Other Ways to Reach Us
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Live Chat */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Use our AI chatbot for instant assistance with product 
                    recommendations and order support.
                  </p>
                  <Button variant="outline" onClick={handleStartChat}>
                    Start Chat
                  </Button>
                </div>

                {/* WhatsApp Support */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">WhatsApp Support</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Connect with us on WhatsApp for quick responses and order 
                    updates.
                  </p>
                  <Button variant="outline" onClick={handleWhatsApp}>
                    Message on WhatsApp
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
