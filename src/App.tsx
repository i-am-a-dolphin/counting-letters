import { Card, CardBody, Divider, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { NetworkMonitor } from "./components/NetworkMonitor";
import { StatsCard } from "./components/StatsCard";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  countCharsWithSpaces,
  countCharsWithoutSpaces,
  countWords,
  countThaiWords,
  countChineseChars,
  countEnglishWords,
  countChinesePunctuation,
  countEnglishChars,
  countEnglishPunctuation,
  countDigits,
  countLines,
  countBytes,
} from "./utils/count";
import { FooterInfo } from "./components/FooterInfo";

/* =========================
   🌍 Language helpers
========================= */
const SUPPORTED_LANGS = ["ko", "en", "zh", "ja", "th"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

function getLangFromPath(): Lang | null {
  const seg = window.location.pathname.split("/")[1];
  return (SUPPORTED_LANGS as readonly string[]).includes(seg)
    ? (seg as Lang)
    : null;
}

function App() {
  const [text, setText] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t, i18n } = useTranslation();

  /* =========================
     ✅ 1) URL 기반 초기 언어
  ========================= */
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>(
    () => getLangFromPath() ?? "ko"
  );

  /* =========================
     ✅ 2) i18n 언어 동기화
  ========================= */
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  /* =========================
     ✅ 3) URL(/en 등)이 있으면
        드롭다운도 거기에 맞추기
  ========================= */
  useEffect(() => {
    const pathLang = getLangFromPath();
    if (pathLang && pathLang !== selectedLanguage) {
      setSelectedLanguage(pathLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ZH 전용: 고급 통계 토글
  const [showAdvancedZh, setShowAdvancedZh] = useState(false);
  const isZh = selectedLanguage === "zh";

  // ✅ 언어가 zh가 아니면 고급 토글 닫기
  useEffect(() => {
    if (!isZh) setShowAdvancedZh(false);
  }, [isZh]);

  return (
    <>
      <Controls
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="pt-16 flex flex-col md:flex-row items-start justify-center gap-6 px-4">
        <div className="flex-1 max-w-4xl">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardBody className="p-8">
              <Header />

              <div className="mb-8">
                <Textarea
                  label={t("textareaLabel")}
                  placeholder={t("textareaPlaceholder")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  minRows={8}
                  maxRows={16}
                  style={{ fontSize: "1rem" }}
                  variant="bordered"
                />
              </div>

              {!isZh ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatsCard
                    titleKey="charWithSpaces"
                    value={countCharsWithSpaces(text)}
                  />
                  <StatsCard
                    titleKey="charWithoutSpaces"
                    value={countCharsWithoutSpaces(text)}
                  />
                  <StatsCard
                    titleKey="wordCount"
                    value={
                      selectedLanguage === "th"
                        ? countThaiWords(text)
                        : countWords(text)
                    }
                  />
                </div>
              ) : (
                (() => {
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
                        <StatsCard
                          titleKey="zh_chineseChars"
                          value={chineseChars}
                        />
                        <StatsCard
                          titleKey="zh_englishWords"
                          value={englishWords}
                        />
                        <StatsCard titleKey="zh_total" value={total} />
                      </div>

                      <div className="flex justify-center mb-8">
                        <button
                          type="button"
                          onClick={() => setShowAdvancedZh((v) => !v)}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 underline"
                        >
                          {showAdvancedZh
                            ? t("zh_hideAdvanced")
                            : t("zh_showAdvanced")}
                        </button>
                      </div>

                      {showAdvancedZh && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <StatsCard
                            titleKey="zh_chinesePunct"
                            value={chinesePunct}
                          />
                          <StatsCard
                            titleKey="zh_englishChars"
                            value={englishChars}
                          />
                          <StatsCard
                            titleKey="zh_englishPunct"
                            value={englishPunct}
                          />
                          <StatsCard titleKey="zh_digits" value={digits} />
                          <StatsCard titleKey="zh_lines" value={lines} />
                          <StatsCard titleKey="zh_bytes" value={bytes} />
                        </div>
                      )}
                    </>
                  );
                })()
              )}

              <Divider className="my-6" />

              <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                {t("footer")}
              </div>

              <FooterInfo />
            </CardBody>
          </Card>
        </div>

        <div className="w-full md:w-80 mb-8">
          <NetworkMonitor />
        </div>
      </div>
    </>
  );
}

export default App;
