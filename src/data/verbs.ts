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
  { present: "wash", past: "washed", isRegular: true },
  { present: "push", past: "pushed", isRegular: true },
  { present: "pull", past: "pulled", isRegular: true },
];

export function getRandomVerbs(count: number, verbs: Verb[] = defaultVerbs): Verb[] {
  const shuffled = [...verbs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
