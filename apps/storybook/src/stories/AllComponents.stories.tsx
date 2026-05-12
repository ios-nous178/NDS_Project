import React, { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AddressSearch,
  AmountInput,
  AppointmentCard,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Badge,
  Banner,
  BottomSheet,
  BreathingGuide,
  Button,
  Calendar,
  Card,
  CardVisual,
  Carousel,
  Checkbox,
  Chip,
  CircularProgress,
  CoachMark,
  CommentItem,
  Confetti,
  CountdownTimer,
  CouponCard,
  Divider,
  EmotionHeatmap,
  EmptyState,
  ExpandableText,
  FAB,
  FieldActionRow,
  FilterBar,
  GreetingHeader,
  IconButton,
  Input,
  JournalEntry,
  Lightbox,
  LikeButton,
  MentionInput,
  Modal,
  NotificationItem,
  NumberStepper,
  OnlineIndicator,
  OrderSummaryCard,
  PageHeader,
  Pagination,
  PhoneInput,
  PinPad,
  Popup,
  PriceTag,
  ProductCard,
  ProgressBar,
  QuickActionGrid,
  Radio,
  ReactionPicker,
  ReviewCard,
  SearchInput,
  Select,
  SelectionCard,
  ShareSheet,
  Skeleton,
  Slider,
  Snackbar,
  Sparkline,
  Spinner,
  StarRating,
  StatCard,
  StatusTimeline,
  StreakCard,
  Tabs,
  TagInput,
  TextButton,
  TimePicker,
  TipCard,
  Toast,
  Toggle,
  Tooltip,
  UserCard,
  VotePoll,
} from "@nudge-eap/react";
import { CalendarIcon, PlusIcon, SearchIcon, ShareIcon } from "@nudge-eap/icons";
import inventory from "../../../../metadata/componentInventory.json";

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
      <Badge variant="primary">신규</Badge>
      <Badge variant="success">완료</Badge>
      <Badge variant="error">필수</Badge>
    </div>
  ),
  Chip: () => (
    <div style={previewRow}>
      <Chip label="우울감" />
      <Chip label="수면" />
    </div>
  ),
  Avatar: () => (
    <div style={previewRow}>
      <Avatar name="홍길동" size="md" />
      <Avatar name="김상담" size="md" />
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
      <Toggle defaultChecked />
      <Toggle />
    </div>
  ),
  Checkbox: () => (
    <div style={previewRow}>
      <Checkbox defaultChecked label="동의" />
    </div>
  ),
  Radio: () => (
    <div style={previewRow}>
      <Radio name="demo" defaultChecked label="A" />
      <Radio name="demo" label="B" />
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
      const [k, setK] = useState("home");
      return (
        <div style={{ width: "100%", maxWidth: 220 }}>
          <Tabs
            activeKey={k}
            onTabChange={setK}
            items={[
              { key: "home", title: "홈" },
              { key: "list", title: "목록" },
            ]}
          />
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
  Modal: () => {
    function ModalTrigger() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" onClick={() => setOpen(true)}>
            Modal 열기
          </Button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="알림"
            confirmText="확인"
            onConfirm={(close) => close()}
          >
            모달 본문입니다.
          </Modal>
        </>
      );
    }
    return <ModalTrigger />;
  },
  Tooltip: () => (
    <Tooltip content="툴팁 내용" placement="top">
      <Button size="sm" variant="outlined">
        Hover
      </Button>
    </Tooltip>
  ),

  /* ─── Overlay (portal trigger) ─── */
  Popup: () => {
    function P() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" variant="outlined" onClick={() => setOpen(true)}>
            Popup 열기
          </Button>
          <Popup
            open={open}
            onClose={() => setOpen(false)}
            title="확인"
            description="정말 진행할까요?"
            confirmText="확인"
            onConfirm={() => setOpen(false)}
          />
        </>
      );
    }
    return <P />;
  },
  BottomSheet: () => {
    function B() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" variant="outlined" onClick={() => setOpen(true)}>
            Sheet 열기
          </Button>
          <BottomSheet open={open} onClose={() => setOpen(false)} title="필터">
            <p style={{ margin: 0, fontSize: 13 }}>옵션을 선택하세요.</p>
          </BottomSheet>
        </>
      );
    }
    return <B />;
  },
  Toast: () => {
    function ToastTrigger() {
      const { toast } = Toast.useToast();
      return (
        <Button size="sm" variant="outlined" onClick={() => toast("저장되었어요")}>
          Toast 띄우기
        </Button>
      );
    }
    return (
      <Toast.Provider>
        <ToastTrigger />
      </Toast.Provider>
    );
  },
  Lightbox: () => {
    function L() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" variant="outlined" onClick={() => setOpen(true)}>
            이미지 보기
          </Button>
          <Lightbox
            open={open}
            onClose={() => setOpen(false)}
            images={[{ src: "https://placehold.co/600x400" }]}
          />
        </>
      );
    }
    return <L />;
  },
  ShareSheet: () => {
    function S() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" variant="outlined" onClick={() => setOpen(true)}>
            공유 시트
          </Button>
          <ShareSheet
            open={open}
            onClose={() => setOpen(false)}
            targets={[
              {
                key: "copy",
                label: "복사",
                icon: <ShareIcon size={20} />,
                onClick: () => setOpen(false),
              },
              {
                key: "link",
                label: "링크",
                icon: <ShareIcon size={20} />,
                onClick: () => setOpen(false),
              },
            ]}
          />
        </>
      );
    }
    return <S />;
  },
  CoachMark: () => {
    function C() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button size="sm" variant="outlined" onClick={() => setOpen(true)} data-cm-target>
            도움말 보기
          </Button>
          <CoachMark
            open={open}
            onClose={() => setOpen(false)}
            steps={[
              {
                target: "[data-cm-target]",
                title: "여기를 눌러보세요",
                description: "이 버튼이 핵심 액션입니다.",
              },
            ]}
          />
        </>
      );
    }
    return <C />;
  },

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
    <div style={{ width: 160 }}>
      <ProductCard
        thumbnail="https://placehold.co/160x160"
        title="5회권 상담 패키지"
        price={<>29,000원</>}
      />
    </div>
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
      const [v, setV] = useState("14:00");
      return (
        <div style={{ width: "100%", maxWidth: 200 }}>
          <TimePicker value={v} onValueChange={setV} />
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
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
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
        padding: "16px 12px",
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
      <FAB icon={<PlusIcon size={20} />} label="추가" onClick={() => {}} />
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
    <div style={{ ...previewRow, gap: 16 }}>
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
        padding: "10px 12px",
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
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
    <div style={{ display: "flex", gap: 8 }}>
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
        🎤
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
        📹
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
        📞
      </span>
    </div>
  ),
};

const previewRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
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
  const storybookHref = `/?path=/docs/${toStoryId(entry.storybookTitle)}--docs`;
  return (
    <div style={card}>
      <div style={cardHead}>
        <span style={cardName}>{entry.name}</span>
        <div style={cardTags}>
          <span style={categoryTag}>{entry.category}</span>
          {entry.figmaSynced && <span style={syncedTag}>Synced</span>}
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

      <div style={cardFoot}>
        <span style={cardUsage} title={entry.usageSummary}>
          {entry.usageSummary}
        </span>
        <a href={storybookHref} style={footLink}>
          Storybook →
        </a>
      </div>
    </div>
  );
}

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((entry) => {
      const matchesCategory = category === "전체" || entry.category === category;
      const matchesQuery =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.usageSummary ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

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
  gap: 12,
  padding: "12px 16px",
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
  padding: "0 12px",
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
  padding: "5px 12px",
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
  gap: 8,
};

const categoryHeaderCount: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 16,
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
  gap: 8,
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
  gap: 4,
  flexWrap: "wrap",
};

const categoryTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#666",
  background: "#F4F4F4",
  padding: "3px 8px",
  borderRadius: 5,
};

const syncedTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#00A07C",
  background: "rgba(0,160,124,0.1)",
  padding: "3px 8px",
  borderRadius: 5,
};

/* 미리보기 영역은 카드 크기와 무관하게 컴포넌트 실제 크기 유지.
 * 영역만 넓혀서 여백을 두고, 안의 UI는 자연 크기로 중앙 정렬. */
const cardPreview: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 180,
  padding: 24,
  background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(43,150,237,0.03), transparent 80%)",
  overflow: "hidden",
};

const previewPlaceholder: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 16px",
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

const cardFoot: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "10px 18px 14px",
  borderTop: "1px solid #F2F2F2",
  marginTop: 6,
};

const cardUsage: React.CSSProperties = {
  flex: 1,
  fontSize: 11.5,
  color: "#888",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const footLink: React.CSSProperties = {
  fontSize: 12,
  color: "#017EE4",
  textDecoration: "none",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

/* ──────────────────────────────────────────
   Story
   ────────────────────────────────────────── */

export const Catalog_All: Story = {
  name: "All / Search · Filter",
  render: () => <Catalog />,
};
