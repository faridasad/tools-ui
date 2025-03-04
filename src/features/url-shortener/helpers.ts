export const formatDate = (date: string | null | undefined): string => {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
};
