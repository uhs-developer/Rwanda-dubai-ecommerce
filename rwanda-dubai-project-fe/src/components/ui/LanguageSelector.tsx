import { useState, useEffect } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Languages, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸"
  },
  {
    code: "rw",
    name: "Kinyarwanda",
    nativeName: "Kinyarwanda",
    flag: "🇷🇼"
  },
  {
    code: "sw",
    name: "Kiswahili",
    nativeName: "Kiswahili",
    flag: "🇹🇿"
  },
  {
    code: "ln",
    name: "Lingala",
    nativeName: "Lingala",
    flag: "🇨🇩"
  },
  {
    code: "lg",
    name: "Luganda",
    nativeName: "Luganda",
    flag: "🇺🇬"
  }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Languages className="h-4 w-4" />
        <span className="sr-only">Select language</span>
      </Button>
    );
  }

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2"
          >
            <span className="text-base">{language.flag}</span>
            <span className="flex-1">
              <div className="font-medium">{language.name}</div>
              <div className="text-xs text-muted-foreground">{language.nativeName}</div>
            </span>
            {i18n.language === language.code && (
              <Check className="h-3 w-3" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
