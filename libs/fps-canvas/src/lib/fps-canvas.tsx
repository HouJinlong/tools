import type { Game } from 'phaser';

/**
 * canvas绘制面板
 * @param name 名称
 * @param fg   绘制色
 * @param bg   背景色
 * @param maxValue  绘制的最大值
 * @returns  {canvas,update}
 */
function Panel(name: string, fg: string, bg: string, maxValue: number) {
  let min = Infinity,
    max = 0;
  const round = Math.round;
  const PR = round(window.devicePixelRatio || 1);

  const WIDTH = 80 * PR,
    HEIGHT = 48 * PR,
    TEXT_X = 3 * PR,
    TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR,
    GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = 74 * PR,
    GRAPH_HEIGHT = 30 * PR;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.cssText = 'width:80px;height:48px';

  const context = canvas.getContext('2d')!;
  context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif';
  context.textBaseline = 'top';

  context.fillStyle = bg;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = fg;
  context.fillText(name, TEXT_X, TEXT_Y);
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  context.fillStyle = bg;
  context.globalAlpha = 0.9;
  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

  return {
    canvas,
    update: function (value: number) {
      min = Math.min(min, value);
      max = Math.max(max, value);

      context.fillStyle = bg;
      context.globalAlpha = 1;
      context.fillRect(0, 0, WIDTH, GRAPH_Y);
      context.fillStyle = fg;
      context.fillText(
        round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')',
        TEXT_X,
        TEXT_Y
      );

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT
      );

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

      context.fillStyle = bg;
      context.globalAlpha = 0.9;
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT)
      );
    },
  };
}

function LimitFun() {
  const getNow = () => {
    return (performance || Date).now();
  };
  let prevTime = getNow();
  return (cb: (data: { time: number; prevTime: number }) => void) => {
    const time = getNow();
    if (time >= prevTime + 1000) {
      cb({ time, prevTime });
      prevTime = time;
    }
  };
}

class WebFps {
  fpsPanel: ReturnType<typeof Panel>;
  constructor(fpsPanel: WebFps['fpsPanel']) {
    this.fpsPanel = fpsPanel;
    this.init();
  }
  rafId?: number;
  init() {
    const limit = LimitFun();
    let frames = 0;
    const loop = () => {
      frames++;
      limit(({ time, prevTime }) => {
        this.fpsPanel.update((frames * 1000) / (time - prevTime));
        frames = 0;
      });
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
class PhaserFps {
  fpsPanel: ReturnType<typeof Panel>;
  constructor(fpsPanel: PhaserFps['fpsPanel']) {
    this.fpsPanel = fpsPanel;
  }
  private rafId?: number;
  init(game: Game) {
    const limit = LimitFun();
    const loop = () => {
      limit(() => {
        const actualFps = game?.loop?.actualFps;
        if (actualFps) {
          this.fpsPanel.update(actualFps);
        }
      });
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
class FpsCanvas<T extends typeof WebFps | typeof PhaserFps> {
  target?: InstanceType<T>;
  constructor(
    Target: T,
    config: {
      maxFps?: number;
      enable?: boolean;
      color?: string;
      bgcolor?: string;
    } = {}
  ) {
    if (!config.enable) {
      return;
    }
    this.container = this.initContainer();

    const fpsPanel = Panel(
      'FPS',
      config.color || '#0ff',
      config.bgcolor || '#002',
      config.maxFps || 60
    );
    this.container.appendChild(fpsPanel.canvas);

    this.target = new Target(fpsPanel) as InstanceType<T>;
  }

  container?: HTMLDivElement;
  private initContainer() {
    const container = document.createElement('div');
    container.setAttribute('data-name', 'FpsCanvas');
    container.style.cssText = `
      position:fixed;
      top:0;
      left:0;
      cursor:pointer;
      opacity:0.9;
      z-index:10000
    `;

    document.body.appendChild(container);
    return container;
  }

  destroy() {
    if (!this.container) {
      return;
    }
    if (this.target) {
      this.target.destroy();
    }
    document.body.removeChild(this.container);
  }
}

export { FpsCanvas, WebFps, PhaserFps };
