export function createTicketId(date: Date, randomCode: string): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `LB-${yy}${mm}${dd}-${randomCode}`;
}
