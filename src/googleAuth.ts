interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
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
          renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let initialized = false;

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

// 註冊「使用者完成登入」的回呼。不論使用者是點官方按鈕還是觸發 One Tap，最後都會呼叫這裡拿到 ID Token
export async function initGoogleSignIn(
  onCredential: (idToken: string) => void,
): Promise<void> {
  await waitForGis();
  if (initialized) return;

  window.google!.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => onCredential(response.credential),
  });
  initialized = true;
}

// 把 Google 官方登入按鈕畫進指定容器。按鈕本身的點擊、彈窗、帳號選擇都由 Google 的 script 接管，
// 因此即使瀏覽器沒有既有登入態，也能走完整互動式登入（不像 prompt() 只能用既有 session 靜默登入）
export async function renderGoogleButton(
  container: HTMLElement,
  options: GoogleButtonOptions = {},
): Promise<void> {
  await waitForGis();
  window.google!.accounts.id.renderButton(container, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "pill",
    ...options,
  });
}
