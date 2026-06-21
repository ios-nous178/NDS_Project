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
    <div style={{ width: 320 }}>
      <Accordion type="card" expandMode="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>이용 약관</AccordionTrigger>
          <AccordionContent>서비스 이용에 관한 약관 본문이 여기에 표시됩니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>개인정보 처리방침</AccordionTrigger>
          <AccordionContent>개인정보 수집·이용 항목과 보관 기간을 안내합니다.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  name: "Variant/Multiple (여러 개 열기)",
  render: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Accordion expandMode="multiple" defaultValue={["a", "b"]}>
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

export const Types: Story = {
  name: "Type/Line vs Card",
  tags: ["gallery"],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 360 }}>
      <div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>type=&quot;line&quot; — FAQ·약관</div>
        <Accordion type="line" expandMode="multiple" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>배송은 얼마나 걸리나요?</AccordionTrigger>
            <AccordionContent>영업일 기준 2~3일 소요됩니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>교환·환불이 가능한가요?</AccordionTrigger>
            <AccordionContent>수령 후 7일 이내 가능합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>type=&quot;card&quot; — 심리검사·상품</div>
        <Accordion type="card" expandMode="single" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>스트레스 검사</AccordionTrigger>
            <AccordionContent>최근 2주간의 스트레스 수준을 측정합니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>수면 검사</AccordionTrigger>
            <AccordionContent>수면의 질과 패턴을 진단합니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};
