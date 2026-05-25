import React, { useId, useMemo, useRef, useState } from "react";

/* ─── Constants ─── */

const MI_CLASS = "nds-mention-input";
const MI_LABEL_CLASS = `${MI_CLASS}__label`;
const MI_FIELD_CLASS = `${MI_CLASS}__field`;
const MI_TEXTAREA_CLASS = `${MI_CLASS}__textarea`;
const MI_LIST_CLASS = `${MI_CLASS}__list`;
const MI_ITEM_CLASS = `${MI_CLASS}__item`;
const MI_HELPER_CLASS = `${MI_CLASS}__helper`;

/* ─── Types ─── */

export interface MentionUser {
  /** 고유 키 (id 등) */
  key: string;
  /** 표시 이름 (@<name>으로 입력됨) */
  name: string;
  /** 아바타/아이콘 (선택) */
  avatar?: React.ReactNode;
  /** 보조 설명 (직책, 역할 등) */
  description?: string;
}

export interface MentionInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "onSelect"
> {
  /** 입력값 */
  value: string;
  /** 변경 콜백 */
  onValueChange: (value: string) => void;
  /** 사용 가능한 사용자 목록 (외부에서 필터링하지 않은 전체 — 컴포넌트가 쿼리에 맞춰 필터) */
  users: MentionUser[];
  /** 멘션 선택 콜백 */
  onMention?: (user: MentionUser) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 자리표시자 */
  placeholder?: string;
  /** 헬퍼 / 에러 텍스트 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 트리거 문자 (기본 '@') */
  trigger?: string;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const MentionInput = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(
  (
    {
      value,
      onValueChange,
      users,
      onMention,
      label,
      placeholder,
      helperText,
      error = false,
      disabled = false,
      trigger = "@",
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();
    const taRef = useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => taRef.current as HTMLTextAreaElement);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const [mentionStart, setMentionStart] = useState(-1);

    const filtered = useMemo(() => {
      if (!query) return users;
      const q = query.toLowerCase();
      return users.filter((u) => u.name.toLowerCase().includes(q));
    }, [query, users]);

    const detectMention = (text: string, caret: number) => {
      // caret 직전까지에서 마지막 trigger 위치 찾기
      const before = text.slice(0, caret);
      const idx = before.lastIndexOf(trigger);
      if (idx === -1) {
        setOpen(false);
        return;
      }
      // trigger 앞이 공백 또는 시작이어야 함
      const prevChar = idx === 0 ? " " : before[idx - 1];
      if (prevChar && !/\s/.test(prevChar)) {
        setOpen(false);
        return;
      }
      const q = before.slice(idx + 1);
      // q에 공백이 들어가면 멘션 종료
      if (/\s/.test(q)) {
        setOpen(false);
        return;
      }
      setMentionStart(idx);
      setQuery(q);
      setOpen(true);
      setActiveIdx(0);
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      onValueChange(next);
      detectMention(next, e.target.selectionStart);
    };

    const insertMention = (user: MentionUser) => {
      if (mentionStart < 0) return;
      const before = value.slice(0, mentionStart);
      const after = value.slice(mentionStart + 1 + query.length);
      const next = `${before}${trigger}${user.name} ${after}`;
      onValueChange(next);
      onMention?.(user);
      setOpen(false);
      setQuery("");
      setMentionStart(-1);
    };

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (filtered[activeIdx]) {
          e.preventDefault();
          insertMention(filtered[activeIdx]);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    return (
      <div data-slot="root" className={cx(MI_CLASS, className)} {...rest}>
        {label && (
          <label htmlFor={inputId} className={MI_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div className={MI_FIELD_CLASS} data-error={error ? "true" : "false"}>
          <textarea
            ref={taRef}
            id={inputId}
            className={MI_TEXTAREA_CLASS}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleInput}
            onKeyDown={handleKey}
            onSelect={(e) =>
              detectMention(value, (e.currentTarget as HTMLTextAreaElement).selectionStart)
            }
          />
          {open && filtered.length > 0 && (
            <ul
              className={MI_LIST_CLASS}
              role="listbox"
              style={{ top: "100%", left: 8, marginTop: 4 }}
            >
              {filtered.slice(0, 6).map((u, i) => (
                <li
                  key={u.key}
                  className={MI_ITEM_CLASS}
                  data-active={i === activeIdx ? "true" : "false"}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(u);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  {u.avatar}
                  <div>
                    <strong>@{u.name}</strong>
                    {u.description && <span>{u.description}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {helperText && (
          <p className={MI_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

MentionInput.displayName = "MentionInput";
