import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { signInWithGoogle } from "../googleAuth";
import { loginWithGoogle, getJwt, setJwt, clearJwt, decodeJwt } from "../api";

export interface AuthUser {
  email: string;
  displayName?: string;
  photoURL?: string;
}

function userFromJwt(token: string): AuthUser | null {
  try {
    const payload = decodeJwt(token);
    if (payload.exp * 1000 < Date.now()) return null;

    return {
      email: payload.email,
      displayName: payload.name,
      photoURL: payload.picture,
    };
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const isAuthReady = ref(false);
  const isLoggedIn = computed(() => isAuthReady.value && !!user.value);

  // 啟動時檢查本機是否已存有沒過期的 JWT，有的話就直接恢復登入狀態
  const existingJwt = getJwt();
  if (existingJwt) {
    const restored = userFromJwt(existingJwt);
    if (restored) {
      user.value = restored;
    } else {
      clearJwt();
    }
  }
  isAuthReady.value = true;

  async function login() {
    const idToken = await signInWithGoogle();
    const { token } = await loginWithGoogle(idToken);
    setJwt(token);
    user.value = userFromJwt(token);
  }

  function logout() {
    clearJwt();
    user.value = null;
  }

  return { user, isAuthReady, login, logout, isLoggedIn };
});
