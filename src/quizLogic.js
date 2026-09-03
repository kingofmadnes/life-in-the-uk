const LEVEL_META = {
  1: { difficulty: 'easy', label: 'Warm-up', description: 'Foundations and easiest recall' },
  2: { difficulty: 'building', label: 'Building', description: 'You are getting stronger and more consistent' },
  3: { difficulty: 'medium', label: 'Medium', description: 'A steady pace, deeper recall and pressure' },
  4: { difficulty: 'hard', label: 'Hard', description: 'This is the final stretch before test day' },
  5: { difficulty: 'final', label: 'Ready', description: 'You are now ready to book your test' },
};

export function normaliseTranslation(payload, question, langName) {
  if (!payload || typeof payload !== 'object') return null;
  const qText = typeof payload.q === 'string' ? payload.q.trim() : '';
  const expl = typeof payload.e === 'string' ? payload.e.trim() : '';
  const options = Array.isArray(payload.o) ? payload.o : [];

  if (!qText || !expl || options.length !== (question?.o?.length || 4)) return null;

  const cleaned = options
    .map((opt) => (typeof opt === 'string' ? opt.trim() : ''))
    .filter((opt) => opt.length > 0);

  if (cleaned.length !== options.length) return null;

  return {
    q: qText,
    o: cleaned,
    e: expl,
    lang: langName || 'target language',
  };
}

export function getAdaptiveQuizBlueprint(questions, stats = {}) {
  const base = questions
    .map((question) => ({
      ...question,
      score: stats[question.i]?.r ?? 0,
      misses: stats[question.i]?.w ?? 0,
      streak: stats[question.i]?.s ?? 0,
    }))
    .sort((a, b) => {
      const aWeakness = a.misses * 2 + (a.streak > 0 ? 0 : 1) + (a.c ? 0 : 0);
      const bWeakness = b.misses * 2 + (b.streak > 0 ? 0 : 1) + (b.c ? 0 : 0);
      return aWeakness - bWeakness;
    });

  const byChapter = [1, 2, 3, 4, 5].map((chapter) => ({
    chapter,
    items: base.filter((q) => q.c === chapter),
  }));

  const levelRules = [
    { level: 1, pool: (q) => q.c <= 2 },
    { level: 2, pool: (q) => q.c <= 3 },
    { level: 3, pool: (q) => q.c >= 2 && q.c <= 4 },
    { level: 4, pool: (q) => q.c >= 3 && q.c <= 5 },
    { level: 5, pool: (q) => q.c >= 4 },
  ];

  const levels = [];
  for (const rule of levelRules) {
    const meta = LEVEL_META[rule.level];
    const pool = byChapter.flatMap((group) => group.items).filter(rule.pool);
    const selected = (pool.length ? pool : base)
      .slice(0, 4)
      .map((question, index) => ({
        ...question,
        level: rule.level,
        difficulty: meta.difficulty,
        label: meta.label,
        index: index + 1,
        message: rule.level === 5
          ? 'You are now ready to book your test. You have reached the final pass-ready stage.'
          : `Level ${rule.level}: ${meta.description}`,
      }));

    if (selected.length > 0) {
      levels.push(...selected);
    }
  }

  if (levels.length === 0) {
    return base.slice(0, 5).map((question, index) => ({
      ...question,
      level: index + 1,
      difficulty: LEVEL_META[index + 1]?.difficulty || 'easy',
      label: LEVEL_META[index + 1]?.label || 'Warm-up',
      message: index === 4 ? 'You are now ready to book your test. You have reached the final pass-ready stage.' : 'Level progress',
    }));
  }

  const finalEntry = levels.filter((item) => item.level === 5).at(-1);
  if (!finalEntry) {
    const ready = { ...levels.at(-1), level: 5, difficulty: 'final', label: 'Ready', message: 'You are now ready to book your test. You have reached the final pass-ready stage.' };
    levels.push(ready);
  }

  return levels;
}

export function getSmartQuizQuestions(questions, stats = {}) {
  const blueprint = getAdaptiveQuizBlueprint(questions, stats);

  const seen = new Set();
  const chosen = [];

  for (const item of blueprint) {
    if (seen.has(item.i)) continue;
    seen.add(item.i);
    chosen.push(item);
  }

  const extras = questions
    .filter((question) => !seen.has(question.i))
    .sort((a, b) => (stats[a.i]?.w ?? 0) - (stats[b.i]?.w ?? 0) || a.c - b.c)
    .slice(0, 8);

  return [...chosen, ...extras];
}
