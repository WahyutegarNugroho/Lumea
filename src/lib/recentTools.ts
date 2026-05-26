const STORAGE_KEY = 'recent_tools';
const MAX_TOOLS = 6;

export function getRecentTools(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentTool(toolId: string): void {
  try {
    const recent = getRecentTools();
    const updated = [toolId, ...recent.filter((id) => id !== toolId)].slice(0, MAX_TOOLS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}
