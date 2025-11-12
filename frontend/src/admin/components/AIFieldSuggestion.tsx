import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIFieldSuggestionProps {
  fieldName: string;
  currentValue: string;
  productName: string;
  onApplySuggestion: (suggestion: string) => void;
}

export function AIFieldSuggestion({
  fieldName,
  currentValue,
  productName,
  onApplySuggestion
}: AIFieldSuggestionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string>('');

  const limits = (() => {
    const lower = fieldName.toLowerCase();
    if (lower.includes('title') || lower.includes('name')) return 80;
    if (lower.includes('meta')) return 70;
    if (lower.includes('description')) return 180;
    return 120;
  })();

  const sanitize = (text: string) => {
    // Collapse whitespace and limit length
    let t = text.replace(/\s+/g, ' ').trim();
    if (t.length > limits) t = t.slice(0, limits - 1).trimEnd() + '…';
    return t;
  };

  const generateSuggestion = async () => {
    if (!productName) {
      toast.error('Product name is required');
      return;
    }

    setIsGenerating(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const prompt = `Improve this ${fieldName} for an e-commerce product:\n\nProduct Name: ${productName}\nCurrent ${fieldName}: ${currentValue || 'Not set'}\n\nRequirements:\n- Make it SEO-friendly and engaging\n- Include relevant keywords\n- Keep it concise and compelling\n- For meta descriptions: include a call-to-action\n- For product names: highlight key benefits\n- Consider multilingual search terms (English, French, Kinyarwanda)\n\nReturn ONLY the improved text, no explanation. Keep under ${limits} characters.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: Math.max(64, Math.min(256, limits + 40)),
          }
        })
      });

      const data = await response.json();

      // Check for API errors
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      const finish = data.candidates?.[0]?.finishReason;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (rawText) {
        const cleaned = sanitize(rawText);
        setSuggestion(cleaned);
        toast.success(finish === 'MAX_TOKENS' ? 'Suggestion trimmed.' : 'AI suggestion generated!');
      } else if (finish === 'MAX_TOKENS') {
        // Graceful fallback: use current value lightly improved hint
        const fallback = sanitize(currentValue || productName);
        setSuggestion(fallback);
        toast.success('Suggestion trimmed.');
      } else {
        throw new Error('No suggestion generated');
      }
    } catch (error: any) {
      console.error('AI Suggestion Error:', error);
      const errorMessage = error.message || 'Failed to generate suggestion';
      // Avoid noisy low-signal errors
      if (/too long|MAX_TOKENS/i.test(errorMessage)) {
        const fallback = sanitize(currentValue || productName);
        setSuggestion(fallback);
        toast.success('Suggestion trimmed.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
      toast.success('Suggestion applied!');
      setSuggestion('');
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSuggestion}
          disabled={isGenerating}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              AI Improve
            </>
          )}
        </Button>
      </div>

      {suggestion && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-700 mb-1">AI Suggestion:</p>
              <p className="text-sm text-gray-700">{suggestion}</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
