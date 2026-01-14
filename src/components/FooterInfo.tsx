import { useState } from "react";
import { useTranslation } from "react-i18next";

export const FooterInfo = () => {
  const { t } = useTranslation();
  const [openSafety, setOpenSafety] = useState(false);
  const [openAds, setOpenAds] = useState(false);

  return (
    <div className="mt-10 text-sm text-gray-600 dark:text-gray-400 space-y-6">
      {/* 왜 이 사이트는 안전한가요 */}
      <div>
        <button
          type="button"
          onClick={() => setOpenSafety(v => !v)}
          className="font-medium underline flex items-center gap-1"
        >
          <span>{openSafety ? "▾" : "▸"}</span>
          {t("footerInfo.safetyTitle")}
        </button>

        {openSafety && (
          <div className="mt-3 leading-relaxed whitespace-pre-line">
            {t("footerInfo.safetyBody")}
          </div>
        )}
      </div>

      {/* 왜 광고를 넣지 않았나요 + 후원 */}
      <div>
        <button
          type="button"
          onClick={() => setOpenAds(v => !v)}
          className="font-medium underline flex items-center gap-1"
        >
          <span>{openAds ? "▾" : "▸"}</span>
          {t("footerInfo.adsTitle")}
        </button>

        {openAds && (
          <>
            <div className="mt-3 leading-relaxed whitespace-pre-line">
              {t("footerInfo.adsBody")}
            </div>

            {/* ☕ Buy Me a Coffee 링크 버튼 */}
            <div className="mt-4">
              <a
                href="https://buymeacoffee.com/wejustcount.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                           bg-gray-900 text-white font-medium
                           hover:bg-gray-800 transition"
              >
                ☕ Buy me a coffee
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
