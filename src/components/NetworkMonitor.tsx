import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface NetworkEntry {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  startTime: number;
}

export const NetworkMonitor = () => {
  const [entries, setEntries] = useState<NetworkEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState("server-to-client");
  const downloadScrollRef = useRef<HTMLDivElement>(null);
  const uploadScrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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

  // 스크롤을 하단으로 자동 이동
  useEffect(() => {
    if (downloadScrollRef.current) {
      downloadScrollRef.current.scrollTop =
        downloadScrollRef.current.scrollHeight;
    }
    if (uploadScrollRef.current) {
      uploadScrollRef.current.scrollTop = uploadScrollRef.current.scrollHeight;
    }
  }, [entries, selectedTab]);

  // 테스트 요청 함수들
  const testReceiveRequest = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const endTime = performance.now();
      const data = await response.json();
      console.log("Received data:", data);

      // 수동으로 다운로드 entries에 추가
      const manualEntry: NetworkEntry = {
        name: "https://jsonplaceholder.typicode.com/posts/1",
        initiatorType: "test-receive",
        duration: Math.round(endTime - startTime),
        transferSize: JSON.stringify(data).length,
        startTime: Math.round(startTime),
      };
      setEntries((prev) => [...prev, manualEntry]);
    } catch (error) {
      console.error("Receive request failed:", error);
    }
  };

  const testSendRequest = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            title: "Test Post",
            body: "This is a test request from network monitor",
            userId: 1,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const endTime = performance.now();
      const data = await response.json();
      console.log("Sent data:", data);

      // 수동으로 업로드 entries에 추가
      const manualEntry: NetworkEntry = {
        name: "https://jsonplaceholder.typicode.com/posts",
        initiatorType: "test-send",
        duration: Math.round(endTime - startTime),
        transferSize: JSON.stringify(data).length,
        startTime: Math.round(startTime),
      };
      setEntries((prev) => [...prev, manualEntry]);
    } catch (error) {
      console.error("Send request failed:", error);
    }
  };

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                  <Button size="sm" onPress={testReceiveRequest}>
                    {t("testReceiveRequest")}
                  </Button>
                </div>
                <div
                  ref={downloadScrollRef}
                  className="overflow-y-auto max-h-96"
                >
                  <div className="space-y-2">
                    {entries
                      .filter(
                        (entry) =>
                          entry.initiatorType === "test-receive" ||
                          entry.initiatorType !== "fetch"
                      )
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
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {t("duration")}: {entry.duration}ms | {t("size")}:{" "}
                            {entry.transferSize} bytes
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Tab>
              <Tab
                key="client-to-server"
                title={
                  <div className="flex items-center gap-2">{t("upload")}</div>
                }
              >
                <div className="mt-4 mb-4">
                  <Button size="sm" onPress={testSendRequest}>
                    {t("testSendRequest")}
                  </Button>
                </div>
                <div ref={uploadScrollRef} className="overflow-y-auto max-h-96">
                  <div className="space-y-2">
                    {entries
                      .filter((entry) => entry.initiatorType === "test-send") // FIXME: 업로드 요청만 필터링
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
                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                            {t("duration")}: {entry.duration}ms | {t("size")}:{" "}
                            {entry.transferSize} bytes
                          </div>
                        </div>
                      ))}
                  </div>
                  {entries.filter((entry) => entry.initiatorType === "fetch")
                    .length === 0 && (
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
