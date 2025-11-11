import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { getFileDescription } from "../utils/fileDescriptions";

interface NetworkEntry {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  startTime: number;
}

const DOWNLOAD_TEST_ENDPOINT = "https://jsonplaceholder.typicode.com/posts/1";
const UPLOAD_TEST_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

const isDownloadEntry = (entry: NetworkEntry) => {
  return (
    entry.initiatorType !== "fetch" || entry.name === DOWNLOAD_TEST_ENDPOINT
  );
};

const isUploadEntry = (entry: NetworkEntry) => {
  return !isDownloadEntry(entry);
};

export const NetworkMonitor = () => {
  const [entries, setEntries] = useState<NetworkEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState("server-to-client");
  const [unknownFiles, setUnknownFiles] = useState<Set<string>>(new Set());
  const downloadScrollRef = useAutoScroll<HTMLDivElement>([
    entries,
    selectedTab,
  ]);
  const uploadScrollRef = useAutoScroll<HTMLDivElement>([entries, selectedTab]);
  const { t } = useTranslation();

  // 알 수 없는 파일 감지 및 toast 표시
  useEffect(() => {
    entries.forEach((entry) => {
      const baseName = entry.name.split("/").pop()?.split("?")[0] || entry.name;
      const description = getFileDescription(entry.name, t);
      if (description === t("fileDesc_other") && !unknownFiles.has(baseName)) {
        // 알 수 없는 파일 감지
        setUnknownFiles((prev) => new Set(prev).add(baseName));
        // toast 표시 (HeroUI의 addToast 사용)
        addToast({
          title: t("unknownFileToastTitle"),
          description: `${baseName}: ${t("unknownFileToastDesc")}`,
          color: "warning",
        });
      }
    });
  }, [entries, t, unknownFiles]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const networkEntries = list
        .getEntries()
        .filter(
          (entry) => entry.entryType === "resource"
        ) as PerformanceResourceTiming[];

      const formattedEntries: NetworkEntry[] = networkEntries.map((entry) => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        duration: Math.round(entry.duration),
        transferSize: entry.transferSize,
        startTime: Math.round(entry.startTime),
      }));

      setEntries((prev) => [...prev, ...formattedEntries]);
    });

    observer.observe({ entryTypes: ["resource"] });

    // 초기 로드된 리소스들도 가져오기
    const initialEntries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const initialFormatted: NetworkEntry[] = initialEntries.map((entry) => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      duration: Math.round(entry.duration),
      transferSize: entry.transferSize,
      startTime: Math.round(entry.startTime),
    }));
    setEntries(initialFormatted);

    return () => observer.disconnect();
  }, []);

  // 테스트 요청 함수들
  const downloadTest = async () => {
    try {
      fetch(DOWNLOAD_TEST_ENDPOINT);
    } catch (error) {
      console.error("Receive request failed:", error);
    }
  };

  const uploadTest = async () => {
    try {
      fetch(UPLOAD_TEST_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          title: "Test Post",
          body: "This is a test request from network monitor",
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      console.error("Send request failed:", error);
    }
  };

  return (
    <Card className="h-full border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("networkMonitor")}
        </h3>
      </CardHeader>
      {entries.length === 0 ? (
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("noNetworkRequests")}
          </p>
        </CardBody>
      ) : (
        <>
          <CardBody className="pt-0">
            <Tabs
              aria-label="Network direction tabs"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab
                key="server-to-client"
                title={
                  <div className="flex items-center gap-2">{t("download")}</div>
                }
              >
                <div className="mt-4 mb-4">
                  <Button size="sm" onPress={downloadTest}>
                    {t("downloadTest")}
                  </Button>
                </div>
                <div
                  ref={downloadScrollRef}
                  className="overflow-y-auto max-h-96"
                >
                  <div className="space-y-2">
                    {entries
                      .filter(isDownloadEntry)
                      .sort((a, b) => a.startTime - b.startTime)
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                        >
                          <div
                            className="font-medium text-gray-900 dark:text-gray-100 truncate"
                            title={entry.name}
                          >
                            {entry.name.split("/").pop()}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                            {getFileDescription(entry.name, t)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {t("duration")}: {entry.duration}ms | {t("size")}:{" "}
                            {entry.transferSize} bytes
                          </div>
                        </div>
                      ))}
                  </div>
                  {entries.filter(isDownloadEntry).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs italic mt-4">
                      {t("noRequests")}
                    </p>
                  )}
                </div>
              </Tab>
              <Tab
                key="client-to-server"
                title={
                  <div className="flex items-center gap-2">{t("upload")}</div>
                }
              >
                <div className="mt-4 mb-4">
                  <Button size="sm" onPress={uploadTest}>
                    {t("uploadTest")}
                  </Button>
                </div>
                <div ref={uploadScrollRef} className="overflow-y-auto max-h-96">
                  <div className="space-y-2">
                    {entries
                      .filter(isUploadEntry) // FIXME: how can I filter only POST/PUT/PATCH requests?
                      .sort((a, b) => a.startTime - b.startTime)
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                        >
                          <div
                            className="font-medium text-gray-900 dark:text-gray-100 truncate"
                            title={entry.name}
                          >
                            {entry.name.split("/").pop()}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                            {getFileDescription(entry.name, t)}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {t("duration")}: {entry.duration}ms | {t("size")}:{" "}
                            {entry.transferSize} bytes
                          </div>
                        </div>
                      ))}
                  </div>
                  {entries.filter(isUploadEntry).length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs italic mt-4">
                      {t("noRequests")}
                    </p>
                  )}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </>
      )}
    </Card>
  );
};
