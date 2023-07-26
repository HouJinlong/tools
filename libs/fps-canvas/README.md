# fps-canvas

#### JavaScript FPS Monitor

FPS Frames rendered in the last second. The higher the number the better.

#### Screenshots

![https://cdn.jsdelivr.net/gh/HouJinlong/pic@master/2023-07-26/fps.png](https://cdn.jsdelivr.net/gh/HouJinlong/pic@master/2023-07-26/fps.png)

#### Installation

```bash
yarn add fps-canvas

# or

npm install fps-canvas
```

#### Api

```typescript
declare class FpsCanvas<T extends typeof WebFps | typeof PhaserFps> {
    target?: InstanceType<T>;
    constructor(Target: T, config?: {
        maxFps?: number;
        enable?: boolean;
        color?: string;
        bgcolor?: string;
    });
    container?: HTMLDivElement;
    private initContainer;
    destroy(): void;
}
```
##### Parameters

 - Target 监听fps的目标,目前有 WebFps和PhaserFps
 - config
   - maxFps 绘制图表最大fps
   - enable 是否启用，线上环境可传false
   - color 文字和绘图颜色
   - bgcolor 背景颜色

##### Members

 - target fps目标实例
 - container 包裹dom对象，调整位置层级等，可通过对该dom对象操作进行
  
##### Methods

 - destroy 销毁方法

#### Usage

##### React

```typescript
import { FpsCanvas, WebFps } from 'fps-canvas';


useEffect(() => {
  // 创建
  const fps = new FpsCanvas(WebFps, {
    enable: true,
    maxFps: 60,
  });
  // 销毁
  return () => {
    fps.destroy();
  };
}, []);
```

##### Phaser

```typescript
import { FpsCanvas, PhaserFps } from 'fps-canvas';


useEffect(() => {
  const game = new Game({
   ...
  });
  // 创建
  const fps = new FpsCanvas(PhaserFps, args);
  // 绑定game
  fps.target?.init(game);
  return () => {
    // 销毁
    fps.destroy();
    game.destroy(true);
  };
}, []);
```

##### Acknowledgements

  - [stats.js](https://github.com/mrdoob/stats.js) 实现参考
