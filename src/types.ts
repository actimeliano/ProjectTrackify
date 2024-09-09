export type ProjectType = 'article' | 'book' | 'art';

export interface Phase {
  id: string;
  name: string;
  completed: boolean;
}

export interface Subproject {
  id: string;
  name: string;
  phases: Phase[];
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  phases: Phase[];
  subprojects: Subproject[];
}

export const defaultPhases: Record<ProjectType, Phase[]> = {
  article: [
    { id: '1', name: 'Research', completed: false },
    { id: '2', name: 'Outline', completed: false },
    { id: '3', name: 'Writing', completed: false },
    { id: '4', name: 'Editing', completed: false },
  ],
  book: [
    { id: '1', name: 'Concept', completed: false },
    { id: '2', name: 'Outline', completed: false },
    { id: '3', name: 'First Draft', completed: false },
    { id: '4', name: 'Revision', completed: false },
    { id: '5', name: 'Editing', completed: false },
    { id: '6', name: 'Publishing', completed: false },
  ],
  art: [
    { id: '1', name: 'Sketch', completed: false },
    { id: '2', name: 'Linework', completed: false },
    { id: '3', name: 'Coloring', completed: false },
    { id: '4', name: 'Finishing', completed: false },
  ],
};