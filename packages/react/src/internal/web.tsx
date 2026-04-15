import React from "react";
import { createPortal } from "react-dom";

export const canUseDOM =
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  typeof document.createElement !== "undefined";

export const resolvePortalContainer = (container?: HTMLElement | null) => {
  if (!canUseDOM) return null;
  return container ?? document.body;
};

export const WebPortal: React.FC<{
  children: React.ReactNode;
  container?: HTMLElement | null;
}> = ({ children, container }) => {
  const target = resolvePortalContainer(container);
  if (!target) return null;
  return createPortal(children, target);
};

export interface DismissableLayerOptions {
  contentEl: HTMLElement | null;
  triggerEl?: HTMLElement | null;
  onDismiss: () => void;
}

export const addDismissableLayerListeners = ({
  contentEl,
  triggerEl,
  onDismiss,
}: DismissableLayerOptions) => {
  if (!canUseDOM) return () => {};

  const handlePointerDown = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (triggerEl?.contains(target)) return;
    if (contentEl?.contains(target)) return;
    onDismiss();
  };

  const handleWindowScroll = (event: Event) => {
    const target = event.target as Node | null;
    if (target && contentEl?.contains(target)) return;
    onDismiss();
  };

  document.addEventListener("mousedown", handlePointerDown);
  window.addEventListener("scroll", handleWindowScroll, true);

  return () => {
    document.removeEventListener("mousedown", handlePointerDown);
    window.removeEventListener("scroll", handleWindowScroll, true);
  };
};
