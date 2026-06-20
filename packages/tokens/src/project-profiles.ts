/**
 * 프로젝트 프로필 — 프로젝트별 "의미/정책 차이"의 단일 수거처(SSOT).
 *
 * 배경: 검정 CTA 매핑(캐포비=neutral · Geniet=secondary), Toast 금지, 모달 confirm 색
 * 같은 프로젝트 분기가 validator 하드코딩(`project === "cashwalk-biz"`)·별칭맵·가이드 문자열에
 * 산재해 "한쪽만 고치는" 재발(캐포비 모달 노랑 5회+)의 토양이 됐다. 정책 **데이터**는
 * 여기로 모으고, validator/빌더는 프로젝트 slug 를 하드코딩하지 않고 프로필을 읽는다.
 *
 * 목표: 6번째 프로젝트 추가 = palette/semantic 토큰 + 이 파일 엔트리 1개.
 * (validator 코드 수정 0 — 같은 정책을 선언하면 룰이 데이터만으로 발화한다.)
 *
 * 스키마는 의도적으로 좁다 — 자유 Record 금지. 여기 못 담는 차이가 생기면 프로필을
 * 넓히기 전에 "컴포넌트/토큰(intent 슬롯) 설계 문제" 신호로 먼저 의심할 것.
 * ※ validator 룰 id(`cashwalk-biz-*`)는 텔레메트리 연속성을 위해 당분간 유지 —
 *   발화 조건만 프로필이 결정한다. id 일반화는 별도 단계.
 */

export type ProjectSlug = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";

export interface ProjectCtaPolicy {
  /**
   * 검정(다크 인버스) CTA 슬롯이 매핑되는 Button color.
   * "neutral" 선언 프로젝트는 neutral+solid 가 정당한 CTA — validator `neutral-solid-cta` 면제.
   */
  blackCta?: "neutral" | "secondary";
  /** 이 프로젝트에서 금지되는 Button color → 대체 안내(validator suggestion 에 그대로 노출). */
  deniedButtonColors?: ReadonlyArray<{ color: string; useInstead: string }>;
}

export interface ProjectModalPolicy {
  /**
   * 확인/팝업 모달 footer 주 action 의 color 계약.
   * "neutral" 이면 primary(또는 color 생략=기본 primary) solid 가 error
   * (대형 선택/데이터 모달은 validator 쪽 휴리스틱으로 면제).
   */
  confirmCtaColor?: "neutral";
  /** 단일 버튼 모달 footer 레이아웃 — "hug-right" 선언 시 full-width 가 위반. */
  singleButtonLayout?: "hug-right";
  /** 모달 footer 두 버튼의 세로 스택 금지(가로 유지 + 라벨 축약). */
  footerStackBanned?: boolean;
  /** 모달 footer 버튼 shape 계약 — "pill" 이면 footer 의 모든 버튼이 shape="pill" 이어야 함
   * (validator 가 비-pill 버튼을 위반으로 잡는다). 캐포비처럼 모달 버튼을 전부 pill 로 강제할 때. */
  footerButtonShape?: "pill";
}

export interface ProjectNotificationPolicy {
  /** 금지 알림 컴포넌트 태그 → 대체 SSOT 컴포넌트 태그. */
  bannedComponents?: ReadonlyArray<{ tag: string; useInstead: string }>;
}

export interface ProjectProfile {
  slug: ProjectSlug;
  /** 통용명/표기 흔들림 → 이 slug 로 정규화(소문자 비교). */
  aliases?: readonly string[];
  cta?: ProjectCtaPolicy;
  modal?: ProjectModalPolicy;
  notifications?: ProjectNotificationPolicy;
  admin?: {
    /**
     * 어드민 Page Pattern System 적용 여부 — 5종(onboarding/dashboard/list/detail/form)
     * 패턴 선언 강제 + onboarding/sidebar 골격 룰 + 어드민 폼 룰 묶음의 게이트.
     */
    pagePatternSystem?: boolean;
  };
}

export const PROJECT_PROFILES: Record<ProjectSlug, ProjectProfile> = {
  trost: { slug: "trost" },
  geniet: {
    slug: "geniet",
    // Geniet Solid Secondary = gray/900 다크 인버스(다른 프로젝트의 light subtle 과 다름).
    cta: { blackCta: "secondary" },
  },
  "nudge-eap": {
    slug: "nudge-eap",
    aliases: ["nudgeeap", "nudge", "eap"],
  },
  "cashwalk-biz": {
    slug: "cashwalk-biz",
    aliases: ["cashpobi", "cash-pobi", "cashwalkbiz", "cashwalk", "cashwalkforbusiness"],
    cta: {
      // Figma ButtonGuide(3098:1032) tone = Primary + Neutral 둘뿐. 검정 CTA = neutral solid #111.
      blackCta: "neutral",
      deniedButtonColors: [
        {
          color: "secondary",
          useInstead:
            '검정/회색 CTA 는 color="neutral" (solid=검정 #111 / soft=회색 #F5F5F5 / outlined=라인)',
        },
      ],
    },
    modal: {
      // Button 기본 color=primary(노랑) → 모달 confirm 에 color 생략 시 자동 노랑(5회+ 재발 근본).
      confirmCtaColor: "neutral",
      singleButtonLayout: "hug-right",
      footerStackBanned: true,
      // 캐포비 모달 버튼은 전부 pill — 보조 버튼에 shape="pill" 빠뜨려 각진 버튼 섞이는 재발 차단.
      footerButtonShape: "pill",
    },
    notifications: {
      // 캐포비 알림 SSOT = Snackbar(흰 카드·우측 상단·상태 칩·닫기 X). Toast 전면 금지.
      bannedComponents: [{ tag: "nds-toast", useInstead: "nds-snackbar" }],
    },
    admin: { pagePatternSystem: true },
  },
  runmile: {
    slug: "runmile",
    cta: {
      // Figma 런마일 ButtonGuide(5124:390) tone = Primary + Neutral 둘뿐. 검정 CTA = neutral solid #221E1F.
      blackCta: "neutral",
      deniedButtonColors: [
        {
          color: "secondary",
          useInstead:
            '검정/회색 CTA 는 color="neutral" (solid=검정 #221E1F / soft=회색 #F2F4F6 / outlined=라인)',
        },
      ],
    },
  },
};

export const PROJECT_SLUGS = Object.keys(PROJECT_PROFILES) as readonly ProjectSlug[];

/** 별칭(소문자) → 정식 slug. 프로필 aliases 에서 파생 — 별칭은 프로필에만 적는다. */
export const PROJECT_ALIAS_MAP: Readonly<Record<string, ProjectSlug>> = Object.freeze(
  Object.fromEntries(
    (Object.values(PROJECT_PROFILES) as ProjectProfile[]).flatMap((p) =>
      (p.aliases ?? []).map((a) => [a.toLowerCase(), p.slug]),
    ),
  ) as Record<string, ProjectSlug>,
);

/** 입력(정식 slug 또는 별칭)을 정식 slug 로. 미지 입력은 undefined — 폴백/경고는 호출부 책임. */
export function resolveProjectSlug(input?: string | null): ProjectSlug | undefined {
  const n = input?.trim().toLowerCase();
  if (!n) return undefined;
  if (n in PROJECT_PROFILES) return n as ProjectSlug;
  return PROJECT_ALIAS_MAP[n];
}

/** 입력(정식/별칭/미지)에 대응하는 프로필. 미지 프로젝트는 undefined — 정책 룰이 발화하지 않는다. */
export function getProjectProfile(input?: string | null): ProjectProfile | undefined {
  const slug = resolveProjectSlug(input);
  return slug ? PROJECT_PROFILES[slug] : undefined;
}
