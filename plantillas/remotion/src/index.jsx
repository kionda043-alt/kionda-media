import { registerRoot, Composition } from 'remotion';
import React from 'react';
import { Reel } from './Reel';
import { Reel2, T2 } from './Reel2';
import { Story1, Story2, Story3 } from './Stories';
import { Reel3, T3 } from './Reel3';

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
    <Composition id="Story1" component={Story1} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="Story2" component={Story2} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="Story3" component={Story3} durationInFrames={240} fps={30} width={1080} height={1920} />
  </>
);

registerRoot(Root2);
