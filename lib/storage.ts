export interface UserJourney {
  code: string;
  phase1: {
    profileTitle: string;
    profileHeadline: string;
    description: string;
    awarenessLevel?: string;
    date: string;
  };
  phase2?: {
    resultText: string;
    resultType: 'A' | 'B' | 'C';
    awarenessLevel?: string;
    date: string;
  };
}

export function savePhase1(data: UserJourney['phase1']): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomStr = Array.from({length: 5}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const code = `SCALP-${randomStr}`;
  
  const journey: UserJourney = {
    code,
    phase1: data
  };
  
  localStorage.setItem(code, JSON.stringify(journey));
  return code;
}

export function getJourney(code: string): UserJourney | null {
  const data = localStorage.getItem(code);
  if (!data) return null;
  try {
    return JSON.parse(data) as UserJourney;
  } catch (e) {
    return null;
  }
}

export function savePhase2(code: string, data: UserJourney['phase2']) {
  const journey = getJourney(code);
  if (!journey) return;
  journey.phase2 = data;
  localStorage.setItem(code, JSON.stringify(journey));
}
