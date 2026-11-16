import { registerRoot, Composition } from 'remotion';
import React from 'react';
import { Reel } from './Reel';
import { Reel2, T2 } from './Reel2';
import { Story1, Story2, Story3 } from './Stories';
import { Reel3, T3 } from './Reel3';
import { Ad, timing } from './Ad';
import { Reel4, T4 } from './Reel4';
import { Reel5, T5, Reel6, T6 } from './Reel56';

const Root = () => (
  <Composition
    id="Reel"
    component={Reel}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
  />
);
const Root2 = () => (
  <>
    <Root />
    <Composition id="Reel2" component={Reel2} durationInFrames={T2.total} fps={30} width={1080} height={1920} />
    <Composition id="Reel3" component={Reel3} durationInFrames={T3.total} fps={30} width={1080} height={1920} />
    <Composition id="Reel4" component={Reel4} durationInFrames={T4.total} fps={30} width={1080} height={1920} />
    <Composition id="Reel5" component={Reel5} durationInFrames={T5.total} fps={30} width={1080} height={1920} />
    <Composition id="Reel6" component={Reel6} durationInFrames={T6.total} fps={30} width={1080} height={1920} />
    <Composition id="AdA" component={Ad} defaultProps={{ hook: 'A', voice: 'voz-A.wav' }} durationInFrames={timing('A').total} fps={30} width={1080} height={1920} />
    <Composition id="AdB" component={Ad} defaultProps={{ hook: 'B', voice: 'voz-B.wav' }} durationInFrames={timing('B').total} fps={30} width={1080} height={1920} />
    <Composition id="AdC" component={Ad} defaultProps={{ hook: 'C', voice: 'voz-C.wav' }} durationInFrames={timing('C').total} fps={30} width={1080} height={1920} />
    <Composition id="Story1" component={Story1} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="Story2" component={Story2} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="Story3" component={Story3} durationInFrames={240} fps={30} width={1080} height={1920} />
  </>
);

registerRoot(Root2);
