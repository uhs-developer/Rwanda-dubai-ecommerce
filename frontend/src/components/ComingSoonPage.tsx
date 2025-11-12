import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export function ComingSoonPage({ title, subtitle, onBack }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <Button variant="outline" onClick={onBack} className="text-gray-900">Back</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Coming Soon</h2>
            <p className="text-gray-600 mb-8">
              {subtitle || 'We are preparing something exciting here. Please check back soon.'}
            </p>
            <Button onClick={onBack} className="text-white">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
