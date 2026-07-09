// 山峰 marker 共用的三角形 SVG icon，讓一般 / 選取狀態可以共用同一個形狀，只換填色。
export function peakIconHtml(fill: string): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24">
            <polygon
              points="12,3 22,21 2,21"
              fill="${fill}"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>`;
}
