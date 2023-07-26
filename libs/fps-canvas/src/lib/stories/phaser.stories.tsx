import { Meta } from '@storybook/react';
import { FpsCanvas, PhaserFps } from '../fps-canvas';
import { useEffect, useRef } from 'react';
import { Game } from 'phaser';

export default {
  title: 'Phaser',
  argTypes: {
    color: { control: 'color' },
    bgcolor: { control: 'color' },
  },
} as Meta;

export const Temp = (args) => {
  const phaserRef = useRef<HTMLDivElement>(null);
  // phaser初始化
  useEffect(() => {
    const game = new Game({
      type: Phaser.AUTO,
      parent: phaserRef.current,
      scale: {
        width: window.innerWidth,
        height: window.innerHeight,
        zoom: 1,
      },
      fps: {
        target: 30,
        forceSetTimeOut: true,
      },
      powerPreference: 'high-performance',
      scene: [
        {
          key: 'scene1',
          active: true,
          create() {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xff0000, 1);
            graphics.fillRect(0, 100, 100, 100);
            this.tweens.add({
              targets: [graphics],
              duration: 500,
              props: {
                x: 200,
              },
              repeat: -1,
              yoyo: true,
            });
            this.input.once(
              'pointerdown',
              function () {
                this.scene.start('scene2');
              },
              this
            );
            fps.target?.init(this);
          },
        },
        {
          key: 'scene2',
          create() {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xfff000, 1);
            graphics.fillRect(0, 200, 100, 100);
            this.tweens.add({
              targets: [graphics],
              duration: 500,
              props: {
                x: 200,
              },
              repeat: -1,
              yoyo: true,
            });
            this.input.once(
              'pointerdown',
              function () {
                this.scene.start('scene1');
              },
              this
            );
            fps.target?.init(this);
          },
        },
      ],
    });
    const fps = new FpsCanvas(PhaserFps, args);
    fps.target?.init(game);
    return () => {
      fps.destroy();
      game.destroy(true);
    };
  }, [args]);
  // 掉帧
  useEffect(() => {
    const fn = () => {
      let i = 10000;
      while (i > 0) {
        console.log('i', i);
        i--;
      }
    };
    window.addEventListener('click', fn);
    return () => {
      window.removeEventListener('click', fn);
    };
  }, []);
  return <div ref={phaserRef} />;
};
Temp.args = {
  enable: true,
  maxFps: 30,
  color: '#0ff',
  bgcolor: '#002',
};
Temp.storyName = '使用';
