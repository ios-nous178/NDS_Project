---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5158-108
---

## summary

단일 선택 입력. 단독으로 쓸 일은 거의 없고, RadioGroup + RadioGroupItem 조합으로 사용.

## pitfalls

- Radio를 단독으로 여러 개 두고 same name만 맞추는 패턴은 동기화 버그가 잦음. 무조건 RadioGroup으로 감쌀 것.
- RadioGroupItem은 RadioGroupContext 안에서만 동작. throw가 나면 RadioGroup으로 감싸지지 않은 것.
- value prop은 string. 숫자/객체 쓸 거면 String(value)로 직렬화하고 onValueChange에서 다시 파싱.
- **트로스트(Controls 가이드 5158:108)**: 컨트롤 24×24, on 상태 = **다크 #333 테두리+점**(프로젝트 노랑 아님 — 트로스트 토큰 radio.checkedColor). 라벨 우측 gap 12, 그룹 vertical stack 행간 12. 상호배타 옵션에만(독립 다중은 Checkbox). 필수면 그룹 라벨 * + 미선택 시 하단 Helper 에러.
- **런마일(Controls 가이드 5111:345)**: 24×24, on = **오렌지 #FF5B37 ring+점**(트로스트 다크와 달리 fill.brand fallback — checkedColor 미설정). off=원 outline. 단일 선택 그룹(한 그룹 1개만)·정렬 옵션.

## recommended

- <RadioGroup name="freq" value={v} onValueChange={setV}> <RadioGroupItem value="daily" label="매일" /> ... </RadioGroup>
- horizontal 옵션 3개 이하일 때만 layout="horizontal". 그 이상이면 vertical이 스캔 쉬움.

## interactivePattern

그룹 단위로 onValueChange 한 번만 부착. 개별 Radio에 onCheckedChange 부착하지 말 것.

## examplesHtml.do

```html
<form>
  <nds-radio name="freq" value="daily" label="매일" checked></nds-radio>
  <nds-radio name="freq" value="weekly" label="주 1회"></nds-radio>
</form>
```

## examplesHtml.dont

```html
<!-- 같은 그룹인데 name 이 서로 다름 — 둘 다 선택 가능해짐 -->
<nds-radio name="freq-a" value="daily" label="매일"></nds-radio>
<nds-radio name="freq-b" value="weekly" label="주 1회"></nds-radio>
```
