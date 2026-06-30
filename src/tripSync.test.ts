import { describe, it, expect } from "vitest";
import { mergeTrips } from "./tripSync";
import type { Trip } from "./types";

// 測試用：快速建一筆 Trip，只需指定關心的欄位
function trip(over: Partial<Trip> & { id: string; updatedAt: number }): Trip {
  return { date: "2026-01-01", peakIds: [], ...over };
}

describe("mergeTrips", () => {
  it("保留只存在於 a 的行程（union）", () => {
    const a = [trip({ id: "x", updatedAt: 1 })];
    const b: Trip[] = [];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("x");
  });

  it("保留只存在於 b 的行程（union）", () => {
    const a: Trip[] = [];
    const b = [trip({ id: "y", updatedAt: 2 })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("y");
  });

  it("保留只存在於 a 和 b 的行程（union）", () => {
    const a = [trip({ id: "x", updatedAt: 1 })];
    const b = [trip({ id: "y", updatedAt: 2 })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("x");
    expect(result[1].id).toBe("y");
  });

  it("只保留最新的行程", () => {
    const a = [trip({ id: "x", updatedAt: 1 })];
    const b = [trip({ id: "x", updatedAt: 2 })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("x");
    expect(result[0].updatedAt).toBe(2);
  });

  it("同個行程的 updatedAt 相同時，保留其中一筆", () => {
    const a = [trip({ id: "x", updatedAt: 2 })];
    const b = [trip({ id: "x", updatedAt: 2 })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("x");
    expect(result[0].updatedAt).toBe(2);
  });

  it("當行程被標記為刪除，並且更新時間較新時，僅保留刪除狀態", () => {
    const a = [trip({ id: "x", updatedAt: 1 })];
    const b = [trip({ id: "x", updatedAt: 2, deleted: true })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("x");
    expect(result[0].updatedAt).toBe(2);
    expect(result[0].deleted).toBe(true);
  });

  it("當行程被標記為刪除，並且更新時間較新時，僅保留刪除狀態", () => {
    const a = [trip({ id: "x", updatedAt: 2, deleted: true })];
    const b = [trip({ id: "x", updatedAt: 3, deleted: false })];

    const result = mergeTrips(a, b);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("x");
    expect(result[0].updatedAt).toBe(3);
    expect(result[0].deleted).toBe(false);
  });
});
