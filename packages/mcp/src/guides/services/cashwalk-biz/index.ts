import type { ServiceOverlay } from "../types.js";
import { ButtonOverlay } from "./Button.js";
import { CheckboxOverlay } from "./Checkbox.js";
import { ModalOverlay } from "./Modal.js";
import { SidebarOverlay } from "./Sidebar.js";
import { TabsOverlay } from "./Tabs.js";
import { ToggleOverlay } from "./Toggle.js";

export const cashwalkBizOverlays: Record<string, ServiceOverlay> = {
  "component:Button": ButtonOverlay,
  "component:Checkbox": CheckboxOverlay,
  "component:Modal": ModalOverlay,
  "component:Sidebar": SidebarOverlay,
  "component:Tabs": TabsOverlay,
  "component:Toggle": ToggleOverlay,
};
