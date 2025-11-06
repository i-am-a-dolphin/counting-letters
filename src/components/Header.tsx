import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {t("title")}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{t("description")}</p>
    </div>
  );
};
