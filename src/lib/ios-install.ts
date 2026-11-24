export type IOSInstallMode = "ios-safari" | "ios-browser" | "pass";
type NativeWindow = Window & {
  __KHODROCHARE_NATIVE_APP__?: boolean;
  Capacitor?: { isNativePlatform?: () => boolean };
  cordova?: unknown;
  ReactNativeWebView?: { postMessage?: unknown };
  webkit?: { messageHandlers?: { capacitor?: unknown; cordova?: unknown } };
};
export function iosInstallMode(): IOSInstallMode {
  const agent = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/i.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!ios) return 'pass';
  const runtime = window as NativeWindow;
  const nav = navigator as Navigator & { standalone?: boolean };
  const appDisplay = ['standalone','minimal-ui','fullscreen','window-controls-overlay'].some(mode => window.matchMedia(`(display-mode: ${mode})`).matches);
  let native = runtime.__KHODROCHARE_NATIVE_APP__ === true || !!runtime.cordova || typeof runtime.ReactNativeWebView?.postMessage === 'function' || !!runtime.webkit?.messageHandlers?.capacitor || !!runtime.webkit?.messageHandlers?.cordova;
  try { native ||= runtime.Capacitor?.isNativePlatform?.() === true; } catch { native = true; }
  const knownBrowser = /Safari|CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(agent);
  const webView = /AppleWebKit/i.test(agent) && !knownBrowser;
  if (nav.standalone || appDisplay || native || webView || document.referrer.startsWith('android-app://')) return 'pass';
  return /Safari/i.test(agent) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(agent) ? 'ios-safari' : 'ios-browser';
}
