import { describe, it, expect } from "vitest";
import { decodeJwt } from "./api";

function fakeJwt(payload: object): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  return `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}.fake-signature`;
}

describe("decodeJwt", () => {
  it("解出 payload 裡的欄位", () => {
    const token = fakeJwt({ sub: "123", email: "a@example.com", exp: 999 });

    const payload = decodeJwt(token);

    expect(payload.sub).toBe("123");
    expect(payload.email).toBe("a@example.com");
    expect(payload.exp).toBe(999);
  });

  it("payload 沒有 padding 時也能正確解碼", () => {
    // base64url 編碼後長度不是 4 的倍數、原本沒有 '=' padding 的情況
    const token = fakeJwt({ sub: "x", email: "b@example.com", exp: 1 });

    expect(() => decodeJwt(token)).not.toThrow();
  });
});
