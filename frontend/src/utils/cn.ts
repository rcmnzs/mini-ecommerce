/**
 * Utilitário para concatenar classes CSS condicionalmente.
 * @param classes - Lista de classes (string | undefined | false)
 * @returns String com as classes concatenadas
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
