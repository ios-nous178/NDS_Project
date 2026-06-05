import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActivityTimeline,
  AddressSearch,
  AmountInput,
  AppointmentCard,
  Footer,
  AssessmentResultCard,
  Asset,
  AttachmentItem,
  AudioPlayer,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  NoticeAlert,
  Breadcrumb,
  BreathingGuide,
  Button,
  AddButton,
  Calendar,
  Card,
  CardVisual,
  Carousel,
  ChatBubble,
  Checkbox,
  Chip,
  CircularProgress,
  CommentItem,
  Confetti,
  ConsentChecklist,
  ContentViewer,
  CounselorCard,
  CountdownTimer,
  CouponCard,
  CrisisCallout,
  DataTable,
  type DataTableColumn,
  type DateRange,
  DatePicker,
  DateRangePicker,
  Divider,
  EmotionHeatmap,
  EmptyState,
  ExpandableText,
  FAB,
  FieldActionRow,
  FileUpload,
  FilterBar,
  FormField,
  GreetingHeader,
  Header,
  IconButton,
  Input,
  JournalEntry,
  LikeButton,
  LikertScale,
  List,
  ListItem,
  MediaCard,
  MediaThumbnail,
  MedicationItem,
  MentionInput,
  MoodSelector,
  NotificationItem,
  NumberStepper,
  OnlineIndicator,
  OrderSummaryCard,
  OtpInput,
  PageHeader,
  Pagination,
  PhoneInput,
  PinPad,
  PriceTag,
  ProductCard,
  ProgressBar,
  QuickActionGrid,
  Radio,
  ReactionPicker,
  ReviewCard,
  ScoreGauge,
  SearchInput,
  SegmentedControl,
  Select,
  MultiSelect,
  PageSizeSelect,
  SelectionCard,
  SelectionButtonGroup,
  Skeleton,
  Slider,
  Snackbar,
  Sparkline,
  Spinner,
  StarRating,
  StatCard,
  StatusTimeline,
  Stepper,
  StepProgress,
  StreakCard,
  Tabs,
  TagInput,
  TextButton,
  Textarea,
  TimePicker,
  TimeSlotPicker,
  TipCard,
  TitleBlock,
  Toggle,
  TrendingKeywords,
  PopularPosts,
  FloatingCtaBanner,
  ImageUpload,
  ActionChip,
  SelectedItemsPanel,
  RegionRow,
  UserCard,
  VotePoll,
  Chart,
  StatsTable,
} from "@nudge-design/react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  HomeActiveIcon,
  HomeIcon,
  MicrophoneIcon,
  MoreIcon,
  MypageIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  TelephoneIcon,
  VideocameraIcon,
} from "@nudge-design/icons";
import { cv, radius, shadow } from "@nudge-design/tokens";
import inventory from "../../../../metadata/componentInventory.json";
import componentGuides from "../../../../metadata/componentGuides.json";

type ComponentGuide = {
  name: string;
  summary?: string;
  pitfalls?: string[];
  recommended?: string[];
  usagePolicy?: {
    useFor?: string[];
    doNotUseFor?: string[];
    // SSOT(packages/mcp guides.ts ComponentGuide)는 boolean 도 허용(예: ProductCard
    // rankingBadgeAndSoldOutMutuallyExclusive: true). 좁게 복제돼 drift 났던 것을 맞춤.
    limits?: Record<string, string | number | boolean>;
  };
  figmaNodeUrl?: string;
  accessibility?: string[];
};

const GUIDES: Record<string, ComponentGuide> =
  (componentGuides as { components?: Record<string, ComponentGuide> }).components ?? {};

/* ──────────────────────────────────────────
   Preview registry
   각 컴포넌트의 미니 라이브 프리뷰. 등록되지 않은 컴포넌트는
   메타 정보(이름·카테고리·설명)만 표시되는 fallback 카드를 사용.
   ────────────────────────────────────────── */

type PreviewRender = () => React.ReactNode;

const PREVIEWS: Record<string, PreviewRender> = {
  Button: () => (
    <div style={previewRow}>
      <Button size="sm">확인</Button>
      <Button size="sm" variant="outlined">
        취소
      </Button>
    </div>
  ),
  AddButton: () => (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}
    >
      <AddButton>지역 추가</AddButton>
      <AddButton error>지역 추가</AddButton>
    </div>
  ),
  TextButton: () => (
    <div style={previewRow}>
      <TextButton>더보기</TextButton>
    </div>
  ),
  IconButton: () => (
    <div style={previewRow}>
      <IconButton aria-label="검색" icon={<SearchIcon size={20} />} />
    </div>
  ),
  Badge: () => (
    <div style={previewRow}>
      <Badge variant="fill" color="brand">
        신규
      </Badge>
      <Badge variant="ghost" color="success">
        완료
      </Badge>
      <Badge variant="line" color="error">
        필수
      </Badge>
    </div>
  ),
  Chip: () => (
    <div style={previewRow}>
      <Chip label="우울감" variant="outlined" color="brand" />
      <Chip label="수면" variant="fill" color="brand" />
    </div>
  ),
  Avatar: () => (
    <div style={previewRow}>
      <Avatar name="홍길동" size="md" />
      <Avatar name="김상담" size="md" />
    </div>
  ),
  Asset: () => (
    <div style={previewRow}>
      <Asset size="md" content={{ type: "initial", name: "이정민" }} />
      <Asset size="md" shape="rounded" content={{ type: "initial", name: "AB" }} />
      <Asset
        size="md"
        content={{ type: "initial", name: "C" }}
        acc={
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid white",
            }}
          />
        }
      />
    </div>
  ),
  AvatarGroup: () => (
    <div style={previewRow}>
      <AvatarGroup
        size="md"
        items={[{ name: "A" }, { name: "B" }, { name: "C" }, { name: "D" }]}
        max={3}
      />
    </div>
  ),
  Toggle: () => (
    <div style={previewRow}>
      <Toggle checked onCheckedChange={() => undefined} />
      <Toggle checked={false} onCheckedChange={() => undefined} />
      <Toggle checked disabled onCheckedChange={() => undefined} />
    </div>
  ),
  Checkbox: () => (
    <div style={previewRow}>
      <Checkbox checked onCheckedChange={() => undefined} />
      <Checkbox checked={false} onCheckedChange={() => undefined} />
      <Checkbox checked disabled onCheckedChange={() => undefined} />
      <Checkbox checked={false} disabled onCheckedChange={() => undefined} />
    </div>
  ),
  Radio: () => (
    <div style={previewRow}>
      <Radio checked onCheckedChange={() => undefined} />
      <Radio checked={false} onCheckedChange={() => undefined} />
      <Radio checked disabled onCheckedChange={() => undefined} />
      <Radio checked={false} disabled onCheckedChange={() => undefined} />
    </div>
  ),
  StarRating: () => (
    <div style={previewRow}>
      <StarRating value={4} size={18} />
    </div>
  ),
  Spinner: () => (
    <div style={previewRow}>
      <Spinner size={24} />
    </div>
  ),
  ProgressBar: () => (
    <div style={{ width: "100%", maxWidth: 200 }}>
      <ProgressBar value={60} max={100} />
    </div>
  ),
  CircularProgress: () => (
    <div style={previewRow}>
      <CircularProgress value={70} size={44} />
    </div>
  ),
  Skeleton: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 200 }}>
      <Skeleton width="100%" height={12} />
      <Skeleton width="70%" height={12} />
    </div>
  ),
  Divider: () => (
    <div style={{ width: "100%", maxWidth: 200 }}>
      <Divider />
    </div>
  ),
  Input: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Input placeholder="이메일 입력" />
    </div>
  ),
  SearchInput: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <SearchInput placeholder="검색" />
    </div>
  ),
  Select: () => {
    function SelectPreview() {
      const [v, setV] = useState("a");
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <Select
            value={v}
            onValueChange={setV}
            options={[
              { value: "a", label: "선택 A" },
              { value: "b", label: "선택 B" },
            ]}
          />
        </div>
      );
    }
    return <SelectPreview />;
  },
  Tabs: () => {
    function TabsPreview() {
      const [lineKey, setLineKey] = useState("home");
      const [chipKey, setChipKey] = useState("all");
      const [segKey, setSegKey] = useState("dash");
      const dashIcon = (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
      const riskIcon = (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2L18 17H2L10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--semantic-gap-default)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 240 }}>
            <Tabs
              activeKey={lineKey}
              onTabChange={setLineKey}
              variant="line"
              size="mobile"
              tone="neutral"
              items={[
                { key: "home", title: "홈" },
                { key: "list", title: "목록" },
              ]}
            />
          </div>
          <div style={{ width: "100%", maxWidth: 240 }}>
            <Tabs
              activeKey={chipKey}
              onTabChange={setChipKey}
              variant="chip"
              size="mobile"
              tone="color"
              fullWidth={false}
              items={[
                { key: "all", title: "전체" },
                { key: "work", title: "직장" },
                { key: "love", title: "연애" },
              ]}
            />
          </div>
          <div style={{ width: "100%", maxWidth: 240 }}>
            <Tabs
              activeKey={segKey}
              onTabChange={setSegKey}
              variant="segment"
              items={[
                { key: "dash", title: "대시보드", icon: dashIcon },
                { key: "risk", title: "고위험군", icon: riskIcon },
              ]}
            />
          </div>
        </div>
      );
    }
    return <TabsPreview />;
  },
  Pagination: () => {
    function PaginationPreview() {
      const [p, setP] = useState(2);
      return <Pagination page={p} totalPages={5} onPageChange={setP} />;
    }
    return <PaginationPreview />;
  },
  NumberStepper: () => {
    function StepperPreview() {
      const [v, setV] = useState(1);
      return <NumberStepper value={v} onValueChange={setV} min={0} max={10} />;
    }
    return <StepperPreview />;
  },
  Slider: () => {
    function SliderPreview() {
      const [v, setV] = useState(40);
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <Slider value={v} onValueChange={setV} min={0} max={100} />
        </div>
      );
    }
    return <SliderPreview />;
  },
  PriceTag: () => (
    <div style={previewRow}>
      <PriceTag amount={29000} originalAmount={39000} />
    </div>
  ),
  Card: () => (
    <Card style={{ maxWidth: 220 }}>
      <Card.Body>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>카드 헤드</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>본문 영역</p>
      </Card.Body>
    </Card>
  ),
  Banner: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Banner variant="filled" title="이번주 신규 콘텐츠" />
    </div>
  ),
  NoticeAlert: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <NoticeAlert variant="caution" message="1,000명 단위로 입력해 주세요." />
    </div>
  ),
  EmptyState: () => (
    <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
      <EmptyState title="아직 항목이 없어요" description="새로 추가해보세요" />
    </div>
  ),
  Snackbar: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Snackbar variant="success" title="저장되었어요" />
    </div>
  ),
  Modal: () => (
    <div style={mockModalSurface}>
      <div style={mockModalHeader}>
        <div style={mockModalHeaderSpacer} aria-hidden />
        <div style={mockModalHeaderTitle}>알림</div>
        <span style={mockModalClose} aria-hidden>
          <CloseIcon size={16} color="var(--semantic-icon-normal-default)" />
        </span>
      </div>
      <div style={mockModalBody}>저장된 변경사항을 적용할까요?</div>
      <div style={mockModalFooter}>
        <div style={mockModalCancelBtn}>취소</div>
        <div style={mockModalConfirmBtn}>확인</div>
      </div>
    </div>
  ),
  Tooltip: () => (
    <div style={mockTooltipWrap}>
      <Button size="sm" variant="outlined">
        Hover
      </Button>
      <div style={mockTooltipBubble}>
        툴팁 내용
        <span style={mockTooltipArrow} aria-hidden />
      </div>
    </div>
  ),

  /* ─── Overlay (정적 미리보기) ─── */
  Popup: () => (
    <div style={mockPopupSurface}>
      <div style={mockPopupTitle}>정말 삭제할까요?</div>
      <div style={mockPopupDesc}>이 작업은 되돌릴 수 없습니다.</div>
      <div style={mockPopupActions}>
        <div style={mockPopupCancelBtn}>취소</div>
        <div style={mockPopupConfirmBtn}>삭제</div>
      </div>
    </div>
  ),
  BottomSheet: () => (
    <div style={mockOverlayStage}>
      <div style={mockStageBody}>본문 영역</div>
      <div style={mockStageScrim} aria-hidden />
      <div style={mockBottomSheetPanel}>
        <div style={mockGrabber} aria-hidden />
        <div style={mockSheetTitle}>필터</div>
        <div style={mockSheetBody}>옵션을 선택하세요.</div>
      </div>
    </div>
  ),
  Toast: () => (
    <div style={mockOverlayStage}>
      <div style={mockStageBody}>본문 영역</div>
      <div style={mockToastFloating}>
        <span style={mockToastIcon} aria-hidden>
          ✓
        </span>
        <span>저장되었어요</span>
      </div>
    </div>
  ),
  Lightbox: () => (
    <div style={mockLightboxStage}>
      <span style={mockLightboxCloseBtn} aria-hidden>
        <CloseIcon size={12} color="#fff" />
      </span>
      <span style={mockLightboxNavLeft} aria-hidden>
        ‹
      </span>
      <span style={mockLightboxNavRight} aria-hidden>
        ›
      </span>
      <div style={mockLightboxImageNew} aria-hidden />
      <div style={mockLightboxCounter}>1 / 4</div>
    </div>
  ),
  ShareSheet: () => (
    <div style={mockOverlayStage}>
      <div style={mockStageBody}>본문 영역</div>
      <div style={mockStageScrim} aria-hidden />
      <div style={mockShareSheetPanel}>
        <div style={mockGrabber} aria-hidden />
        <div style={mockShareSheetRow}>
          {[
            { key: "copy", label: "복사" },
            { key: "link", label: "링크" },
            { key: "more", label: "더보기" },
          ].map((t) => (
            <div key={t.key} style={mockShareItem}>
              <span style={mockShareIcon} aria-hidden>
                <ShareIcon size={16} />
              </span>
              <span style={mockShareLabel}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  CoachMark: () => (
    <div style={mockCoachWrap}>
      <Button size="sm" variant="outlined">
        도움말
      </Button>
      <div style={mockCoachCard}>
        <span style={mockCoachArrow} aria-hidden />
        <div style={mockCoachTitle}>여기를 눌러보세요</div>
        <div style={mockCoachDesc}>이 버튼이 핵심 액션입니다.</div>
      </div>
    </div>
  ),

  /* ─── Domain / Data cards ─── */
  AppointmentCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <AppointmentCard
        date="2026-05-12"
        startTime="14:00"
        endTime="14:50"
        title="김상담사 · 화상 상담"
        status="confirmed"
      />
    </div>
  ),
  JournalEntry: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <JournalEntry date="오늘" body="오랜만에 마음이 가벼웠다." mood="🙂" />
    </div>
  ),
  StreakCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <StreakCard
        streak={7}
        unit="일"
        days={[true, true, true, true, true, true, true].map((done, i) => ({
          date: `D-${6 - i}`,
          done,
        }))}
      />
    </div>
  ),
  EmotionHeatmap: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <EmotionHeatmap
        entries={Array.from({ length: 14 }, (_, i) => ({
          date: `2026-05-${String(i + 1).padStart(2, "0")}`,
          level: (i % 5) as 0 | 1 | 2 | 3 | 4,
        }))}
      />
    </div>
  ),
  BreathingGuide: () => (
    <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
      <BreathingGuide autoStart={false} />
    </div>
  ),
  ChatComposer: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Input placeholder="메시지 입력 (ChatComposer 대체 미리보기)" />
    </div>
  ),
  CommentItem: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <CommentItem author="홍길동" text="좋은 글 잘 읽었습니다." time="방금 전" />
    </div>
  ),
  LikeButton: () => {
    function L() {
      const [liked, setLiked] = useState(false);
      return <LikeButton liked={liked} onChange={setLiked} count={12} />;
    }
    return <L />;
  },
  ReviewCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <ReviewCard author="익명" rating={4.5} body="도움이 많이 됐어요." />
    </div>
  ),
  VotePoll: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <VotePoll
        question="가장 도움된 콘텐츠?"
        options={[
          { key: "a", label: "명상", count: 12 },
          { key: "b", label: "일기", count: 8 },
        ]}
        showResults
        footer="총 20표"
      />
    </div>
  ),
  Chart: () => (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Chart
        type="bar"
        labels={["10", "20", "30", "40", "50", "60"]}
        series={[
          { name: "남성", values: [14, 15, 22, 25, 26, 16] },
          { name: "여성", values: [14, 18, 20, 28, 26, 14] },
        ]}
      />
    </div>
  ),
  StatsTable: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <StatsTable>
        <thead>
          <tr>
            <th>연령</th>
            <th>성별</th>
            <th>당첨자 수</th>
          </tr>
        </thead>
        <tbody>
          <tr className="is-summary">
            <td colSpan={2}>총합</td>
            <td>999,999</td>
          </tr>
          <tr>
            <td rowSpan={2}>NN대</td>
            <td>남성</td>
            <td>99</td>
          </tr>
          <tr>
            <td>여성</td>
            <td>99</td>
          </tr>
        </tbody>
      </StatsTable>
    </div>
  ),
  MultiSelect: () => {
    function M() {
      const [v, setV] = useState<string[]>(["a"]);
      return (
        <div style={{ width: "100%", maxWidth: 280 }}>
          <MultiSelect
            placeholder="모든 광고"
            searchPlaceholder="광고명으로 검색"
            value={v}
            onValueChange={setV}
            options={[
              { value: "a", label: "캠페인 A 타겟팅" },
              { value: "b", label: "캠페인 B 리타겟" },
              { value: "c", label: "캠페인 C 포커싱" },
            ]}
          />
        </div>
      );
    }
    return <M />;
  },
  PageSizeSelect: () => {
    function P() {
      const [n, setN] = useState(100);
      return <PageSizeSelect value={n} onValueChange={setN} />;
    }
    return <P />;
  },
  ReactionPicker: () => {
    function R() {
      const [v, setV] = useState<string[]>([]);
      return (
        <ReactionPicker
          value={v}
          onValueChange={setV}
          options={[
            { key: "1", emoji: "👍" },
            { key: "2", emoji: "❤️" },
            { key: "3", emoji: "🙏" },
          ]}
        />
      );
    }
    return <R />;
  },
  GreetingHeader: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <GreetingHeader name="지민" greeting="안녕하세요" question="오늘 기분 어떠세요?" />
    </div>
  ),
  TipCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <TipCard tone="info" title="작은 팁" description="천천히 호흡해보세요." />
    </div>
  ),
  TitleBlock: () => (
    <div style={{ width: "100%", maxWidth: 280 }}>
      <TitleBlock level="h4" title="바로 상담하기" subtitle="급한 문제는 5분 내 바로 상담" />
    </div>
  ),
  NotificationItem: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <NotificationItem kind="info" title="예약 알림" description="14:00 상담이 시작됩니다." />
    </div>
  ),
  UserCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <UserCard name="홍길동" handle="@gildong" bio="EAP 전문 상담사" />
    </div>
  ),
  ProductCard: () => (
    <ProductCard
      thumbnail="https://picsum.photos/seed/cashdeal/300/300"
      title="허닭X캐시딜단독 베스트 닭가슴살 패키지 모음전"
      discountPercent={31}
      price={13900}
    />
  ),
  CouponCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <CouponCard discount="30%" title="신규 가입 쿠폰" expiry="~5/31" />
    </div>
  ),
  OrderSummaryCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <OrderSummaryCard
        rows={[
          { label: "수량", value: "1" },
          { label: "할인", value: "-3,000원" },
        ]}
        total="29,000원"
      />
    </div>
  ),
  CardVisual: () => (
    <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
      <CardVisual brand="visa" number="**** **** **** 1234" holder="홍길동" expiry="12/27" />
    </div>
  ),
  StatusTimeline: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <StatusTimeline
        steps={[
          { key: "1", label: "접수" },
          { key: "2", label: "진행" },
          { key: "3", label: "완료" },
        ]}
        current={1}
      />
    </div>
  ),

  /* ─── Input ─── */
  Autocomplete: () => {
    function A() {
      const [v, setV] = useState("");
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <Autocomplete
            value={v}
            onValueChange={setV}
            options={[
              { value: "a", label: "옵션 A" },
              { value: "b", label: "옵션 B" },
            ]}
            placeholder="검색"
          />
        </div>
      );
    }
    return <A />;
  },
  SelectionCard: () => {
    function SC() {
      const [v, setV] = useState("a");
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <SelectionCard.Group value={v} onValueChange={(next) => setV(next as string)}>
            <SelectionCard.Item value="a" title="선택 A" description="설명" />
          </SelectionCard.Group>
        </div>
      );
    }
    return <SC />;
  },
  PhoneInput: () => {
    function P() {
      const [v, setV] = useState("");
      const [country, setCountry] = useState("+82");
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <PhoneInput
            value={v}
            onValueChange={setV}
            countryCode={country}
            onCountryChange={setCountry}
            placeholder="010-0000-0000"
          />
        </div>
      );
    }
    return <P />;
  },
  AmountInput: () => {
    function A() {
      const [v, setV] = useState<number | null>(null);
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <AmountInput value={v} onValueChange={setV} unit="원" />
        </div>
      );
    }
    return <A />;
  },
  TagInput: () => {
    function T() {
      const [v, setV] = useState<string[]>(["수면", "스트레스"]);
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <TagInput value={v} onValueChange={setV} placeholder="태그 추가" />
        </div>
      );
    }
    return <T />;
  },
  MentionInput: () => {
    function M() {
      const [v, setV] = useState("");
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <MentionInput value={v} onValueChange={setV} users={[{ key: "1", name: "홍길동" }]} />
        </div>
      );
    }
    return <M />;
  },
  PinPad: () => {
    function P() {
      const [v, setV] = useState("");
      return (
        <div style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
          <PinPad value={v} onValueChange={setV} length={6} />
        </div>
      );
    }
    return <P />;
  },
  TimePicker: () => {
    function T() {
      const [v, setV] = useState("18:00");
      return (
        <div style={{ width: "100%", maxWidth: 320 }} data-brand="cashwalk-biz">
          <TimePicker
            value={v}
            onValueChange={setV}
            presets={[{ label: "자정까지", value: "23:59" }]}
          />
        </div>
      );
    }
    return <T />;
  },
  AddressSearch: () => {
    function A() {
      const [q, setQ] = useState("");
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <AddressSearch
            query={q}
            onQueryChange={setQ}
            onSearch={() => {}}
            results={[]}
            value={null}
            onValueChange={() => {}}
          />
        </div>
      );
    }
    return <A />;
  },
  Calendar: () => (
    <div style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
      <Calendar value="2026-05-12" onChange={() => {}} />
    </div>
  ),
  SignaturePad: () => (
    <div
      style={{
        width: 180,
        height: 80,
        border: "1px dashed #D8D8D8",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#888",
      }}
    >
      서명 영역 (SignaturePad)
    </div>
  ),
  ImageCropper: () => (
    <div
      style={{
        width: 180,
        height: 100,
        background: "#F4F4F4",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#888",
      }}
    >
      이미지 크롭 영역
    </div>
  ),

  /* ─── Layout ─── */
  PageHeader: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <PageHeader title="페이지 제목" subtitle="부제" />
    </div>
  ),
  FieldActionRow: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <FieldActionRow
        field={<Input placeholder="인증번호 입력" />}
        action={<Button size="field">확인</Button>}
      />
    </div>
  ),
  MultiStepForm: () => (
    <div style={{ width: "100%", maxWidth: 240, fontSize: 12 }}>
      <div
        style={{
          display: "flex",
          gap: "var(--semantic-gap-tight)",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, height: 4, background: "#2B96ED", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 4, background: "#2B96ED", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 4, background: "#E6E7EB", borderRadius: 2 }} />
        <span style={{ fontSize: 11, color: "#888", marginLeft: 4 }}>2 / 3</span>
      </div>
      <p style={{ margin: 0, fontWeight: 700 }}>단계 2: 정보 입력</p>
    </div>
  ),
  QuickActionGrid: () => (
    <QuickActionGrid
      actions={[
        { key: "1", label: "검색", icon: <SearchIcon size={20} />, onClick: () => {} },
        { key: "2", label: "추가", icon: <PlusIcon size={20} />, onClick: () => {} },
        { key: "3", label: "캘린더", icon: <CalendarIcon size={20} />, onClick: () => {} },
        { key: "4", label: "공유", icon: <ShareIcon size={20} />, onClick: () => {} },
      ]}
    />
  ),
  PullToRefresh: () => (
    <div
      style={{
        width: 180,
        padding: "var(--semantic-inset-card) var(--semantic-inset-input)",
        border: "1px dashed #D8D8D8",
        borderRadius: 8,
        textAlign: "center",
        fontSize: 11,
        color: "#888",
      }}
    >
      ↓ 당겨서 새로고침
    </div>
  ),
  FilterBar: () => {
    function F() {
      const [v, setV] = useState<string[]>(["a"]);
      return (
        <FilterBar
          value={v}
          onValueChange={setV}
          options={[
            { key: "a", label: "전체" },
            { key: "b", label: "예정" },
            { key: "c", label: "완료" },
          ]}
        />
      );
    }
    return <F />;
  },

  /* ─── Misc / Visual ─── */
  FAB: () => (
    <div style={previewRow}>
      <FAB position="static" icon={<PlusIcon size={20} />} label="추가" onClick={() => {}} />
    </div>
  ),
  Sparkline: () => <Sparkline data={[3, 5, 4, 8, 6, 9, 7, 11]} width={140} height={40} />,
  StatCard: () => (
    <div style={{ width: "100%", maxWidth: 200 }}>
      <StatCard label="이번주 기록" value="12" unit="회" />
    </div>
  ),
  ExpandableText: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <ExpandableText lines={2}>
        스트레스가 많은 한 주였습니다. 일이 몰려서 마음이 무거웠는데 그래도 잘 버텼어요. 내일은 좀
        더 가볍게 시작해보고 싶습니다.
      </ExpandableText>
    </div>
  ),
  OnlineIndicator: () => (
    <div style={{ ...previewRow, gap: "var(--semantic-gap-loose)" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <OnlineIndicator status="online" /> online
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <OnlineIndicator status="away" /> away
      </span>
    </div>
  ),
  CountdownTimer: () => <CountdownTimer endsAt={new Date(Date.now() + 65 * 1000)} />,
  Confetti: () => (
    <div
      style={{
        width: 80,
        height: 80,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
      }}
    >
      🎉
      <Confetti active={false} onComplete={() => {}} />
    </div>
  ),
  Carousel: () => (
    <div style={{ width: 200 }}>
      <Carousel indicator="dots">
        <div
          style={{
            height: 70,
            background: "#E6F3FD",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          슬라이드 1
        </div>
        <div
          style={{
            height: 70,
            background: "#FDF1F6",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          슬라이드 2
        </div>
        <div
          style={{
            height: 70,
            background: "#EAF8F2",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          슬라이드 3
        </div>
      </Carousel>
    </div>
  ),
  VideoPlayer: () => (
    <div
      style={{
        width: 180,
        height: 100,
        background: "#111",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 24,
      }}
    >
      ▶
    </div>
  ),
  WaveformPlayer: () => (
    <div
      style={{
        width: 180,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px var(--semantic-inset-input)",
        background: "#F8F9FB",
        borderRadius: 24,
      }}
    >
      <span style={{ fontSize: 16 }}>▶</span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
        {[8, 14, 10, 18, 22, 16, 12, 20, 14, 10, 16, 12].map((h, i) => (
          <span
            key={i}
            style={{
              width: 3,
              height: h,
              background: i < 5 ? "#2B96ED" : "#D8D8D8",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: "#666" }}>0:12</span>
    </div>
  ),
  VoiceRecorder: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F13F00",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        ●
      </span>
      <span style={{ fontSize: 12, color: "#666" }}>녹음 대기</span>
    </div>
  ),
  CallControlBar: () => (
    <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F4F4F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MicrophoneIcon size={20} color="var(--semantic-icon-normal-default)" />
      </span>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F4F4F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VideocameraIcon size={20} color="var(--semantic-icon-normal-default)" />
      </span>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#F13F00",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TelephoneIcon size={20} color="var(--semantic-icon-inverse-default)" />
      </span>
    </div>
  ),

  /* ─── 신규 컴포넌트 미리보기 ─── */

  /* 일반 */
  DSHighlight: () => (
    <div style={dsHighlightFrame}>
      <div style={dsHighlightLabel}>OFF · 영역 · 개별 · 전체</div>
      <div style={{ display: "flex", gap: 6 }}>
        {["OFF", "영역", "개별", "전체"].map((m, i) => (
          <span key={m} style={i === 1 ? dsHighlightModeActive : dsHighlightMode}>
            {m}
          </span>
        ))}
      </div>
    </div>
  ),

  /* 입력 */
  Textarea: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Textarea placeholder="오늘의 일기를 적어보세요" minHeight={72} />
    </div>
  ),
  FormField: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <FormField label="이메일" required helper="로그인 시 사용됩니다">
        <Input placeholder="you@example.com" />
      </FormField>
    </div>
  ),
  FileUpload: () => {
    function F() {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <div style={{ width: "100%", maxWidth: 240 }}>
          <FileUpload value={files} onValueChange={setFiles} description="PDF · 최대 10MB" />
        </div>
      );
    }
    return <F />;
  },
  OtpInput: () => {
    function O() {
      const [v, setV] = useState("12");
      return (
        <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
          <OtpInput length={6} value={v} onValueChange={setV} />
        </div>
      );
    }
    return <O />;
  },
  DatePicker: () => {
    function D() {
      const [v, setV] = useState<Date | undefined>(new Date("2026-05-12"));
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <DatePicker value={v} onChange={setV} />
        </div>
      );
    }
    return <D />;
  },
  DateRangePicker: () => {
    function R() {
      const [v, setV] = useState<DateRange>({
        from: new Date("2026-05-01"),
        to: new Date("2026-05-07"),
      });
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <DateRangePicker value={v} onValueChange={setV} />
        </div>
      );
    }
    return <R />;
  },
  TimeSlotPicker: () => {
    function T() {
      const [v, setV] = useState("14:00");
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <TimeSlotPicker
            value={v}
            onValueChange={setV}
            columns={3}
            slots={[
              { value: "13:00" },
              { value: "13:30", unavailable: true },
              { value: "14:00" },
              { value: "14:30" },
              { value: "15:00" },
              { value: "15:30" },
            ]}
          />
        </div>
      );
    }
    return <T />;
  },
  MoodSelector: () => {
    function M() {
      const [v, setV] = useState("good");
      return (
        <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
          <MoodSelector value={v} onValueChange={setV} showLabels={false} />
        </div>
      );
    }
    return <M />;
  },
  LikertScale: () => {
    function L() {
      const [v, setV] = useState<string | number>(3);
      return (
        <div style={{ width: "100%", maxWidth: 240 }}>
          <LikertScale
            value={v}
            onValueChange={setV}
            options={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]}
            startLabel="전혀 아니다"
            endLabel="매우 그렇다"
          />
        </div>
      );
    }
    return <L />;
  },
  SegmentedControl: () => {
    function S() {
      const [v, setV] = useState("week");
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <SegmentedControl
            value={v}
            onValueChange={setV}
            options={[
              { value: "day", label: "일" },
              { value: "week", label: "주" },
              { value: "month", label: "월" },
            ]}
          />
        </div>
      );
    }
    return <S />;
  },

  SelectionButtonGroup: () => {
    function S() {
      const [v, setV] = useState("always");
      return (
        <SelectionButtonGroup
          value={v}
          onValueChange={setV}
          options={[
            { value: "always", label: "항상" },
            { value: "time", label: "특정 시간만" },
            { value: "weekday", label: "특정 요일/시간만" },
          ]}
        />
      );
    }
    return <S />;
  },

  /* 오버레이 */
  Drawer: () => (
    <div style={mockDrawerStage}>
      <div style={mockDrawerPageHint} aria-hidden>
        본문
      </div>
      <div style={mockDrawerScrim} aria-hidden />
      <div style={mockDrawerPanel}>
        <div style={mockDrawerHeader}>
          <div style={mockDrawerTitle}>필터</div>
          <span style={mockDrawerClose} aria-hidden>
            <CloseIcon size={12} color="var(--semantic-icon-normal-default)" />
          </span>
        </div>
        <div style={mockDrawerBody}>
          <div style={mockDrawerRow}>정렬 기준</div>
          <div style={mockDrawerRow}>카테고리</div>
          <div style={mockDrawerRow}>기간</div>
        </div>
      </div>
    </div>
  ),
  DropdownMenu: () => (
    <div style={mockDropdownWrap}>
      <div style={mockDropdownTrigger}>
        <MoreIcon size={18} color="var(--semantic-icon-normal-default)" />
      </div>
      <div style={mockDropdownPanel}>
        <div style={mockDropdownItem}>편집</div>
        <div style={mockDropdownItem}>공유</div>
        <div style={mockDropdownDivider} aria-hidden />
        <div style={{ ...mockDropdownItem, color: cv.textRole.statusError }}>삭제</div>
      </div>
    </div>
  ),

  /* 내비게이션 */
  Breadcrumb: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Breadcrumb
        items={[
          { label: "홈", href: "#" },
          { label: "프로그램", href: "#" },
          { label: "스트레스" },
        ]}
      />
    </div>
  ),

  /* 레이아웃 — Header 통합 base (옛 AppBar / WebHeader) */
  HeaderCompact: () => (
    <div style={mockPhoneShell}>
      <Header
        variant="compact"
        position="static"
        title="페이지 제목"
        leftSlot={<ChevronLeftIcon size={20} color="var(--semantic-icon-normal-default)" />}
        rightSlot={<SearchIcon size={18} color="var(--semantic-icon-normal-default)" />}
      />
      <div style={mockPhoneBody}>본문 영역</div>
    </div>
  ),
  Footer: () => (
    <div style={mockPhoneShell}>
      <div style={{ ...mockPhoneBody, flex: 1 }}>본문 영역</div>
      <Footer.TabBar
        activeTab="home"
        onTabClick={() => {}}
        style={
          {
            position: "static",
            width: "100%",
            "--nds-footer-height": "52px",
          } as React.CSSProperties
        }
        tabs={[
          {
            key: "home",
            label: "홈",
            href: "#",
            icon: <HomeIcon size={18} />,
            activeIcon: <HomeActiveIcon size={18} />,
          },
          {
            key: "search",
            label: "탐색",
            href: "#",
            icon: <SearchIcon size={18} />,
            activeIcon: <SearchIcon size={18} />,
          },
          {
            key: "my",
            label: "마이",
            href: "#",
            icon: <MypageIcon size={18} />,
            activeIcon: <MypageIcon size={18} />,
          },
        ]}
      />
    </div>
  ),
  HeaderWeb: () => (
    <div style={mockDesktopShell}>
      <div style={mockDesktopScaler}>
        <Header variant="web" position="static" maxWidth={480}>
          <Header.Logo alt="Brand" src="https://placehold.co/72x20/2B96ED/FFFFFF?text=Brand" />
          <Header.Menu>
            <Header.MenuItem href="#" active>
              홈
            </Header.MenuItem>
            <Header.MenuItem href="#">콘텐츠</Header.MenuItem>
            <Header.MenuItem href="#">상담</Header.MenuItem>
          </Header.Menu>
        </Header>
        <div style={mockDesktopBody}>본문 영역</div>
      </div>
    </div>
  ),
  Accordion: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>이용 약관</AccordionTrigger>
          <AccordionContent>약관 본문이 여기에 표시됩니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>개인정보 처리방침</AccordionTrigger>
          <AccordionContent>약관 본문이 여기에 표시됩니다.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  List: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <List variant="divided">
        <ListItem
          title="알림 설정"
          description="푸시 · 이메일"
          trailing={<ChevronRightIcon size={16} color="var(--semantic-icon-normal-default)" />}
          onSelect={() => {}}
        />
        <ListItem
          title="결제 수단"
          trailing={<ChevronRightIcon size={16} color="var(--semantic-icon-normal-default)" />}
          onSelect={() => {}}
        />
        <ListItem
          title="로그아웃"
          trailing={<ChevronRightIcon size={16} color="var(--semantic-icon-normal-default)" />}
        />
      </List>
    </div>
  ),
  Stepper: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Stepper
        current={1}
        steps={[
          { key: "1", label: "약관" },
          { key: "2", label: "정보" },
          { key: "3", label: "완료" },
        ]}
      />
    </div>
  ),

  StepProgress: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <StepProgress
        current={1}
        steps={[
          { key: "1", label: "Step 1", title: "캠페인" },
          { key: "2", label: "Step 2", title: "광고" },
          { key: "3", label: "Step 3", title: "소재" },
        ]}
      />
    </div>
  ),

  /* 도메인 */
  AssessmentResultCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <AssessmentResultCard
        title="PHQ-9 우울 검사"
        score={12}
        maxScore={27}
        level="mild"
        description="가벼운 우울 수준이에요."
      />
    </div>
  ),
  CrisisCallout: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <CrisisCallout
        tone="danger"
        title="지금 도움이 필요하다면"
        description="자살예방상담전화로 연결할 수 있어요."
        actions={[{ label: "1393", phoneNumber: "1393", withPhoneIcon: true }]}
      />
    </div>
  ),
  CounselorCard: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <CounselorCard
        name="김상담"
        jobTitle="임상심리전문가"
        rating={4.8}
        reviewCount={120}
        tags={["우울", "불안", "직장스트레스"]}
        bio="EAP 10년차. 직장인 스트레스 전문."
      />
    </div>
  ),
  ChatBubble: () => (
    <div style={{ width: "100%", maxWidth: 240, display: "flex", flexDirection: "column", gap: 6 }}>
      <ChatBubble role="them" name="상담사" time="3:24">
        오늘 컨디션 어떠세요?
      </ChatBubble>
      <ChatBubble role="me" time="3:25" read>
        괜찮은 편이에요.
      </ChatBubble>
    </div>
  ),
  ConsentChecklist: () => {
    function C() {
      const [v, setV] = useState<string[]>(["service"]);
      return (
        <div style={{ width: "100%", maxWidth: 240 }}>
          <ConsentChecklist
            value={v}
            onValueChange={setV}
            items={[
              { key: "service", label: "서비스 이용 약관", required: true },
              { key: "privacy", label: "개인정보 수집·이용", required: true },
              { key: "marketing", label: "마케팅 정보 수신 (선택)" },
            ]}
          />
        </div>
      );
    }
    return <C />;
  },
  ScoreGauge: () => (
    <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
      <ScoreGauge value={42} max={100} showLabel />
    </div>
  ),
  MedicationItem: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <MedicationItem
        name="라믹탈"
        dosage="25mg · 1정"
        times={["morning", "bedtime"]}
        note="식후 30분"
      />
    </div>
  ),
  AudioPlayer: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <AudioPlayer
        title="마음을 편안하게"
        subtitle="10분 가이드"
        playing={false}
        onPlayPause={() => {}}
        currentTime={72}
        duration={600}
      />
    </div>
  ),
  ActivityTimeline: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <ActivityTimeline
        items={[
          { key: "1", date: "5/12", title: "1차 상담", status: "completed", statusLabel: "완료" },
          { key: "2", date: "5/19", title: "2차 상담", status: "ongoing", statusLabel: "진행" },
          { key: "3", date: "5/26", title: "3차 상담", status: "default" },
        ]}
      />
    </div>
  ),
  AttachmentItem: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <AttachmentItem name="진단서_2026.pdf" size={234567} status="done" onDownload={() => {}} />
    </div>
  ),
  MediaThumbnail: () => (
    <div style={{ width: 140 }}>
      <MediaThumbnail
        src="https://placehold.co/140x90"
        alt="썸네일"
        aspectRatio="16/9"
        rounded="md"
      />
    </div>
  ),
  MediaCard: () => (
    <div style={{ width: 200 }}>
      <MediaCard
        image={<img src="https://placehold.co/200x150" alt="" />}
        imageOverlay="999+"
        eyebrow="카테고리"
        title="미디어 카드 제목"
        body="이미지 위, 메타 아래 세로형 카드. 콘텐츠/리뷰/상담사 카드 등에 재사용."
        rating={4.5}
      />
    </div>
  ),
  ContentViewer: () => (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <ContentViewer html='<h3 style="margin:0 0 6px;font-size:13px">결과 해설</h3><p style="margin:0;font-size:12px;color:#555">가벼운 우울 수준이며, 충분한 휴식이 필요합니다.</p>' />
    </div>
  ),
  DataTable: () => {
    type Row = { id: string; name: string; status: string };
    const columns: DataTableColumn<Row>[] = [
      { key: "name", title: "이름", render: (r) => r.name },
      { key: "status", title: "상태", render: (r) => r.status, align: "right" },
    ];
    const data: Row[] = [
      { id: "1", name: "홍길동", status: "완료" },
      { id: "2", name: "김상담", status: "예약" },
      { id: "3", name: "이지원", status: "취소" },
    ];
    return (
      <div style={{ width: "100%", maxWidth: 240 }}>
        <DataTable
          columns={columns}
          data={data}
          rowKey={(r) => r.id}
          size="sm"
          responsive="scroll"
        />
      </div>
    );
  },
  TrendingKeywords: () => (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <TrendingKeywords
        title="인기 검색어"
        timestamp="09:00 기준"
        items={[
          { rank: 1, trend: "up", keyword: "직장 스트레스" },
          { rank: 2, trend: "same", keyword: "불안" },
          { rank: 3, trend: "new", keyword: "수면" },
        ]}
      />
    </div>
  ),
  PopularPosts: () => (
    <div style={{ width: 353 }}>
      <PopularPosts
        tabs={[
          { key: "realtime", label: "실시간" },
          { key: "weekly", label: "주간" },
          { key: "monthly", label: "월간" },
          { key: "comments", label: "댓글순" },
          { key: "likes", label: "추천순" },
        ]}
        activeTabKey="realtime"
        onMoreClick={() => {}}
        items={[
          { id: 1, title: "아침대용으로 간단한 오트밀라떼", count: 1024 },
          { id: 2, title: "근육 이완이나 자극에 폼롤러 추천합니다", count: 2 },
          { id: 3, title: "체중이 저절로 감량되는 핸드 메이드 요거…", count: 23 },
          { id: 4, title: "아침식사 에그토마토", count: 342 },
          { id: 5, title: "만보 걷기 하고 들어가는 길 비오네요", count: 23 },
        ]}
      />
    </div>
  ),
  FloatingCtaBanner: () => (
    <div style={{ padding: "12px 0" }}>
      <FloatingCtaBanner
        caption="찾는 음식이 없으신가요?"
        ctaText="음식 직접 등록하러 가기"
        size="mobile"
        floating={false}
        leadingIcon={
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <ellipse cx="16" cy="22" rx="14" ry="4" fill="#FFD58A" />
            <circle cx="10" cy="18" r="4" fill="#7BC96F" />
            <circle cx="16" cy="16" r="5" fill="#F76A6A" />
            <circle cx="22" cy="19" r="4" fill="#5BB0F7" />
          </svg>
        }
      />
    </div>
  ),
  ImageUpload: () => <ImageUpload state="empty" />,
  ActionChip: () => (
    <div style={{ display: "inline-flex", gap: 8 }}>
      <ActionChip label="예시 이미지" />
      <ActionChip label="수정" />
      <ActionChip label="다운로드" />
    </div>
  ),
  SelectedItemsPanel: () => (
    <div style={{ width: 360 }}>
      <SelectedItemsPanel title="선택한 지역" count={2} onAdd={() => {}} onClear={() => {}}>
        <RegionRow onRemove={() => {}}>강원특별자치도 &gt; 강릉시</RegionRow>
        <RegionRow onRemove={() => {}}>서울특별시 &gt; 강남구</RegionRow>
      </SelectedItemsPanel>
    </div>
  ),
};

const previewRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--semantic-gap-default)",
};

/* ──────────────────────────────────────────
   Overlay 정적 미리보기용 스타일
   (Modal·Popup·BottomSheet·Toast 등 포털 컴포넌트의 시각적 형태만 흉내)
   ────────────────────────────────────────── */

/* Modal — 헤더(타이틀 + ×) + 본문 + 분할 푸터 (Modal.tsx 토큰 정합) */
const mockModalSurface: React.CSSProperties = {
  width: 244,
  background: cv.surface.default,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.lg,
  padding: "18px 18px 14px",
  boxShadow: shadow["3"],
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-default)",
};

const mockModalHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const mockModalHeaderSpacer: React.CSSProperties = {
  width: 20,
  height: 20,
};

const mockModalHeaderTitle: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  fontSize: 14,
  fontWeight: 700,
  color: cv.textRole.normal,
};

const mockModalClose: React.CSSProperties = {
  width: 20,
  height: 20,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: cv.textRole.muted,
  fontSize: 14,
};

const mockModalBody: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.55,
  color: cv.textRole.normal,
  textAlign: "center",
  padding: "4px 4px var(--semantic-inset-chip)",
};

const mockModalFooter: React.CSSProperties = {
  display: "flex",
  gap: "var(--semantic-gap-default)",
};

const mockModalCancelBtn: React.CSSProperties = {
  flex: 1,
  padding: "9px 0",
  borderRadius: radius.md,
  border: `1px solid ${cv.borderRole.normal}`,
  background: cv.surface.default,
  color: cv.textRole.normal,
  fontSize: 12,
  fontWeight: 500,
  textAlign: "center",
};

const mockModalConfirmBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: radius.md,
  background: cv.surface.brand,
  color: cv.textRole.inverse,
  fontSize: 12,
  fontWeight: 700,
  textAlign: "center",
};

/* Popup — alert 톤. 닫기 없음, 컴팩트, disabled-gray cancel + primary confirm (Popup.tsx 토큰 정합) */
const mockPopupSurface: React.CSSProperties = {
  width: 224,
  background: cv.surface.default,
  borderRadius: radius.md,
  padding: "var(--semantic-inset-card-large) var(--semantic-inset-card-large) 14px",
  boxShadow: shadow["3"],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const mockPopupTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: cv.textRole.normal,
  textAlign: "center",
};

const mockPopupDesc: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.55,
  color: cv.textRole.subtle,
  textAlign: "center",
  marginBottom: 8,
};

const mockPopupActions: React.CSSProperties = {
  display: "flex",
  gap: "var(--semantic-gap-default)",
  width: "100%",
};

const mockPopupCancelBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: radius.md,
  background: cv.textRole.muted,
  color: cv.surface.default,
  fontSize: 12,
  fontWeight: 700,
  textAlign: "center",
};

const mockPopupConfirmBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: radius.md,
  background: cv.surface.brand,
  color: cv.textRole.inverse,
  fontSize: 12,
  fontWeight: 700,
  textAlign: "center",
};

const mockTooltipWrap: React.CSSProperties = {
  position: "relative",
  paddingTop: 32,
};

const mockTooltipBubble: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  padding: "6px 10px",
  background: cv.textRole.normal,
  color: cv.textRole.inverse,
  borderRadius: radius.sm,
  fontSize: 11,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const mockTooltipArrow: React.CSSProperties = {
  position: "absolute",
  bottom: -4,
  left: "50%",
  transform: "translateX(-50%) rotate(45deg)",
  width: 8,
  height: 8,
  background: cv.textRole.normal,
};

/* BottomSheet / ShareSheet / Toast — 화면 안 dim + 하단 시트 */
const mockOverlayStage: React.CSSProperties = {
  position: "relative",
  width: 220,
  height: 160,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.lg,
  background: cv.surface.page,
  overflow: "hidden",
};

const mockStageBody: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 500,
  color: cv.textRole.muted,
};

const mockStageScrim: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(17,17,17,0.32)",
};

const mockBottomSheetPanel: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  background: cv.surface.default,
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
  padding: "var(--semantic-inset-chip) 14px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const mockShareSheetPanel: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  background: cv.surface.default,
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
  padding: "var(--semantic-inset-chip) var(--semantic-inset-input) var(--semantic-inset-input)",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const mockShareSheetRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  gap: "var(--semantic-gap-default)",
};

const mockToastFloating: React.CSSProperties = {
  position: "absolute",
  bottom: 18,
  left: "50%",
  transform: "translateX(-50%)",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px var(--semantic-inset-input)",
  background: cv.textRole.normal,
  color: cv.textRole.inverse,
  borderRadius: radius.pill,
  fontSize: 11,
  fontWeight: 600,
  boxShadow: shadow["2"],
};

const mockGrabber: React.CSSProperties = {
  width: 32,
  height: 4,
  borderRadius: radius.pill,
  background: cv.borderRole.normal,
  alignSelf: "center",
  marginBottom: 4,
};

const mockSheetTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: cv.textRole.normal,
};

const mockSheetBody: React.CSSProperties = {
  fontSize: 11,
  lineHeight: 1.55,
  color: cv.textRole.subtle,
};

const mockToastIcon: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
  borderRadius: radius.pill,
  background: cv.iconRole.statusSuccess,
  color: cv.textRole.inverse,
  fontSize: 10,
  fontWeight: 800,
};

/* Lightbox — 풀스크린 dark stage + 가운데 이미지 + 닫기/네비/카운터 */
const mockLightboxStage: React.CSSProperties = {
  position: "relative",
  width: 220,
  height: 140,
  borderRadius: radius.md,
  background: "#111111",
  overflow: "hidden",
};

const mockLightboxCloseBtn: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 22,
  height: 22,
  borderRadius: radius.pill,
  background: "rgba(255,255,255,0.18)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const mockLightboxNavLeft: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 6,
  transform: "translateY(-50%)",
  width: 22,
  height: 22,
  borderRadius: radius.pill,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: 16,
  lineHeight: "20px",
  textAlign: "center",
  fontWeight: 700,
};

const mockLightboxNavRight: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  right: 6,
  transform: "translateY(-50%)",
  width: 22,
  height: 22,
  borderRadius: radius.pill,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: 16,
  lineHeight: "20px",
  textAlign: "center",
  fontWeight: 700,
};

const mockLightboxImageNew: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 130,
  height: 80,
  borderRadius: radius.sm,
  background: cv.surface.section,
};

const mockLightboxCounter: React.CSSProperties = {
  position: "absolute",
  bottom: 8,
  left: "50%",
  transform: "translateX(-50%)",
  padding: "3px 10px",
  borderRadius: radius.pill,
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: 10,
  fontWeight: 600,
};

const mockShareItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const mockShareIcon: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: radius.pill,
  background: cv.surface.page,
  color: cv.textRole.normal,
};

const mockShareLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: cv.textRole.subtle,
};

const mockCoachWrap: React.CSSProperties = {
  position: "relative",
  paddingTop: 76,
};

const mockCoachCard: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: 200,
  padding: "10px var(--semantic-inset-input)",
  background: cv.textRole.normal,
  color: cv.textRole.inverse,
  borderRadius: radius.lg,
  boxShadow: shadow["2"],
};

const mockCoachArrow: React.CSSProperties = {
  position: "absolute",
  bottom: -5,
  left: "50%",
  transform: "translateX(-50%) rotate(45deg)",
  width: 10,
  height: 10,
  background: cv.textRole.normal,
};

const mockCoachTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 2,
};

const mockCoachDesc: React.CSSProperties = {
  fontSize: 11,
  color: cv.textRole.muted,
  lineHeight: 1.5,
};

/* Drawer / DropdownMenu / DSHighlight 정적 미리보기 — 인터랙션 의존이라 모형 사용 */

/* Drawer — 화면 프레임 + dim 스크림 + 우측 슬라이드 패널 */
const mockDrawerStage: React.CSSProperties = {
  position: "relative",
  width: 220,
  height: 130,
  background: cv.surface.page,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.md,
  overflow: "hidden",
};

const mockDrawerPageHint: React.CSSProperties = {
  position: "absolute",
  top: 10,
  left: 12,
  fontSize: 11,
  fontWeight: 600,
  color: cv.textRole.muted,
};

const mockDrawerScrim: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(17,17,17,0.32)",
};

const mockDrawerPanel: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  width: 132,
  background: cv.surface.default,
  boxShadow: shadow["3"],
  display: "flex",
  flexDirection: "column",
};

const mockDrawerHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "var(--semantic-inset-chip) 10px",
  borderBottom: `1px solid ${cv.borderRole.subtle}`,
};

const mockDrawerTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: cv.textRole.normal,
};

const mockDrawerClose: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 16,
  height: 16,
};

const mockDrawerBody: React.CSSProperties = {
  padding: "var(--semantic-inset-chip) 10px",
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-tight)",
};

const mockDrawerRow: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: cv.textRole.subtle,
  padding: "4px 6px",
  borderRadius: radius.sm,
  background: cv.surface.page,
};

const mockDropdownWrap: React.CSSProperties = {
  position: "relative",
  paddingTop: 8,
  paddingRight: 132,
  paddingBottom: 88,
};

const mockDropdownTrigger: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: 32,
  height: 32,
  borderRadius: radius.pill,
  background: cv.surface.page,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mockDropdownPanel: React.CSSProperties = {
  position: "absolute",
  top: 40,
  left: "50%",
  transform: "translateX(-50%)",
  width: 140,
  background: cv.surface.default,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.md,
  boxShadow: shadow["2"],
  padding: "6px 0",
  display: "flex",
  flexDirection: "column",
};

const mockDropdownItem: React.CSSProperties = {
  padding: "6px 14px",
  fontSize: 12,
  fontWeight: 500,
  color: cv.textRole.normal,
};

const mockDropdownDivider: React.CSSProperties = {
  height: 1,
  background: cv.borderRole.subtle,
  margin: "4px 0",
};

const dsHighlightFrame: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-default)",
  padding: "10px 14px",
  border: `1px dashed ${cv.borderRole.brand}`,
  borderRadius: radius.md,
  background: "rgba(43,150,237,0.06)",
};

const dsHighlightLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: cv.textRole.subtle,
};

const dsHighlightMode: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "3px var(--semantic-inset-chip)",
  borderRadius: radius.pill,
  background: cv.surface.default,
  border: `1px solid ${cv.borderRole.normal}`,
  color: cv.textRole.subtle,
};

const dsHighlightModeActive: React.CSSProperties = {
  ...dsHighlightMode,
  background: cv.surface.brand,
  borderColor: cv.borderRole.brand,
  color: cv.textRole.inverse,
};

/* Header / Footer — 화면 프레임 안에 배치해야 비례가 맞다 */
const mockPhoneShell: React.CSSProperties = {
  width: 220,
  height: 160,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.lg,
  background: cv.surface.page,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const mockPhoneBody: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 11,
  fontWeight: 500,
  color: cv.textRole.muted,
};

const mockDesktopShell: React.CSSProperties = {
  width: 250,
  height: 130,
  border: `1px solid ${cv.borderRole.subtle}`,
  borderRadius: radius.md,
  background: cv.surface.page,
  overflow: "hidden",
};

const mockDesktopScaler: React.CSSProperties = {
  width: 500,
  transform: "scale(0.5)",
  transformOrigin: "top left",
};

const mockDesktopBody: React.CSSProperties = {
  padding: "var(--semantic-inset-card) var(--semantic-inset-modal)",
  fontSize: 18,
  fontWeight: 500,
  color: cv.textRole.muted,
};

/* ──────────────────────────────────────────
   Meta + Story
   ────────────────────────────────────────── */

type InventoryEntry = (typeof inventory)[number] & {
  figmaSynced?: boolean;
  figmaSyncedAt?: string;
};

const CATEGORIES = ["전체", ...Array.from(new Set(inventory.map((e) => e.category)))];

const meta: Meta = {
  title: "Foundations/All Components",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `**한 페이지로 보는 전체 컴포넌트 카탈로그**`,
          ``,
          `총 **${inventory.length}개** 컴포넌트. 카테고리 필터와 이름 검색으로 빠르게 찾으세요.`,
          `핵심 컴포넌트는 라이브 미니 프리뷰가 보이고, 나머지는 이름·카테고리·설명·문서 링크만 표시됩니다.`,
        ].join("\n"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function toStoryId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ComponentCard({ entry }: { entry: InventoryEntry }) {
  const render = PREVIEWS[entry.name];
  const storybookHref = useMemo(() => {
    const storyId = toStoryId(entry.storybookTitle);
    const suffix = `/?path=/docs/${storyId}--docs`;
    if (typeof window === "undefined") return suffix;
    try {
      const top = window.top ?? window;
      const prefix = top.location.pathname.startsWith("/storybook") ? "/storybook" : "";
      return `${prefix}${suffix}`;
    } catch {
      return suffix;
    }
  }, [entry.storybookTitle]);
  const guide = GUIDES[entry.name];
  const figmaHref = guide?.figmaNodeUrl ?? entry.figmaUrl;
  const [guideOpen, setGuideOpen] = useState(false);
  const hasGuideBody = Boolean(
    guide &&
    (guide.summary ||
      guide.usagePolicy?.useFor?.length ||
      guide.usagePolicy?.doNotUseFor?.length ||
      guide.pitfalls?.length ||
      guide.recommended?.length),
  );

  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={cardName}>{entry.name}</span>
        <div style={cardTags}>
          <span style={categoryTag}>{entry.category}</span>
          {entry.figmaSynced && <span style={syncedTag}>가이드</span>}
        </div>
      </div>

      <div style={cardPreview}>
        {render ? (
          <ErrorBoundary fallback={<span style={previewPlaceholder}>{entry.name} preview</span>}>
            {render()}
          </ErrorBoundary>
        ) : (
          <span style={previewPlaceholder}>{entry.name}</span>
        )}
      </div>

      <p style={cardDesc}>{entry.description}</p>

      <dl style={cardMeta}>
        {entry.usageSummary && (
          <div style={cardMetaRow}>
            <dt style={cardMetaLabel}>활용</dt>
            <dd style={cardMetaValue} title={entry.usageSummary}>
              {entry.usageSummary}
            </dd>
          </div>
        )}
        {entry.notes && (
          <div style={cardMetaRow}>
            <dt style={cardMetaLabel}>메모</dt>
            <dd style={cardMetaValue} title={entry.notes}>
              {entry.notes}
            </dd>
          </div>
        )}
      </dl>

      {hasGuideBody && (
        <div style={guideBlock}>
          <button
            type="button"
            onClick={() => setGuideOpen((v) => !v)}
            style={guideToggle}
            aria-expanded={guideOpen}
          >
            <span>사용 가이드</span>
            <span style={guideToggleChevron} data-open={guideOpen}>
              ▾
            </span>
          </button>
          {guideOpen && (
            <div style={guideBody}>
              {guide?.summary && <p style={guideSummary}>{guide.summary}</p>}
              {guide?.usagePolicy?.useFor && guide.usagePolicy.useFor.length > 0 && (
                <GuideList tone="do" title="이럴 때 써요" items={guide.usagePolicy.useFor} />
              )}
              {guide?.usagePolicy?.doNotUseFor && guide.usagePolicy.doNotUseFor.length > 0 && (
                <GuideList
                  tone="dont"
                  title="이럴 땐 피해요"
                  items={guide.usagePolicy.doNotUseFor}
                />
              )}
              {guide?.pitfalls && guide.pitfalls.length > 0 && (
                <GuideList tone="warn" title="주의" items={guide.pitfalls.slice(0, 3)} />
              )}
              {guide?.recommended && guide.recommended.length > 0 && (
                <GuideList tone="info" title="권장" items={guide.recommended.slice(0, 4)} />
              )}
            </div>
          )}
        </div>
      )}

      <div style={cardFoot}>
        {figmaHref && (
          <a href={figmaHref} target="_blank" rel="noopener noreferrer" style={footLink}>
            Figma 가이드 →
          </a>
        )}
        <a href={storybookHref} target="_top" style={footLink}>
          Storybook →
        </a>
      </div>
    </div>
  );
}

type GuideTone = "do" | "dont" | "warn" | "info";

function GuideList({ tone, title, items }: { tone: GuideTone; title: string; items: string[] }) {
  return (
    <div style={guideListBlock}>
      <p style={{ ...guideListTitle, color: TONE_COLOR[tone] }}>
        {TONE_ICON[tone]} {title}
      </p>
      <ul style={guideListUl}>
        {items.map((item, i) => (
          <li key={i} style={guideListLi}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const TONE_ICON: Record<GuideTone, string> = {
  do: "✓",
  dont: "✕",
  warn: "⚠",
  info: "•",
};

const TONE_COLOR: Record<GuideTone, string> = {
  do: "#00A07C",
  dont: "#D04A3F",
  warn: "#C77700",
  info: "#017EE4",
};

/* React 18에서 error boundary는 클래스만 가능. 인라인으로 정의. */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [syncedOnly, setSyncedOnly] = useState(false);

  const syncedCount = useMemo(
    () => inventory.filter((e) => (e as InventoryEntry).figmaSynced).length,
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((entry) => {
      const matchesCategory = category === "전체" || entry.category === category;
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.usageSummary ?? "").toLowerCase().includes(q);
      const matchesSynced = !syncedOnly || Boolean((entry as InventoryEntry).figmaSynced);
      return matchesCategory && matchesQuery && matchesSynced;
    });
  }, [query, category, syncedOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, InventoryEntry[]>();
    for (const e of filtered) {
      const list = map.get(e.category) ?? [];
      list.push(e as InventoryEntry);
      map.set(e.category, list);
    }
    return map;
  }, [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={controlsRow}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름·설명·활용으로 검색"
          style={searchInput}
        />
        <div style={categoryRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              style={{
                ...categoryChip,
                ...(cat === category ? categoryChipActive : null),
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <label style={syncedToggle}>
          <input
            type="checkbox"
            checked={syncedOnly}
            onChange={(e) => setSyncedOnly(e.target.checked)}
            style={syncedToggleInput}
          />
          <span>Figma 가이드</span>
          <span style={syncedToggleCount}>{syncedCount}</span>
        </label>
        <span style={countLabel}>
          {filtered.length} / {inventory.length}
        </span>
      </div>

      {Array.from(grouped.entries()).map(([cat, entries]) => (
        <div key={cat}>
          <p style={categoryHeader}>
            {cat} <span style={categoryHeaderCount}>{entries.length}</span>
          </p>
          <div style={grid}>
            {entries.map((entry) => (
              <ComponentCard key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>검색 결과가 없어요.</p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Styles
   ────────────────────────────────────────── */

const controlsRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--semantic-gap-comfortable)",
  padding: "var(--semantic-inset-input) var(--semantic-inset-card)",
  background: "#FAFAFA",
  border: "1px solid #ECECEC",
  borderRadius: 10,
  position: "sticky",
  top: 0,
  zIndex: 5,
};

const searchInput: React.CSSProperties = {
  flex: "1 1 240px",
  height: 36,
  padding: "0 var(--semantic-inset-input)",
  border: "1px solid #D8D8D8",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

const categoryRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const categoryChip: React.CSSProperties = {
  padding: "5px var(--semantic-inset-input)",
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 600,
  color: "#555",
  cursor: "pointer",
  fontFamily: "inherit",
};

const categoryChipActive: React.CSSProperties = {
  background: "#111111",
  borderColor: "#111111",
  color: "#FFFFFF",
};

const syncedToggle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px var(--semantic-inset-input)",
  background: "#FFFFFF",
  border: "1px solid #D8D8D8",
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  cursor: "pointer",
  userSelect: "none",
};

const syncedToggleInput: React.CSSProperties = {
  margin: 0,
  width: 14,
  height: 14,
  cursor: "pointer",
  accentColor: "#00A07C",
};

const syncedToggleCount: React.CSSProperties = {
  padding: "1px 7px",
  borderRadius: 10,
  background: "rgba(0,160,124,0.12)",
  color: "#00A07C",
  fontSize: 11,
  fontWeight: 700,
};

const countLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
  marginLeft: "auto",
};

const categoryHeader: React.CSSProperties = {
  margin: "8px 0 12px",
  fontSize: 13,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.01em",
  display: "flex",
  alignItems: "baseline",
  gap: "var(--semantic-gap-default)",
};

const categoryHeaderCount: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "var(--semantic-gap-loose)",
};

const card: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ECECEC",
  borderRadius: 12,
  overflow: "hidden",
  background: "#FFFFFF",
};

const cardHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 18px",
  gap: "var(--semantic-gap-default)",
  borderBottom: "1px solid #F2F2F2",
};

const cardName: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.01em",
};

const cardTags: React.CSSProperties = {
  display: "flex",
  gap: "var(--semantic-gap-tight)",
  flexWrap: "wrap",
};

const categoryTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#666",
  background: "#F4F4F4",
  padding: "3px var(--semantic-inset-chip)",
  borderRadius: 5,
};

const syncedTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#00A07C",
  background: "rgba(0,160,124,0.1)",
  padding: "3px var(--semantic-inset-chip)",
  borderRadius: 5,
};

/* 미리보기 영역은 카드 크기와 무관하게 컴포넌트 실제 크기 유지.
 * 영역만 넓혀서 여백을 두고, 안의 UI는 자연 크기로 중앙 정렬. */
const cardPreview: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 180,
  padding: "var(--semantic-inset-modal)",
  background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(43,150,237,0.03), transparent 80%)",
  overflow: "hidden",
};

const previewPlaceholder: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px var(--semantic-inset-card)",
  background: "#F4F4F4",
  border: "1px dashed #D8D8D8",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  color: "#888",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
};

const cardDesc: React.CSSProperties = {
  margin: 0,
  padding: "14px 18px 6px",
  fontSize: 13,
  color: "#444",
  lineHeight: 1.55,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const cardMeta: React.CSSProperties = {
  margin: 0,
  padding: "var(--semantic-inset-chip) 18px 4px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const cardMetaRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "44px 1fr",
  gap: "var(--semantic-gap-default)",
  alignItems: "baseline",
};

const cardMetaLabel: React.CSSProperties = {
  margin: 0,
  fontSize: 10.5,
  fontWeight: 700,
  color: "#94a3b8",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const cardMetaValue: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "#475569",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const cardFoot: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "var(--semantic-gap-default)",
  padding: "10px 18px 14px",
  borderTop: "1px solid #F2F2F2",
  marginTop: 8,
};

const footLink: React.CSSProperties = {
  fontSize: 12,
  color: "#017EE4",
  textDecoration: "none",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const guideBlock: React.CSSProperties = {
  padding: "var(--semantic-inset-chip) 18px 0",
  borderTop: "1px solid #F2F2F2",
  marginTop: 8,
};

const guideToggle: React.CSSProperties = {
  all: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "var(--semantic-inset-chip) 0",
  fontSize: 12,
  fontWeight: 700,
  color: "#333",
  cursor: "pointer",
  fontFamily: "inherit",
};

const guideToggleChevron: React.CSSProperties = {
  fontSize: 11,
  color: "#888",
  transition: "transform 0.15s ease",
};

const guideBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-default)",
  padding: "4px 0 var(--semantic-inset-input)",
};

const guideSummary: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.55,
  color: "#475569",
  background: "#F8FAFC",
  padding: "var(--semantic-inset-chip) 10px",
  borderRadius: 6,
  border: "1px solid #E2E8F0",
};

const guideListBlock: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--semantic-gap-tight)",
};

const guideListTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const guideListUl: React.CSSProperties = {
  margin: 0,
  padding: "0 0 0 14px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const guideListLi: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: "#475569",
};

/* ──────────────────────────────────────────
   Story
   ────────────────────────────────────────── */

export const Catalog_All: Story = {
  name: "All / Search · Filter",
  render: () => <Catalog />,
};
