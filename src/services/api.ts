import { JournalEntry, CognitiveAnalysis, SecurityStatus } from '../types';

export async function sendJournalChat(
  token: string,
  message: string,
  history: Array<{ role: 'user' | 'model'; text: string }>
): Promise<{
  id: string;
  reply: string;
  summary: string;
  cognitiveAnalysis: CognitiveAnalysis;
  createdAt: string;
  entry: JournalEntry;
  tenantPath: string;
}> {
  const response = await fetch('/api/journal/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to process journal reflection';
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // keep fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function fetchEntries(token: string): Promise<JournalEntry[]> {
  const response = await fetch('/api/entries', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to fetch journal entries';
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // keep fallback
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.entries || [];
}

export async function deleteEntry(token: string, id: string): Promise<void> {
  const response = await fetch(`/api/entries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete entry');
  }
}

export async function fetchSecurityStatus(): Promise<SecurityStatus> {
  const response = await fetch('/api/security-status');
  if (!response.ok) {
    throw new Error('Failed to fetch security telemetry');
  }
  return response.json();
}
