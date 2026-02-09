import { describe, it, expect } from "vitest";
import { cn, formatPriceBRL } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("should handle conditional classes", () => {
    const shouldHide = false;
    const shouldShow = true;
    const result = cn("base", shouldHide && "hidden", shouldShow && "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("formatPriceBRL utility function", () => {
  it("should format zero as R$ 0,00", () => {
    // Act
    const result = formatPriceBRL(0);

    // Assert - Use non-breaking space (U+00A0) that Intl.NumberFormat produces
    expect(result).toBe("R$\u00A00,00");
  });

  it("should format 29.9 as R$ 29,90", () => {
    // Act
    const result = formatPriceBRL(29.9);

    // Assert
    expect(result).toBe("R$\u00A029,90");
  });

  it("should format 1234.5 as R$ 1.234,50", () => {
    // Act
    const result = formatPriceBRL(1234.5);

    // Assert
    expect(result).toBe("R$\u00A01.234,50");
  });

  it("should format large numbers correctly", () => {
    // Act
    const result = formatPriceBRL(123456.78);

    // Assert
    expect(result).toBe("R$\u00A0123.456,78");
  });

  it("should format negative values as negative BRL", () => {
    // Act
    const result = formatPriceBRL(-50);

    // Assert
    expect(result).toBe("-R$\u00A050,00");
  });

  it("should round to 2 decimal places", () => {
    // Act
    const result = formatPriceBRL(10.999);

    // Assert
    expect(result).toBe("R$\u00A011,00");
  });
});
