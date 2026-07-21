import { createHash } from 'crypto';

export interface MarketingPlanTask {
  id: string;
  text: string;
  line: number;
  checkedInDoc: boolean;
}

export interface MarketingPlanSubsection {
  id: string;
  title: string;
  body: string;
  tasks: MarketingPlanTask[];
}

export interface MarketingPlanSection {
  id: string;
  title: string;
  blockNumber: number | null;
  body: string;
  subsections: MarketingPlanSubsection[];
  tasks: MarketingPlanTask[];
}

export interface ParsedMarketingPlan {
  title: string;
  updatedAt: string | null;
  sections: MarketingPlanSection[];
  allTasks: MarketingPlanTask[];
  totalTasks: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function taskId(sectionTitle: string, text: string): string {
  return createHash('sha256')
    .update(`${sectionTitle}::${text.trim()}`)
    .digest('hex')
    .slice(0, 16);
}

function extractBlockNumber(title: string): number | null {
  const match = title.match(/БЛОК\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function flushSubsection(
  section: MarketingPlanSection,
  subsection: MarketingPlanSubsection | null,
  bodyLines: string[]
): MarketingPlanSubsection | null {
  if (!subsection) return null;
  subsection.body = bodyLines.join('\n').trim();
  section.subsections.push(subsection);
  return null;
}

export function parseMarketingPlan(markdown: string): ParsedMarketingPlan {
  const lines = markdown.split('\n');
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const updatedMatch = markdown.match(/\*\*Обновлено:\*\*\s*(.+)/);

  const sections: MarketingPlanSection[] = [];
  let currentSection: MarketingPlanSection | null = null;
  let currentSubsection: MarketingPlanSubsection | null = null;
  let sectionBodyLines: string[] = [];
  let subsectionBodyLines: string[] = [];

  const pushSection = () => {
    if (!currentSection) return;
    if (currentSubsection) {
      currentSubsection.body = subsectionBodyLines.join('\n').trim();
      currentSection.subsections.push(currentSubsection);
      currentSubsection = null;
      subsectionBodyLines = [];
    }
    currentSection.body = sectionBodyLines.join('\n').trim();
    currentSection.tasks = currentSection.subsections.flatMap((s) => s.tasks);
    sections.push(currentSection);
    currentSection = null;
    sectionBodyLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      pushSection();
      const sectionTitle = line.slice(3).trim();
      currentSection = {
        id: slugify(sectionTitle) || `section-${sections.length}`,
        title: sectionTitle,
        blockNumber: extractBlockNumber(sectionTitle),
        body: '',
        subsections: [],
        tasks: [],
      };
      continue;
    }

    if (!currentSection) continue;

    if (line.startsWith('### ')) {
      if (currentSubsection) {
        currentSubsection.body = subsectionBodyLines.join('\n').trim();
        currentSection.subsections.push(currentSubsection);
        subsectionBodyLines = [];
      }
      const subTitle = line.slice(4).trim();
      currentSubsection = {
        id: slugify(`${currentSection.id}-${subTitle}`),
        title: subTitle,
        body: '',
        tasks: [],
      };
      continue;
    }

    const taskMatch = line.match(/^- \[([ xX])\]\s+(.+)$/);
    if (taskMatch) {
      const checkedInDoc = taskMatch[1].toLowerCase() === 'x';
      const text = taskMatch[2].trim();
      const task: MarketingPlanTask = {
        id: taskId(currentSection.title, text),
        text,
        line: i + 1,
        checkedInDoc,
      };

      if (currentSubsection) {
        currentSubsection.tasks.push(task);
      } else {
        if (!currentSection.subsections.length) {
          currentSubsection = {
            id: `${currentSection.id}-tasks`,
            title: 'Задачи',
            body: '',
            tasks: [],
          };
        }
        if (!currentSubsection) {
          currentSubsection = {
            id: `${currentSection.id}-tasks`,
            title: 'Задачи',
            body: '',
            tasks: [],
          };
        }
        currentSubsection.tasks.push(task);
      }
      continue;
    }

    if (currentSubsection) {
      subsectionBodyLines.push(line);
    } else {
      sectionBodyLines.push(line);
    }
  }

  pushSection();

  // Attach orphan subsection tasks to section
  for (const section of sections) {
    if (
      section.subsections.length === 1 &&
      section.subsections[0].title === 'Задачи' &&
      !section.subsections[0].body
    ) {
      const only = section.subsections[0];
      if (only.tasks.length && !only.body) {
        // keep as is
      }
    }
    section.tasks = section.subsections.flatMap((s) => s.tasks);
    if (!section.subsections.length && section.body) {
      // section-level content only
    }
  }

  const allTasks = sections.flatMap((s) => s.tasks);

  return {
    title: titleMatch?.[1]?.trim() ?? 'Маркетинговый план',
    updatedAt: updatedMatch?.[1]?.trim() ?? null,
    sections,
    allTasks,
    totalTasks: allTasks.length,
  };
}

export function mergeProgress(
  plan: ParsedMarketingPlan,
  progress: Record<string, boolean>
): { plan: ParsedMarketingPlan; completedCount: number } {
  let completedCount = 0;

  const mapTasks = (tasks: MarketingPlanTask[]) =>
    tasks.map((task) => {
      const checked =
        progress[task.id] !== undefined ? progress[task.id] : task.checkedInDoc;
      if (checked) completedCount++;
      return { ...task, checkedInDoc: checked };
    });

  const sections = plan.sections.map((section) => ({
    ...section,
    subsections: section.subsections.map((sub) => ({
      ...sub,
      tasks: mapTasks(sub.tasks),
    })),
    tasks: mapTasks(section.tasks),
  }));

  return {
    plan: {
      ...plan,
      sections,
      allTasks: sections.flatMap((s) => s.tasks),
    },
    completedCount,
  };
}

export type MarketingPlanTaskWithStatus = MarketingPlanTask & { checked: boolean };

export function applyCheckedState(
  plan: ParsedMarketingPlan,
  progress: Record<string, boolean>
): ParsedMarketingPlan & {
  completedCount: number;
  sectionsWithStatus: (MarketingPlanSection & {
    subsections: (MarketingPlanSubsection & {
      tasks: MarketingPlanTaskWithStatus[];
    })[];
    tasks: MarketingPlanTaskWithStatus[];
    completedCount: number;
    totalCount: number;
  })[];
} {
  let completedCount = 0;

  const sectionsWithStatus = plan.sections.map((section) => {
    const mapTask = (task: MarketingPlanTask): MarketingPlanTaskWithStatus => {
      const checked =
        progress[task.id] !== undefined ? progress[task.id] : task.checkedInDoc;
      if (checked) completedCount++;
      return { ...task, checked };
    };

    const subsections = section.subsections.map((sub) => ({
      ...sub,
      tasks: sub.tasks.map(mapTask),
    }));

    const tasks = section.tasks.map(mapTask);
    const totalCount = tasks.length;
    const sectionCompleted = tasks.filter((t) => t.checked).length;

    return {
      ...section,
      subsections,
      tasks,
      completedCount: sectionCompleted,
      totalCount,
    };
  });

  return {
    ...plan,
    sections: plan.sections,
    sectionsWithStatus,
    completedCount,
  };
}

export function getNextTask(
  sectionsWithStatus: ReturnType<typeof applyCheckedState>['sectionsWithStatus']
): MarketingPlanTaskWithStatus | null {
  for (const section of sectionsWithStatus) {
    for (const sub of section.subsections) {
      for (const task of sub.tasks) {
        if (!task.checked) return task;
      }
    }
  }
  return null;
}
