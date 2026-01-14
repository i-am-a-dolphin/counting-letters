# Copilot / AI Agent Notes — counting-letters

이 프로젝트는 Vite + React(TypeScript) SPA입니다. 아래는 AI 코딩 에이전트가 빠르게 생산적으로 작업하기 위해 알아야 할 핵심 정보입니다.

- **핵심 명령**:
  - 설치: `pnpm install` (레포에 `pnpm-lock.yaml` 있음)
  - 개발 서버: `pnpm dev` (스크립트: `vite`)
  - 빌드: `pnpm build` (스크립트: `tsc -b && vite build`)
  - 미리보기: `pnpm preview`
  - 린트: `pnpm lint` (ESLint)

- **아키텍처 요약**:
  - UI: `src` 하위의 React 컴포넌트들(예: [src/components/Header.tsx](src/components/Header.tsx#L1)).
  - 디자인 시스템: `@heroui/react` + Tailwind (`vite.config.ts`에 Tailwind 플러그인 포함).
  - 국제화: `react-i18next` 사용. 초기 언어 결정 로직은 [src/i18n.ts](src/i18n.ts#L1) 및 경로 기반 리디렉션 로직은 [src/main.tsx](src/main.tsx#L1)에 있음.
  - 핵심 비즈니스 로직(문자/단어 세기)은 [src/utils/count.ts](src/utils/count.ts#L1)에 집중되어 있음 — 여기서 언어별 카운트 규칙(중국어, 태국어 등)을 확인해야 함.
  - 최종 정적 산출물은 `dist` 폴더이며, `wrangler.jsonc`는 Cloudflare 배포 설정(assets.directory: ./dist, SPA handling)을 가리킴.

- **프로젝트-특화 패턴 / 주의점**:
  - 언어 우선순위: URL 경로(`/en`, `/zh` 등) → localStorage(`lang_pref`) → 브라우저 언어. 관련 코드: [src/i18n.ts](src/i18n.ts#L1), [src/main.tsx](src/main.tsx#L1), [src/App.tsx](src/App.tsx#L1).
  - zh(중국어) 전용 고급 통계 토글이 UI에 존재하므로 중국어 관련 계산 로직을 변경할 때는 `App.tsx`의 분기 로직을 확인할 것.
  - 텍스트 카운팅은 UTF-8/세그멘테이션을 고려함 — 태국어는 `Intl.Segmenter('th', { granularity: 'word' })` 사용.

- **파일 / 위치 참고 (자주 수정될 곳)**:
  - UI 진입: [src/main.tsx](src/main.tsx#L1)
  - 페이지/앱: [src/App.tsx](src/App.tsx#L1)
  - 카운트 유틸: [src/utils/count.ts](src/utils/count.ts#L1)
  - i18n 리소스: `src/locales/*.json`
  - 컴포넌트 샘플: [src/components/Controls.tsx](src/components/Controls.tsx#L1), [src/components/StatsCard.tsx](src/components/StatsCard.tsx#L1)

- **작업 시 권장 점검 목록**:
  1. 변경이 UI/경로 동작에 영향을 주는지 확인하려면 `pnpm dev`로 로컬에서 `/ko`와 `/en` 같은 경로를 테스트.
  2. 문자 세기 규칙을 수정하면 `src/utils/count.ts`와 `App.tsx`의 통계 표시 분기를 함께 검토.
  3. 빌드 파이프라인은 `tsc -b`를 실행하므로 타입 체크 오류가 빌드 실패 원인이 될 수 있음.
  4. Cloudflare 배포(필요 시): `wrangler.jsonc` 존재 — `dist`가 올바르게 생성되는지 확인.

- **안내: 무엇을 수정하면 안 되는가**
  - i18n 초기화 흐름을 무작정 건드리지 마세요. URL 기반 라우팅 + localStorage 우선순위가 여러 파일에서 중복되어 있으므로 통합 변경 시 리그레션이 생기기 쉽습니다.

피드백을 주세요 — 더 추가할 중요한 규칙이나 CI/배포 관련 정보를 원하시나요?
