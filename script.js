// =====================================================
// 1. 生成背景 MIMO 平铺图案 (底层 + 顶层各一份)
// =====================================================
function fillPattern(el) {
  const rows = 8;
  const cols = 8;
  const text = 'M I M O';
  el.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('div');
    row.className = 'pattern-row' + (i % 2 ? ' odd' : '');
    for (let j = 0; j < cols; j++) {
      const span = document.createElement('span');
      span.textContent = text;
      row.appendChild(span);
    }
    el.appendChild(row);
  }
}
fillPattern(document.getElementById('patternBase'));
fillPattern(document.getElementById('patternReveal'));

// =====================================================
// 2. 鼠标跟随 + 线性插值 (lerp) 让球"懒一拍"
// =====================================================
const reveal = document.getElementById('reveal');
const baseRadius = 220;

// 目标位置 (鼠标实时位置)
let tx = innerWidth * 0.8;
let ty = innerHeight * 0.5;
// 球当前位置 (慢慢追上目标)
let cx = tx;
let cy = ty;
// 当前半径 (用于"按一下变大"的弹性反馈)
let cr = baseRadius;
let tr = baseRadius;

window.addEventListener('mousemove', (e) => {
  tx = e.clientX;
  ty = e.clientY;
});

// 鼠标按下时球缩小,松开时弹回 — 加点交互手感
window.addEventListener('mousedown', () => { tr = baseRadius * 0.7; });
window.addEventListener('mouseup',   () => { tr = baseRadius; });

// 鼠标离开窗口,球回到右侧默认位置
window.addEventListener('mouseleave', () => {
  tx = innerWidth * 0.8;
  ty = innerHeight * 0.5;
});

// 主循环
// ease 0.2:跟手但保留少量弹性。想完全贴手改 1.0,想更"懒"调到 0.1。
(function tick() {
  cx += (tx - cx) * 0.2;
  cy += (ty - cy) * 0.2;
  cr += (tr - cr) * 0.2;
  reveal.style.clipPath = `circle(${cr}px at ${cx}px ${cy}px)`;
  requestAnimationFrame(tick);
})();

// =====================================================
// 3. 滚动 / 触摸支持 (移动端)
// =====================================================
window.addEventListener('touchmove', (e) => {
  if (e.touches.length) {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }
}, { passive: true });
