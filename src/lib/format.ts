import type { FeedType } from "@/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo"
});

export function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponivel";
  }

  return dateFormatter.format(date);
}

export function normalizeWhatsapp(value: FormDataEntryValue | string | null): string {
  const rawValue = typeof value === "string" ? value : "";
  const digits = rawValue.replace(/\D/g, "").replace(/^00/, "");

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function isValidWhatsapp(value: string): boolean {
  return /^\d{10,15}$/.test(value);
}

export function feedTypeLabel(type: FeedType): string {
  return type === "tem_repetida" ? "Tenho repetida" : "Preciso";
}
