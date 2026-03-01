import { DictionaryResult } from '../types';

const NOTEBOOK_KEY = 'lingopop_notebook';
const HISTORY_KEY = 'lingopop_history';

export const getNotebook = (): DictionaryResult[] => {
  try {
    const data = localStorage.getItem(NOTEBOOK_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading notebook from localStorage', e);
    return [];
  }
};

export const saveToNotebook = (item: DictionaryResult) => {
  const notebook = getNotebook();
  if (!notebook.find((n) => n.id === item.id)) {
    notebook.push(item);
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebook));
  }
};

export const removeFromNotebook = (id: string) => {
  const notebook = getNotebook();
  const updated = notebook.filter((n) => n.id !== id);
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(updated));
};

export const isSaved = (id: string): boolean => {
  const notebook = getNotebook();
  return !!notebook.find((n) => n.id === id);
};

export const getHistory = (): string[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveToHistory = (query: string) => {
  let history = getHistory();
  history = history.filter((q) => q.toLowerCase() !== query.toLowerCase());
  history.unshift(query);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
