import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ArrowLeft, Search, Plus, Minus, Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery } from 'urql';
import { GET_PAGE_CONTENT, GET_FAQS } from '../graphql/storefront';
import { PageWrapper } from './PageWrapper';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  categoryLabel?: string;
}

export function FAQPage({ onBack }: FAQPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const [pageContentResult] = useQuery({ 
    query: GET_PAGE_CONTENT, 
    variables: { pageKey: 'faq' } 
  });
  const [faqsResult] = useQuery({ query: GET_FAQS });

  const pageContent = pageContentResult.data?.adminPageContent;
  const faqs: FAQItem[] = faqsResult.data?.faqs || [];
  const loading = faqsResult.fetching;

  // Helper to get section content
  const getContent = (key: string, fallback: string) => {
    const section = pageContent?.sections?.find((s: any) => s.key === key);
    return section?.content || fallback;
  };

  const categories = useMemo(() => {
    const unique: { id: string; label: string }[] = [{ id: 'all', label: t('faq.all') } as any];
    const map = new Map<string, string>();
    for (const f of faqs) {
      if (!map.has(f.category)) {
        map.set(f.category, f.categoryLabel || f.category);
        unique.push({ id: f.category, label: f.categoryLabel || f.category });
      }
    }
    return unique;
  }, [faqs, t]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = (faqs as FAQItem[]).filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <PageWrapper className="py-6">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {getContent('hero_title', t("faq.title"))}
              </h1>
              <p className="text-gray-600">
                {getContent('hero_subtitle', t("faq.subtitle"))}
              </p>
            </div>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("faq.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <CardContent className="p-0">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="p-6">
                <Collapsible open={openItems.includes(faq.id)}>
                  <CollapsibleTrigger onClick={() => toggleItem(faq.id)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openItems.includes(faq.id) ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-4 text-sm text-gray-700">
                      {faq.answer}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>

        {/* Still Need Help Section */}
        <Card className="bg-gray-900 text-white mt-10">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-4">{t("faq.stillNeedHelp")}</h3>
              <p className="text-gray-300 mb-8">
                {t("faq.supportDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" onClick={() => (window.location.href = 'mailto:support@techbridge.com')} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("faq.emailSupport")}
                </Button>
                <Button variant="outline" onClick={() => toast.info('Calling +971 4 XXX XXXX...')} className="flex items-center gap-2 border-white bg-transparent hover:bg-white text-white hover:text-gray-900">
                  <Phone className="h-4 w-4" />
                  {t("faq.callUs")}
                </Button>
                <Button variant="outline" onClick={() => toast.info('Live chat feature coming soon!')} className="flex items-center gap-2 border-white bg-transparent hover:bg-white text-white hover:text-gray-900">
                  <MessageCircle className="h-4 w-4" />
                  {t("faq.liveChat")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support Hours */}
        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">{t("faq.customerSupportHours")}</h3>
            <p className="text-gray-600 text-sm mb-4">{t("faq.supportHoursDescription")}</p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-900">{t("faq.mondayFriday")}:</span> 9:00 AM - 6:00 PM
              </div>
              <div>
                <span className="font-medium text-gray-900">{t("faq.saturday")}:</span> 10:00 AM - 4:00 PM
              </div>
              <div>
                <span className="font-medium text-gray-900">{t("faq.sunday")}:</span> {t("faq.closed")}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
