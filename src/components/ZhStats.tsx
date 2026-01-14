import { StatsCard } from "./StatsCard";
import { useTranslation } from "react-i18next";
import {
  countChineseChars,
  countEnglishWords,
  countChinesePunctuation,
  countEnglishChars,
  countEnglishPunctuation,
  countDigits,
  countLines,
  countBytes,
} from "../utils/count";

interface ZhStatsProps {
  text: string;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export const ZhStats = ({ text, showAdvanced, onToggleAdvanced }: ZhStatsProps) => {
  const { t } = useTranslation();

  const chineseChars = countChineseChars(text);
  const englishWords = countEnglishWords(text);
  const total = chineseChars + englishWords;

  const chinesePunct = countChinesePunctuation(text);
  const englishChars = countEnglishChars(text);
  const englishPunct = countEnglishPunctuation(text);
  const digits = countDigits(text);
  const lines = countLines(text);
  const bytes = countBytes(text);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <StatsCard titleKey="zh_chineseChars" value={chineseChars} />
        <StatsCard titleKey="zh_englishWords" value={englishWords} />
        <StatsCard titleKey="zh_total" value={total} />
      </div>

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={onToggleAdvanced}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 underline"
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? t("zh_hideAdvanced") : t("zh_showAdvanced")}
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard titleKey="zh_chinesePunct" value={chinesePunct} />
          <StatsCard titleKey="zh_englishChars" value={englishChars} />
          <StatsCard titleKey="zh_englishPunct" value={englishPunct} />
          <StatsCard titleKey="zh_digits" value={digits} />
          <StatsCard titleKey="zh_lines" value={lines} />
          <StatsCard titleKey="zh_bytes" value={bytes} />
        </div>
      )}
    </>
  );
};
