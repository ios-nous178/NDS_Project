/**
 * 갤러리 변형 레지스트리 — AllComponents 카탈로그 카드의 라이브 프리뷰 SSOT.
 *
 * 예전엔 AllComponents 안에 컴포넌트당 손수 PREVIEWS(JSX) 레지스트리(~1900줄)를 따로 유지했다.
 * 이제는 **각 컴포넌트의 `*.stories.tsx` 에서 `tags: ["gallery"]` 로 큐레이션한 스토리**를
 * `composeStories` 로 모아 인라인 렌더한다 — 스토리가 단일 소스라 프리뷰 drift 가 사라진다.
 *
 * 큐레이션 규칙(스토리 파일 쪽): variant 매트릭스 / 슬롯이 채워진 대표 예시를 1~3개 `gallery`
 * 태그. interaction(play)·빈 Playground 는 태그하지 않는다. 게이트(check-storybook-catalog.mjs)가
 * "Components/* 스토리는 gallery 태그 ≥1" 를 강제한다(예외는 baseline).
 */
import { composeStories } from "@storybook/react";
import type { ComponentType } from "react";

export interface GalleryVariant {
  exportName: string;
  label: string;
  Component: ComponentType;
}

interface StoryModule {
  default?: { title?: string; tags?: string[] };
  [exportName: string]: unknown;
}

// Vite 정적 변환 — Icons/Tokens/AllComponents/자기 자신 등 비대상은 제외(번들 비대 방지).
// composeStories 에 project annotation 은 넘기지 않는다 — preview.ts 의 withSpecOverlay/withCssEditor
// 같은 toolbar decorator 재주입을 피하고, 브랜드 CSS 는 AllComponents 루트에서 cascade 시킨다.
const storyModules = import.meta.glob<StoryModule>(
  [
    "./*.stories.tsx",
    "!./AllComponents.stories.tsx",
    "!./Icons*.stories.tsx",
    "!./*Tokens.stories.tsx",
    "!./BrandComponentCoverage.stories.tsx",
    "!./SurfaceLayers.stories.tsx",
    "!./TokenEditor.stories.tsx",
  ],
  { eager: true },
);

function buildRegistry(): Map<string, GalleryVariant[]> {
  const registry = new Map<string, GalleryVariant[]>();

  for (const mod of Object.values(storyModules)) {
    const meta = mod.default;
    const title = meta?.title;
    if (!title || !title.startsWith("Components/")) continue;

    const metaTags = meta?.tags ?? [];
    let composed: Record<string, unknown>;
    try {
      // composeStories 타입은 CSF exports 를 받는다 — glob 모듈을 그대로 전달.
      composed = composeStories(mod as never) as Record<string, unknown>;
    } catch {
      continue;
    }

    for (const [exportName, Story] of Object.entries(composed)) {
      const raw = mod[exportName] as { tags?: string[]; storyName?: string } | undefined;
      const tags = [...metaTags, ...(raw?.tags ?? [])];
      if (!tags.includes("gallery")) continue;
      const list = registry.get(title) ?? [];
      list.push({
        exportName,
        label: (Story as { storyName?: string }).storyName ?? raw?.storyName ?? exportName,
        Component: Story as ComponentType,
      });
      registry.set(title, list);
    }
  }

  return registry;
}

const galleryRegistry = buildRegistry();

/** storybookTitle(= meta.title, inventory.storybookTitle 과 1:1)로 큐레이션된 gallery 변형 목록. */
export function getGalleryVariants(storybookTitle: string): GalleryVariant[] {
  return galleryRegistry.get(storybookTitle) ?? [];
}
