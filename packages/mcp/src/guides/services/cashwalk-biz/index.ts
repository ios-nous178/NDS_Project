import type { ServiceOverlay } from "../types.js";
import { ButtonOverlay } from "./Button.js";
import { ModalOverlay } from "./Modal.js";
import { SidebarOverlay } from "./Sidebar.js";

export const cashwalkBizOverlays: Record<string, ServiceOverlay> = {
  "component:Button": ButtonOverlay,
  "component:Modal": ModalOverlay,
  "component:Sidebar": SidebarOverlay,
};
