import React, { createContext, useCallback, useContext, useId, useState } from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const ACC_CLASS = "nds-accordion";
const ACC_ITEM_CLASS = `${ACC_CLASS}__item`;
const ACC_TRIGGER_CLASS = `${ACC_CLASS}__trigger`;
const ACC_CONTENT_CLASS = `${ACC_CLASS}__content`;
const ACC_CHEVRON_CLASS = `${ACC_CLASS}__chevron`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const accordionStyles = `
  :where(.${ACC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${ACC_ITEM_CLASS}) {
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    overflow: hidden;
    background: ${cv.bg.white};
  }

  :where(.${ACC_TRIGGER_CLASS}) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${spacing[16]}px ${spacing[20]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.text.default};
    transition: background ${transition.default};
  }

  :where(.${ACC_TRIGGER_CLASS}:hover) {
    background: ${cv.bg.light};
  }

  :where(.${ACC_TRIGGER_CLASS}[data-state="open"]) {
    background: ${cv.bg.coolGray};
  }

  :where(.${ACC_CHEVRON_CLASS}) {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${cv.icon.subtle};
    transition: transform ${transition.default};
  }

  :where(.${ACC_TRIGGER_CLASS}[data-state="open"]) .${ACC_CHEVRON_CLASS} {
    transform: rotate(180deg);
  }

  :where(.${ACC_CONTENT_CLASS}) {
    padding: 0 ${spacing[20]}px ${spacing[16]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.text.subtle};
    background: ${cv.bg.coolGray};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ChevronIcon = () => (
  <svg
    className={ACC_CHEVRON_CLASS}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 7.5L10 12.5L15 7.5" />
  </svg>
);

/* ─── Context ─── */

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordionContext = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item must be used within Accordion");
  return ctx;
};

/* ─── Accordion Root ─── */

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 단일 / 다중 열기 */
  type?: AccordionType;
  /** 열린 아이템 값 (제어 모드) */
  value?: string | string[];
  /** 기본 열린 아이템 */
  defaultValue?: string | string[];
  /** 값 변경 콜백 */
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

export const Accordion = Object.assign(
  React.forwardRef<HTMLDivElement, AccordionProps>(
    (
      {
        type = "single",
        value: valueProp,
        defaultValue,
        onValueChange,
        className,
        children,
        ...rest
      },
      ref,
    ) => {
      const toSet = (v: string | string[] | undefined): Set<string> => {
        if (v === undefined) return new Set();
        return new Set(Array.isArray(v) ? v : [v]);
      };

      const [internalOpen, setInternalOpen] = useState<Set<string>>(() => toSet(defaultValue));

      const isControlled = valueProp !== undefined;
      const openItems = isControlled ? toSet(valueProp) : internalOpen;

      const toggle = useCallback(
        (itemValue: string) => {
          const next = new Set(openItems);
          if (next.has(itemValue)) {
            next.delete(itemValue);
          } else {
            if (type === "single") {
              next.clear();
            }
            next.add(itemValue);
          }
          if (!isControlled) setInternalOpen(next);
          const arr = Array.from(next);
          onValueChange?.(type === "single" ? (arr[0] ?? "") : arr);
        },
        [openItems, type, isControlled, onValueChange],
      );

      return (
        <AccordionContext.Provider value={{ openItems, toggle }}>
          <div ref={ref} data-slot="root" className={cx(ACC_CLASS, className)} {...rest}>
            {children}
          </div>
        </AccordionContext.Provider>
      );
    },
  ),
  { displayName: "Accordion" } as { displayName: string },
);

/* ─── Accordion.Item ─── */

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

const useAccordionItemContext = () => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("Must be used within Accordion.Item");
  return ctx;
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 고유 값 */
  value: string;
  children: React.ReactNode;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...rest }, ref) => {
    const { openItems } = useAccordionContext();
    const isOpen = openItems.has(value);
    const baseId = useId();
    const triggerId = `${baseId}-trigger`;
    const contentId = `${baseId}-content`;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
        <div
          ref={ref}
          data-slot="item"
          data-state={isOpen ? "open" : "closed"}
          className={cx(ACC_ITEM_CLASS, className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

/* ─── Accordion.Trigger ─── */

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, ...rest }, ref) => {
    const { toggle } = useAccordionContext();
    const { value, isOpen, triggerId, contentId } = useAccordionItemContext();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        toggle(value);
        onClick?.(e);
      },
      [toggle, value, onClick],
    );

    return (
      <button
        ref={ref}
        data-slot="trigger"
        data-state={isOpen ? "open" : "closed"}
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cx(ACC_TRIGGER_CLASS, className)}
        onClick={handleClick}
        {...rest}
      >
        <span>{children}</span>
        <ChevronIcon />
      </button>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

/* ─── Accordion.Content ─── */

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...rest }, ref) => {
    const { isOpen, triggerId, contentId } = useAccordionItemContext();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        data-slot="content"
        data-state="open"
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={cx(ACC_CONTENT_CLASS, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
AccordionContent.displayName = "AccordionContent";

/* ─── Attach sub-components ─── */

type AccordionWithSubcomponents = typeof Accordion & {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};
(Accordion as AccordionWithSubcomponents).Item = AccordionItem;
(Accordion as AccordionWithSubcomponents).Trigger = AccordionTrigger;
(Accordion as AccordionWithSubcomponents).Content = AccordionContent;

export { AccordionItem, AccordionTrigger, AccordionContent };
