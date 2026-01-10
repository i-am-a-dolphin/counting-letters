// 파일 설명 키 매핑 (특정 파일들)
export const fileDescriptionKeys: Record<string, string> = {
  "main.tsx": "fileDesc_main_tsx",
  "App.tsx": "fileDesc_App_tsx",
  "NetworkMonitor.tsx": "fileDesc_NetworkMonitor_tsx",
  "react.js": "fileDesc_react_js",
  "react-dom_client.js": "fileDesc_react_dom_client_js",
  "react_jsx-dev-runtime.js": "fileDesc_react_jsx_dev_runtime_js",
  "@heroui_react.js": "fileDesc_heroui_react_js",
  "lucide-react.js": "fileDesc_lucide_react_js",
  "i18next.js": "fileDesc_i18next_js",
  "react-i18next.js": "fileDesc_react_i18next_js",
  "index.css": "fileDesc_index_css",
  "calculator.svg": "fileDesc_calculator_svg",
  "en.json": "fileDesc_en_json",
  "ko.json": "fileDesc_ko_json",
  "zh.json": "fileDesc_zh_json",
  "i18n.ts": "fileDesc_i18n_ts",
  "Controls.tsx": "fileDesc_Controls_tsx",
  "Header.tsx": "fileDesc_Header_tsx",
  "StatsCard.tsx": "fileDesc_StatsCard_tsx",
  "count.ts": "fileDesc_count_ts",
  "useDarkMode.ts": "fileDesc_useDarkMode_ts",
  "useAutoScroll.ts": "fileDesc_useAutoScroll_ts",
  "hero.ts": "fileDesc_hero_ts",
  "fileDescriptions.ts": "fileDesc_fileDescriptions_ts",
  "env.mjs": "fileDesc_env_mjs",
  "@react-refresh": "fileDesc_react_refresh",
  client: "fileDesc_client",
  posts: "fileDesc_posts",
  "1": "fileDesc_1",
};

// 정규식 패턴 매핑 (패턴 우선순위대로)
export const patternDescriptions: Array<{ pattern: RegExp; key: string }> = [
    // Cloudflare Analytics (vcd 해시)
  { pattern: /^vcd[a-f0-9]{20,}$/, key: "fileDesc_cloudflare_analytics" },

  // Vite / Rollup src chunk
  { pattern: /^src-.*\.js$/, key: "fileDesc_vite_chunk_js" },

  // Cloudflare RUM
  { pattern: /^Rum$/, key: "fileDesc_cloudflare_rum" },
  
  { pattern: /^chunk-.*\.js$/, key: "fileDesc_chunk_js" },
  { pattern: /^dist-.*\.js$/, key: "fileDesc_dist_js" },
  { pattern: /^index-.*\.js$/, key: "fileDesc_index_js" },
  { pattern: /^index-.*\.css$/, key: "fileDesc_index_css" },
  { pattern: /^es-.*\.js$/, key: "fileDesc_es_js" },
  { pattern: /^features-.*\.js$/, key: "fileDesc_features_js" },
];

// 파일 설명 가져오기 함수
export const getFileDescription = (
  fileName: string,
  t: (key: string) => string
): string => {
  const baseName = fileName.split("/").pop()?.split("?")[0] || fileName;

  // 정규식 패턴 우선 체크
  for (const { pattern, key } of patternDescriptions) {
    if (pattern.test(baseName)) {
      return t(key);
    }
  }

  // 특정 파일 키로 변환
  const key = fileDescriptionKeys[baseName];
  if (key) {
    return t(key);
  }

  return t("fileDesc_other");
};
