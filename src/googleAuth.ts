interface GoogleCredentialResponse {
  credential: string;
}

interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }): void;
          prompt(momentListener?: (notification: GooglePromptNotification) => void): void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let initialized = false;
let pendingResolve: ((idToken: string) => void) | null = null;
let pendingReject: ((err: Error) => void) | null = null;

// index.html 用 <script async defer> 載入 GIS SDK，可能還沒載完就被呼叫，這裡輪詢等它就緒
function waitForGis(timeoutMs = 5000): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(timer);
        resolve();
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(timer);
        reject(new Error("Google 登入元件載入逾時，請重新整理頁面再試一次"));
      }
    }, 50);
  });
}

function ensureInitialized() {
  if (initialized) return;

  window.google!.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => {
      pendingResolve?.(response.credential);
      pendingResolve = null;
      pendingReject = null;
    },
  });
  initialized = true;
}

// 回傳 Google 簽發的 ID Token（JWT），交給後端 /api/auth/google 驗證換取自家 JWT
export async function signInWithGoogle(): Promise<string> {
  await waitForGis();
  ensureInitialized();

  return new Promise<string>((resolve, reject) => {
    pendingResolve = resolve;
    pendingReject = reject;

    window.google!.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason = notification.getNotDisplayedReason() || notification.getSkippedReason();
        pendingReject?.(
          new Error(`Google 登入視窗未顯示（${reason}），請確認瀏覽器允許第三方 Cookie 後再試一次`),
        );
        pendingResolve = null;
        pendingReject = null;
      }
    });
  });
}
