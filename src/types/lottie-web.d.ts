declare module 'lottie-web' {
  export interface AnimationItem {
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    setSpeed(speed: number): void;
    setDirection(direction: 1 | -1): void;
    goToAndPlay(value: number, isFrame?: boolean): void;
    goToAndStop(value: number, isFrame?: boolean): void;
    addEventListener(name: string, callback: () => void): void;
    removeEventListener(name: string, callback: () => void): void;
  }

  export interface AnimationConfig {
    container: Element;
    renderer?: 'svg' | 'canvas' | 'html';
    loop?: boolean;
    autoplay?: boolean;
    path?: string;
    animationData?: unknown;
    name?: string;
  }

  const lottie: {
    loadAnimation(config: AnimationConfig): AnimationItem;
    destroy(name?: string): void;
  };

  export default lottie;
}
