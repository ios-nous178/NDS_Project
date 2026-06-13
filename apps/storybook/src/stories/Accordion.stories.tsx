import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@nudge-design/react";

const meta: Meta<typeof Accordion> = {
  title: "Components/Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  name: "Variant/Single (한 번에 하나)",
  tags: ["gallery"],
  render: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>이용 약관</AccordionTrigger>
          <AccordionContent>서비스 이용에 관한 약관 본문이 여기에 표시됩니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>개인정보 처리방침</AccordionTrigger>
          <AccordionContent>개인정보 수집·이용 항목과 보관 기간을 안내합니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>마케팅 정보 수신 동의</AccordionTrigger>
          <AccordionContent>이벤트·혜택 알림 수신에 대한 선택 동의 항목입니다.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  name: "Variant/Multiple (여러 개 열기)",
  render: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Accordion type="multiple" defaultValue={["a", "b"]}>
        <AccordionItem value="a">
          <AccordionTrigger>자주 묻는 질문 1</AccordionTrigger>
          <AccordionContent>여러 항목을 동시에 펼쳐 둘 수 있습니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>자주 묻는 질문 2</AccordionTrigger>
          <AccordionContent>FAQ 처럼 여러 답을 한 번에 보여줄 때 적합합니다.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
