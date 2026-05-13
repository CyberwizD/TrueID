export function normalizePhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('234')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `+234${digits.slice(1)}`;
  }

  if (digits.startsWith('00')) {
    return `+${digits.slice(2)}`;
  }

  return `+${digits}`;
}
