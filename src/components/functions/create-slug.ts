export function generateSlug(title: string): string {
  // Remove acentos e outros diacríticos
  const normalized = title.normalize('NFD').replace(/[\p{Diacritic}]/gu, '')

  return normalized
    .toLowerCase() // Converte para letras minúsculas
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais, exceto espaços e hifens
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .trim() // Remove espaços extras no início e no final
}
