export interface Verb {
  present: string;
  past: string;
  isRegular: boolean;
}

export const defaultVerbs: Verb[] = [
  // Regular verbs
  { present: "walk", past: "walked", isRegular: true },
  { present: "jump", past: "jumped", isRegular: true },
  { present: "play", past: "played", isRegular: true },
  { present: "help", past: "helped", isRegular: true },
  { present: "watch", past: "watched", isRegular: true },
  { present: "clean", past: "cleaned", isRegular: true },
  { present: "cook", past: "cooked", isRegular: true },
  { present: "paint", past: "painted", isRegular: true },
  { present: "talk", past: "talked", isRegular: true },
  { present: "listen", past: "listened", isRegular: true },
  { present: "open", past: "opened", isRegular: true },
  { present: "close", past: "closed", isRegular: true },
  { present: "dance", past: "danced", isRegular: true },
  { present: "laugh", past: "laughed", isRegular: true },
  { present: "smile", past: "smiled", isRegular: true },
  { present: "wash", past: "washed", isRegular: true },
  { present: "push", past: "pushed", isRegular: true },
  { present: "pull", past: "pulled", isRegular: true },
  { present: "work", past: "worked", isRegular: true },
  { present: "look", past: "looked", isRegular: true },
  { present: "call", past: "called", isRegular: true },
  { present: "turn", past: "turned", isRegular: true },
  { present: "move", past: "moved", isRegular: true },
  { present: "live", past: "lived", isRegular: true },
  { present: "like", past: "liked", isRegular: true },
  { present: "love", past: "loved", isRegular: true },
  { present: "ask", past: "asked", isRegular: true },
  { present: "answer", past: "answered", isRegular: true },
  { present: "wait", past: "waited", isRegular: true },
  { present: "start", past: "started", isRegular: true },
  { present: "finish", past: "finished", isRegular: true },
  { present: "stop", past: "stopped", isRegular: true },
  { present: "show", past: "showed", isRegular: true },
  { present: "need", past: "needed", isRegular: true },
  { present: "want", past: "wanted", isRegular: true },
  { present: "use", past: "used", isRegular: true },
  { present: "try", past: "tried", isRegular: true },
  { present: "enjoy", past: "enjoyed", isRegular: true },
  { present: "practice", past: "practiced", isRegular: true },
  { present: "study", past: "studied", isRegular: true },
  { present: "learn", past: "learned", isRegular: true },
  { present: "visit", past: "visited", isRegular: true },
  { present: "travel", past: "travelled", isRegular: true },
  { present: "carry", past: "carried", isRegular: true },
  { present: "drop", past: "dropped", isRegular: true },
  { present: "follow", past: "followed", isRegular: true },
  { present: "return", past: "returned", isRegular: true },
  { present: "climb", past: "climbed", isRegular: true },
  { present: "roll", past: "rolled", isRegular: true },
  
  // Irregular verbs
  { present: "go", past: "went", isRegular: false },
  { present: "see", past: "saw", isRegular: false },
  { present: "run", past: "ran", isRegular: false },
  { present: "eat", past: "ate", isRegular: false },
  { present: "drink", past: "drank", isRegular: false },
  { present: "come", past: "came", isRegular: false },
  { present: "make", past: "made", isRegular: false },
  { present: "take", past: "took", isRegular: false },
  { present: "give", past: "gave", isRegular: false },
  { present: "get", past: "got", isRegular: false },
  { present: "write", past: "wrote", isRegular: false },
  { present: "read", past: "read", isRegular: false },
  { present: "have", past: "had", isRegular: false },
  { present: "do", past: "did", isRegular: false },
  { present: "say", past: "said", isRegular: false },
  { present: "sing", past: "sang", isRegular: false },
  { present: "swim", past: "swam", isRegular: false },
  { present: "fly", past: "flew", isRegular: false },
  { present: "buy", past: "bought", isRegular: false },
  { present: "find", past: "found", isRegular: false },
  { present: "sleep", past: "slept", isRegular: false },
  { present: "stand", past: "stood", isRegular: false },
  { present: "sit", past: "sat", isRegular: false },
  { present: "draw", past: "drew", isRegular: false },
  { present: "cut", past: "cut", isRegular: false },
  { present: "hold", past: "held", isRegular: false },
  { present: "catch", past: "caught", isRegular: false },
  { present: "throw", past: "threw", isRegular: false },
  { present: "hide", past: "hid", isRegular: false },
  { present: "ride", past: "rode", isRegular: false },
  { present: "wake", past: "woke", isRegular: false },
  { present: "wear", past: "wore", isRegular: false },
  { present: "bring", past: "brought", isRegular: false },
  { present: "think", past: "thought", isRegular: false },
  { present: "teach", past: "taught", isRegular: false },
  { present: "feel", past: "felt", isRegular: false },
  { present: "leave", past: "left", isRegular: false },
  { present: "meet", past: "met", isRegular: false },
  { present: "pay", past: "paid", isRegular: false },
  { present: "send", past: "sent", isRegular: false },
  { present: "spend", past: "spent", isRegular: false },
  { present: "build", past: "built", isRegular: false },
  { present: "lose", past: "lost", isRegular: false },
  { present: "hear", past: "heard", isRegular: false },
  { present: "sell", past: "sold", isRegular: false },
  { present: "tell", past: "told", isRegular: false },
  { present: "win", past: "won", isRegular: false },
  { present: "understand", past: "understood", isRegular: false },
  { present: "begin", past: "began", isRegular: false },
  { present: "break", past: "broke", isRegular: false },
  { present: "choose", past: "chose", isRegular: false },
  { present: "fall", past: "fell", isRegular: false },
  { present: "forget", past: "forgot", isRegular: false },
  { present: "grow", past: "grew", isRegular: false },
  { present: "know", past: "knew", isRegular: false },
  { present: "blow", past: "blew", isRegular: false },
  { present: "hit", past: "hit", isRegular: false },
  { present: "let", past: "let", isRegular: false },
  { present: "put", past: "put", isRegular: false },
  { present: "set", past: "set", isRegular: false },
  { present: "shut", past: "shut", isRegular: false },
];

export function getRandomVerbs(count: number, verbs: Verb[] = defaultVerbs): Verb[] {
  const shuffled = [...verbs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export type DifficultyLevel = 1 | 2 | 3;

export function getVerbsByDifficulty(level: DifficultyLevel, verbs: Verb[] = defaultVerbs): Verb[] {
  const regularVerbs = verbs.filter(v => v.isRegular);
  const irregularVerbs = verbs.filter(v => !v.isRegular);
  
  let regularCount: number;
  let irregularCount: number;
  
  switch (level) {
    case 1:
      // Level 1: Most regular + few irregular
      regularCount = 20;
      irregularCount = 5;
      break;
    case 2:
      // Level 2: Balanced mix
      regularCount = 13;
      irregularCount = 12;
      break;
    case 3:
      // Level 3: Few regular + most irregular
      regularCount = 5;
      irregularCount = 20;
      break;
  }
  
  const shuffledRegular = [...regularVerbs].sort(() => Math.random() - 0.5);
  const shuffledIrregular = [...irregularVerbs].sort(() => Math.random() - 0.5);
  
  const selectedVerbs = [
    ...shuffledRegular.slice(0, regularCount),
    ...shuffledIrregular.slice(0, irregularCount)
  ];
  
  // Shuffle the combined array and ensure exactly 25 verbs
  const shuffledResult = selectedVerbs.sort(() => Math.random() - 0.5);
  
  // Safety check: if we don't have exactly 25, fill with more verbs
  if (shuffledResult.length < 25) {
    const allShuffled = [...verbs].sort(() => Math.random() - 0.5);
    while (shuffledResult.length < 25 && allShuffled.length > 0) {
      const nextVerb = allShuffled.shift();
      if (nextVerb && !shuffledResult.find(v => v.present === nextVerb.present)) {
        shuffledResult.push(nextVerb);
      }
    }
  }
  
  return shuffledResult.slice(0, 25);
}
