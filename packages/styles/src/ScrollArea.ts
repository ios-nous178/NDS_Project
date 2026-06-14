/* Shared horizontal-scroll utility — DS 공용 가로 스크롤 레일 클래스 한 벌.
 * `overflow-x:auto` + 스크롤바 숨김(크로스 브라우저)을 클래스 하나로 묶었다.
 * 손으로 짠 카드 레일·칩 row·가로 탭처럼 "가로로 넘치면 스크롤하되 스크롤바는
 * 숨김" 케이스가 매번 ::-webkit-scrollbar / scrollbar-width 를 재구현하던 것을
 * 한 자리로 모은 SSOT.
 *
 * (FilterBar·ChatInput·Tabs·PopularPosts·TimePicker 는 같은 관용구를 자체 보유 —
 *  의도된 기존 구현이라 그대로 두되, 신규 코드/목업은 이 유틸을 쓴다.
 *  레일 레이아웃 레시피는 get_guide({ topic: 'pattern:scroll-rail' }) 참고.)
 *
 * 클래스:
 *   .nds-scroll-x   가로 스크롤 + 스크롤바 숨김. 레이아웃(flex/grid·gap·아이템 폭)은
 *                   강제하지 않는다 — 호출부에서 display:flex; gap 과 아이템
 *                   flex-shrink:0 을 준다 (scroll-rail 패턴 참고).
 */

export const scrollAreaStyles = `
  :where(.nds-scroll-x) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* legacy Edge/IE */
  }
  :where(.nds-scroll-x)::-webkit-scrollbar {
    display: none; /* WebKit / Blink */
  }
`;
