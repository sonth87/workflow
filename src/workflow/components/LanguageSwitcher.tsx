/**
 * Language Switcher Component
 * Dropdown for switching between available languages
 */

import React from "react";
import {
  useLanguageContext,
  type LanguageType,
} from "@/workflow/context/LanguageContext";
import {
  useAvailableLanguages,
  getLanguageLabel,
} from "@/workflow/hooks/useAvailableLanguages";
import { Select, cn } from "@sth87/shadcn-design-system";

interface LanguageOption {
  label: string;
  value: LanguageType;
}

interface LanguageSwitcherProps {
  className?: string;
  // Allow custom language options, defaults to auto-detected from workflow
  languages?: LanguageOption[];
}

// Default language options
const DEFAULT_LANGUAGES: LanguageOption[] = [
  { label: "English", value: "en" },
  { label: "Tiếng Việt", value: "vi" },
];

export function LanguageSwitcher({
  className,
  languages: customLanguages,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageContext();

  // Auto-detect available languages from workflow if not provided
  const availableLanguages = useAvailableLanguages();

  // Build language options
  let languages = customLanguages;
  if (!languages) {
    languages = availableLanguages.map(lang => ({
      label: getLanguageLabel(lang),
      value: lang as LanguageType,
    }));
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={language}
        onChange={value => setLanguage(value as LanguageType)}
        options={languages.map(lang => ({
          label: lang.label,
          value: lang.value,
        }))}
        className="w-[140px]"
      />
    </div>
  );
}

export default LanguageSwitcher;
