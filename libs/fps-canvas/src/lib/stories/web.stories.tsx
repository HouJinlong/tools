import { Meta } from '@storybook/react';
import { FpsCanvas, WebFps } from '../fps-canvas';
import 'web-animations-js/web-animations-next.min.js';
import './web.stories.scss';
import { useEffect } from 'react';

export default {
  title: 'h5动画',
  argTypes: {
    color: { control: 'color' },
    bgcolor: { control: 'color' },
  },
} as Meta;

export const Temp = (args) => {
  // fps
  useEffect(() => {
    const fps = new FpsCanvas(WebFps, args);
    return () => {
      fps.destroy();
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
  return (
    <>
      <h4
        style={{
          textAlign: 'center',
          paddingTop: '50px',
        }}
      >
        点击页面进行一万个console.log <br /> 影响动画执行
      </h4>
      <h2>animation</h2>
      <div className="animation" />
      <h2>left + 3D</h2>
      <div className="left3D" />
      <h2>left</h2>
      <div className="left" />
    </>
  );
};
Temp.args = {
  enable: true,
  maxFps: 120,
  color:'#0ff',
  bgcolor:'#002',
};
Temp.storyName = '使用';
