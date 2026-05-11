import { userEvent } from "storybook/test";

const IS_DEV_STORYBOOK = import.meta.env.DEV;
const INTERACTION_DELAY_MS = IS_DEV_STORYBOOK ? 180 : 0;
const INTERACTION_STEP_PAUSE_MS = IS_DEV_STORYBOOK ? 360 : 0;

export const pause = (ms = INTERACTION_STEP_PAUSE_MS) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const createInteractionUser = () => {
  const user = userEvent.setup({ delay: INTERACTION_DELAY_MS });

  const runStep = async <T>(action: () => Promise<T>) => {
    await pause();
    const result = await action();
    await pause();
    return result;
  };

  return {
    click: (element: Parameters<typeof user.click>[0]) => runStep(() => user.click(element)),
    type: (element: Parameters<typeof user.type>[0], text: Parameters<typeof user.type>[1]) =>
      runStep(() => user.type(element, text)),
    tab: () => runStep(() => user.tab()),
    keyboard: (text: Parameters<typeof user.keyboard>[0]) => runStep(() => user.keyboard(text)),
  };
};
