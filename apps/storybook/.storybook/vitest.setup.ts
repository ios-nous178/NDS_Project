import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/react-vite";

import * as previewAnnotations from "./preview";

// addon-vitest 브라우저 테스트에 preview.ts 의 decorator/parameters/globals 를 적용한다.
// (구 @storybook/test-runner 의 story 렌더 smoke-test 를 SB10 네이티브 vitest 로 대체)
const project = setProjectAnnotations([previewAnnotations]);

beforeAll(project.beforeAll);
