const countCharsWithSpaces = (text: string): number => {
  return [...text].length;
};

const countCharsWithoutSpaces = (text: string): number => {
  return [...text.replace(/\s/g, "")].length;
};

const countWords = (text: string): number => {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
};

// 中文字數: 한자(漢字) 계열만 카운트 (구두점/숫자/공백 제외)
const countChineseChars = (text: string): number => {
  // CJK Unified Ideographs + Extension A
  // (대부분의 중국어 글자수 사이트가 사실상 이 범위를 '中文字'로 센다)
  const re = /[\u3400-\u4DBF\u4E00-\u9FFF]/g;
  return (text.match(re) ?? []).length;
};

// 英文單詞數: 영어 단어(word) 개수
const countEnglishWords = (text: string): number => {
  // 전각/반각 상관없이 알파벳 시퀀스만 잡음
  const re = /[A-Za-z]+/g;
  return (text.match(re) ?? []).length;
};

// 中文標點符號數: 중국어 전각 문장부호 카운트
const countChinesePunctuation = (text: string): number => {
  // 중국어에서 흔히 쓰이는 전각 구두점 세트
  const re = /[，。、；：？！（）［］｛｝《》〈〉「」『』—…·]/g;
  return (text.match(re) ?? []).length;
};

// 英文字數: 영어 알파벳 문자 수 (A–Z, a–z)
const countEnglishChars = (text: string): number => {
  const re = /[A-Za-z]/g;
  return (text.match(re) ?? []).length;
};

// 英文標點符號數: ASCII 기반 영문 문장부호 카운트
const countEnglishPunctuation = (text: string): number => {
  // ASCII punctuation 범위
  const re = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
  return (text.match(re) ?? []).length;
};

// 數字: 아라비아 숫자(0–9) 개수
const countDigits = (text: string): number => {
  const re = /\d/g;
  return (text.match(re) ?? []).length;
};

// 行列（段落）數: 비어있지 않은 줄(문단) 수
const countLines = (text: string): number => {
  if (!text) return 0;

  // \r\n (Windows), \n (Unix) 모두 처리
  const lines = text.split(/\r?\n/);

  // 공백만 있는 줄은 제외
  return lines.filter(line => line.trim() !== "").length;
};

// 字節單詞數 (UTF-8): 텍스트의 UTF-8 바이트 수
const countBytes = (text: string): number => {
  return new TextEncoder().encode(text).length;
};

// Thai 전용 단어 수 세기: 
const countThaiWords = (text: string): number => {
  if (!text.trim()) return 0;

  // 1️⃣ 숫자/기호 정규화
  const normalized = text
    .replace(/,/g, "")        // 1,000 → 1000
    .replace(/%/g, "")        // 20% → 20
    .replace(/\//g, " ");     // '/'만 delimiter로 처리 (하이픈 '-'은 유지)

  // 2️⃣ Thai word segmentation
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  const segments = [...segmenter.segment(normalized)];

  // 3️⃣ 유효한 단어만 카운트
  return segments.filter(seg => {
    const token = seg.segment.trim();
    if (!token) return false;

    // 태국어 / 영어 / 숫자(아라비아 + 태국 숫자) 중 하나라도 포함
    return /[ก-๙A-Za-z0-9๐-๙]/.test(token);
  }).length;
};

export {
  countCharsWithoutSpaces,
  countCharsWithSpaces,
  countWords,
  countChineseChars,
  countEnglishWords,
  countChinesePunctuation,
  countEnglishChars,
  countEnglishPunctuation,
  countDigits,
  countLines,
  countBytes,
  countThaiWords,
};
