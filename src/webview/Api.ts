let vscode : vsCodeApi | undefined;


interface vsCodeApi {
  postMessage(message: any): void;
}

declare function acquireVsCodeApi<T = any>(): {
  postMessage(message: T): void;
};


export const openSvgInEditor = (path: string) => () => {
  const vscode: vsCodeApi = getVsCodeApi();
  vscode.postMessage({ command: 'open-svg', path });
}
export const goToSvgInLocate = (path: string) => () => {
  const vscode: vsCodeApi = getVsCodeApi();
  vscode.postMessage({ command: 'go-to-svg', path });
}

export const openSvgInWeb = (url: string) => {
  const vscode: vsCodeApi = getVsCodeApi();
  vscode.postMessage({ command: 'open-web', url });
}

export function getVsCodeApi() {
  if (!vscode) {
    vscode = acquireVsCodeApi();
  }
  return vscode;
}