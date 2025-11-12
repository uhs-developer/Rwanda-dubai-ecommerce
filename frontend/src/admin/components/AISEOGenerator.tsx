import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, gql } from 'urql';

const GENERATE_SEO_MUTATION = gql`
  mutation GenerateProductSEO($productId: ID, $productData: ProductSEOInput) {
    generateProductSEO(productId: $productId, productData: $productData) {
      success
      message
      seoData {
        metaTitle
        metaDescription
        metaKeywords
        searchKeywords
        seoTranslations
        structuredData
        aiSuggestions
        seoScore
      }
    }
  }
`;

interface AISEOGeneratorProps {
  productId?: string;
  productData: {
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    price?: number;
  };
  onSEOGenerated: (seoData: any) => void;
}

export function AISEOGenerator({ productId, productData, onSEOGenerated }: AISEOGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSEO, setGeneratedSEO] = useState<any>(null);
  const [, generateSEO] = useMutation(GENERATE_SEO_MUTATION);

  const handleGenerate = async () => {
    if (!productData.name) {
      toast.error('Product name is required to generate SEO');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateSEO({
        productId: productId || undefined,
        productData: {
          name: productData.name,
          description: productData.description || '',
          category: productData.category || '',
          brand: productData.brand || '',
          price: productData.price || 0,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data?.generateProductSEO?.success) {
        const seoData = result.data.generateProductSEO.seoData;
        setGeneratedSEO(seoData);
        onSEOGenerated(seoData);
        toast.success('SEO content generated successfully!');
      } else {
        throw new Error(result.data?.generateProductSEO?.message || 'Failed to generate SEO');
      }
    } catch (error: any) {
      console.error('SEO Generation Error:', error);
      toast.error(error.message || 'Failed to generate SEO content');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSEOScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered SEO Generator
            </CardTitle>
            <CardDescription className="mt-2">
              Generate optimized SEO content in multiple languages using AI
            </CardDescription>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !productData.name}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate SEO
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {generatedSEO && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">SEO Score</p>
                <p className="text-2xl font-bold text-purple-600">{generatedSEO.seoScore}/100</p>
              </div>
            </div>
            <Badge className={`${getSEOScoreColor(generatedSEO.seoScore)} text-white`}>
              {getSEOScoreLabel(generatedSEO.seoScore)}
            </Badge>
          </div>

          {generatedSEO.seoTranslations && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                SEO generated for: English, French, Kinyarwanda, Arabic
              </span>
            </div>
          )}

          {generatedSEO.aiSuggestions && generatedSEO.aiSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                AI Recommendations
              </h4>
              <ul className="space-y-2">
                {generatedSEO.aiSuggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm bg-white p-3 rounded border">
                    <span className="text-purple-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              SEO content has been applied to the form fields below. Review and adjust as needed.
            </span>
          </div>
        </CardContent>
      )}

      {!generatedSEO && !isGenerating && (
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Ready to optimize!</p>
              <p className="mt-1">Click "Generate SEO" to create search-engine optimized content with multilingual support.</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
