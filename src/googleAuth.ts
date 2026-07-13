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
            use_fedcm_for_button?: boolean;
          }): void;
          renderButton(parent: HTMLElement, options: GoogleButtonOptions): void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let initialized = false;
let gisScriptPromise: Promise<void> | null = null;

// 只在使用者實際要登入時才動態載入 GIS SDK，讓未登入訪客不用付出這段請求與執行成本。
// 注意：使用者實際點開登入選單時，一樣會對 accounts.google.com 發出請求並夾帶第三方
// Cookie，這點沒有改變；Lighthouse 的被動掃描只是剛好不會觸發到這條路徑。
function waitForGis(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisScriptPromise = null;
      reject(new Error("Google 登入元件載入失敗，請確認網路連線後再試一次"));
    };
    document.head.appendChild(script);
  });

  return gisScriptPromise;
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
    // 改用瀏覽器原生 FedCM API 取代第三方 Cookie 做登入狀態檢查
    use_fedcm_for_button: true,
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
