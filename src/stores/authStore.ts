import { ref } from "vue";
import { defineStore } from "pinia";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });

  async function login() {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function logout() {
    await signOut(auth);
  }

  return { user, login, logout };
});
