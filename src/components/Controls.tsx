import { Button, Select, SelectItem } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type Language = "ko" | "en" | "zh" | "ja" | "th";

interface ControlsProps {
  selectedLanguage: Language;
  setSelectedLanguage: Dispatch<SetStateAction<Language>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Controls = ({
  selectedLanguage,
  setSelectedLanguage,
  isDarkMode,
  toggleDarkMode,
}: ControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <Select
        selectedKeys={[selectedLanguage]}
        onSelectionChange={(keys) => {
          const next = Array.from(keys)[0] as Language | undefined;
          if (!next || next === selectedLanguage) return;
          setSelectedLanguage(next);
        }}
        size="sm"
        className="w-32"
        aria-label="Select language"
      >
        <SelectItem key="ko" isDisabled={selectedLanguage === "ko"}>
          한국어
        </SelectItem>
        <SelectItem key="en" isDisabled={selectedLanguage === "en"}>
          English
        </SelectItem>
        <SelectItem key="zh" isDisabled={selectedLanguage === "zh"}>
          中文
        </SelectItem>
        <SelectItem key="ja" isDisabled={selectedLanguage === "ja"}>
          日本語
        </SelectItem>
        <SelectItem key="th" isDisabled={selectedLanguage === "th"}>
          ไทย
        </SelectItem>
      </Select>

      <Button
        isIconOnly
        size="sm"
        onPress={toggleDarkMode}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
