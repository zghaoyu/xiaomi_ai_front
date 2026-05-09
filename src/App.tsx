import { useEffect, useRef } from 'react';
import styles from './App.module.css';

const PATTERN_TEXT = 'M I M O';
const PATTERN_ROWS = 8;
const PATTERN_COLS = 8;
const BASE_RADIUS = 220;
const EASE = 0.2;
const PRESS_SCALE = 0.7;

function Pattern() {
  return (
    <div className={styles.pattern}>
      {Array.from({ length: PATTERN_ROWS }, (_, i) => (
        <div
          key={i}
          className={`${styles.patternRow} ${i % 2 ? styles.odd : ''}`}
        >
          {Array.from({ length: PATTERN_COLS }, (_, j) => (
            <span key={j}>{PATTERN_TEXT}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 目标位置 (鼠标实时位置) / 球当前位置 (慢慢追上目标) / 当前半径
    let tx = window.innerWidth * 0.8;
    let ty = window.innerHeight * 0.5;
    let cx = tx;
    let cy = ty;
    let cr = BASE_RADIUS;
    let tr = BASE_RADIUS;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onDown = () => {
      tr = BASE_RADIUS * PRESS_SCALE;
    };
    const onUp = () => {
      tr = BASE_RADIUS;
    };
    const onLeave = () => {
      tx = window.innerWidth * 0.8;
      ty = window.innerHeight * 0.5;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        tx = t.clientX;
        ty = t.clientY;
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });

    let raf = 0;
    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      cr += (tr - cr) * EASE;
      const node = revealRef.current;
      if (node) {
        node.style.clipPath = `circle(${cr}px at ${cx}px ${cy}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className={styles.nav}>
        <span className={styles.logo}>Xiaomi MiMo</span>
        <span className={styles.links}>Blog &nbsp; Join us</span>
      </header>

      <section className={styles.hero}>
        {/* 底层:浅色背景 + 黑色中文 */}
        <div className={`${styles.layer} ${styles.base}`}>
          <Pattern />
          <h1 className={styles.title}>你好,我是 MiMo</h1>
        </div>

        {/* 顶层:深色背景 + 白色英文,被圆形 clip-path 切成"黑球" */}
        <div ref={revealRef} className={`${styles.layer} ${styles.reveal}`}>
          <Pattern />
          <h1 className={styles.title}>hello,I'M MiMo</h1>
        </div>
      </section>

      <p className={styles.hint}>移动鼠标 / Move your cursor</p>
    </>
  );
}
