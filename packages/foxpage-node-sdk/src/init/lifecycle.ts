let stage: 'dead' | 'live' = 'dead';

export const success = () => {
  stage = 'live';
};

export const isAlive = () => {
  return stage === 'live';
};
