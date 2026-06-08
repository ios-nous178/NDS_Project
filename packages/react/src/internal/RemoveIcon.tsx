import React from "react";

/**
 * 공유 제거(✕) 아이콘 — `Chip` · `TagInput` 의 제거 버튼 공용 SSOT.
 *
 * 라운드 캡 stroke 1.5 의 민자 X. 렌더 크기는 소비자 CSS(`__remove svg { width/height }`)가
 * 결정하고, `vector-effect="non-scaling-stroke"` 로 스트로크는 크기와 무관하게 1.5px 로 일정하다
 * (Chip 14px·TagInput 10px 어디서 써도 동일 두께 — 통일 전 두 사본과 시각 동일).
 * 색은 `currentColor` 라 각 컴포넌트의 색을 그대로 상속한다.
 *
 * SelectedItemRow 의 '원형 배경 X' 는 별개 어포던스라 여기 포함하지 않는다.
 */
export const RemoveIcon: React.FC = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3L11 11M11 3L3 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);
