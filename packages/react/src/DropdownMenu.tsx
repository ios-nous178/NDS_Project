import React, { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";

import { addDismissableLayerListeners, WebPortal } from "./internal/web";

/* ─── Class names ─── */

const DM_CLASS = "nds-dropdown-menu";
const DM_PANEL_CLASS = `${DM_CLASS}__panel`;
const DM_GROUP_CLASS = `${DM_CLASS}__group`;
const DM_GROUP_LABEL_CLASS = `${DM_CLASS}__group-label`;
const DM_DIVIDER_CLASS = `${DM_CLASS}__divider`;
const DM_ITEM_CLASS = `${DM_CLASS}__item`;
const DM_ITEM_LABEL_CLASS = `${DM_CLASS}__item-label`;
const DM_ITEM_LEADING_CLASS = `${DM_CLASS}__item-leading`;
const DM_ITEM_TRAILING_CLASS = `${DM_CLASS}__item-trailing`;

/* ─── Types ─── */

export type DropdownAlign = "start" | "end";

export interface DropdownMenuItem {
  /** 아이템 키 */
  key: string;
  /** 라벨 */
  label: React.ReactNode;
  /** 클릭 콜백 (호출 후 메뉴 자동 닫힘) */
  onSelect?: () => void;
  /** 좌측 아이콘 */
  leading?: React.ReactNode;
  /** 우측 보조 (단축키, 칩 등) */
  trailing?: React.ReactNode;
  /** 비활성화 */
  disabled?: boolean;
  /** 위험 액션 (빨간색 텍스트 — 삭제 등) */
  danger?: boolean;
}

export interface DropdownMenuGroup {
  /** 그룹 키 */
  key: string;
  /** 그룹 라벨 (선택, 회색 헤더로 표시) */
  label?: React.ReactNode;
  /** 그룹 내 아이템 */
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  /** 트리거 요소 (forwardRef + onClick 지원해야 함). cloneElement로 ref와 onClick이 주입됨 */
  children: React.ReactElement;
  /** 단일 아이템 목록 (groups 또는 items 둘 중 하나 사용) */
  items?: DropdownMenuItem[];
  /** 그룹화된 아이템 (label로 섹션 구분) */
  groups?: DropdownMenuGroup[];
  /** 정렬 (트리거 기준) */
  align?: DropdownAlign;
  /** 패널 최소 너비 (px) */
  minWidth?: number;
  /** 포털 컨테이너 (미지정 시 document.body) */
  portalContainer?: HTMLElement | null;
  /** 패널 className */
  panelClassName?: string;
}
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const normalizeGroups = (
  items?: DropdownMenuItem[],
  groups?: DropdownMenuGroup[],
): DropdownMenuGroup[] => {
  if (groups && groups.length > 0) return groups;
  if (items && items.length > 0) return [{ key: "_default", items }];
  return [];
};

/* ─── Component ─── */

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  items,
  groups,
  align = "start",
  minWidth,
  portalContainer,
  panelClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const normalizedGroups = normalizeGroups(items, groups);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 4;
    const left = align === "end" ? rect.right : rect.left;
    setPosition({ top, left });

    return addDismissableLayerListeners({
      contentEl: panelRef.current,
      triggerEl: triggerRef.current,
      onDismiss: () => setOpen(false),
    });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!isValidElement(children)) {
    throw new Error("DropdownMenu requires a single valid React element as trigger");
  }

  type TriggerProps = {
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  };
  const childProps = (children as React.ReactElement<TriggerProps>).props;
  const trigger = cloneElement(
    children as React.ReactElement<TriggerProps>,
    {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        childProps.onClick?.(e);
        setOpen((prev) => !prev);
      },
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? menuId : undefined,
    } as TriggerProps & React.AriaAttributes,
  );

  return (
    <>
      <span
        ref={(node) => {
          triggerRef.current = node;
        }}
        style={{ display: "inline-flex" }}
      >
        {trigger}
      </span>
      {open && (
        <WebPortal container={portalContainer}>
          <div
            ref={panelRef}
            id={menuId}
            role="menu"
            data-slot="panel"
            data-align={align}
            className={cx(DM_PANEL_CLASS, panelClassName)}
            style={
              {
                top: position.top,
                ...(align === "end"
                  ? { left: "auto", right: window.innerWidth - position.left }
                  : { left: position.left }),
                ...(minWidth !== undefined && {
                  "--nds-dropdown-min-width": `${minWidth}px`,
                }),
              } as React.CSSProperties
            }
            tabIndex={-1}
          >
            {normalizedGroups.map((group) => (
              <div
                key={group.key}
                data-slot="group"
                role="group"
                aria-label={typeof group.label === "string" ? group.label : undefined}
                className={DM_GROUP_CLASS}
              >
                {group.label !== undefined && (
                  <div data-slot="group-label" className={DM_GROUP_LABEL_CLASS}>
                    {group.label}
                  </div>
                )}
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    data-slot="item"
                    data-danger={item.danger ? "true" : "false"}
                    data-disabled={item.disabled ? "true" : "false"}
                    disabled={item.disabled}
                    className={DM_ITEM_CLASS}
                    onClick={() => {
                      if (item.disabled) return;
                      item.onSelect?.();
                      setOpen(false);
                    }}
                  >
                    {item.leading !== undefined && (
                      <span data-slot="item-leading" className={DM_ITEM_LEADING_CLASS}>
                        {item.leading}
                      </span>
                    )}
                    <span data-slot="item-label" className={DM_ITEM_LABEL_CLASS}>
                      {item.label}
                    </span>
                    {item.trailing !== undefined && (
                      <span data-slot="item-trailing" className={DM_ITEM_TRAILING_CLASS}>
                        {item.trailing}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </WebPortal>
      )}
    </>
  );
};

DropdownMenu.displayName = "DropdownMenu";
