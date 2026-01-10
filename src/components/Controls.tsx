import { Button, Select, SelectItem } from "@heroui/react";
import { Moon, Sun } from "lucide-react";

interface ControlsProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
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
        onSelectionChange={(keys) =>
          setSelectedLanguage(Array.from(keys)[0] as string)
        }
        size="sm"
        className="w-32"
        aria-label="Select language"
      >
        <SelectItem key="ko">한국어</SelectItem>
        <SelectItem key="en">English</SelectItem>
        <SelectItem key="zh">中文</SelectItem>
        <SelectItem key="jp">日本語</SelectItem>
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
