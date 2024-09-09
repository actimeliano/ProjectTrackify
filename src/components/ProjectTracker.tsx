import React, { useState, useEffect } from 'react';
import { Project, ProjectType, Phase, Subproject, defaultPhases } from '../types';
import '../styles.css';

const ProgressBar: React.FC<{ phases: Phase[] }> = ({ phases }) => {
  return (
    <div className="progress-bar">
      {phases.map((phase, index) => (
        <div key={phase.id} className={`progress-square ${phase.completed ? 'completed' : ''}`}>
          {index + 1}
        </div>
      ))}
    </div>
  );
};

const ProjectTracker: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType>('article');
  const [customPhases, setCustomPhases] = useState<Record<ProjectType, Phase[]>>(() => {
    const savedCustomPhases = localStorage.getItem('customPhases');
    return savedCustomPhases ? JSON.parse(savedCustomPhases) : defaultPhases;
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('customPhases', JSON.stringify(customPhases));
  }, [customPhases]);

  const addProject = () => {
    if (newProjectName.trim() === '') return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      type: newProjectType,
      phases: customPhases[newProjectType].map(phase => ({ ...phase, completed: false })),
      subprojects: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
  };

  const togglePhase = (projectId: string, phaseId: string, subprojectId?: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          if (subprojectId) {
            return {
              ...project,
              subprojects: project.subprojects.map((subproject) =>
                subproject.id === subprojectId
                  ? {
                      ...subproject,
                      phases: subproject.phases.map((phase) =>
                        phase.id === phaseId ? { ...phase, completed: !phase.completed } : phase
                      ),
                    }
                  : subproject
              ),
            };
          } else {
            return {
              ...project,
              phases: project.phases.map((phase) =>
                phase.id === phaseId ? { ...phase, completed: !phase.completed } : phase
              ),
            };
          }
        }
        return project;
      })
    );
  };

  const addSubproject = (projectId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const newSubproject: Subproject = {
            id: Date.now().toString(),
            name: `Chapter ${project.subprojects.length + 1}`,
            phases: customPhases[project.type].map(phase => ({ ...phase, completed: false })),
          };
          return {
            ...project,
            subprojects: [...project.subprojects, newSubproject],
          };
        }
        return project;
      })
    );
  };

  const updateCustomPhases = (type: ProjectType, phases: Phase[]) => {
    setCustomPhases({ ...customPhases, [type]: phases });
  };

  const addCustomPhase = (type: ProjectType) => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: 'New Phase',
      completed: false,
    };
    updateCustomPhases(type, [...customPhases[type], newPhase]);
  };

  const removeCustomPhase = (type: ProjectType, phaseId: string) => {
    updateCustomPhases(type, customPhases[type].filter(phase => phase.id !== phaseId));
  };

  const updateCustomPhaseName = (type: ProjectType, phaseId: string, newName: string) => {
    updateCustomPhases(
      type,
      customPhases[type].map(phase =>
        phase.id === phaseId ? { ...phase, name: newName } : phase
      )
    );
  };

  const completeProject = (projectId: string) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              phases: project.phases.map((phase) => ({ ...phase, completed: true })),
              subprojects: project.subprojects.map((subproject) => ({
                ...subproject,
                phases: subproject.phases.map((phase) => ({ ...phase, completed: true })),
              })),
            }
          : project
      )
    );
  };

  return (
    <div className="project-tracker">
      <h1 className="neon-text">Project Development Tracker</h1>
      <div className="new-project-form">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="retro-input"
        />
        <select
          value={newProjectType}
          onChange={(e) => setNewProjectType(e.target.value as ProjectType)}
          className="retro-select"
        >
          <option value="article">Article</option>
          <option value="book">Book</option>
          <option value="art">Art</option>
        </select>
        <button onClick={addProject} className="retro-button">Add Project</button>
      </div>
      <div className="custom-phases">
        <h2 className="neon-text">Customize Phases</h2>
        {Object.entries(customPhases).map(([type, phases]) => (
          <div key={type} className="phase-type">
            <h3 className="neon-text">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            {phases.map((phase) => (
              <div key={phase.id} className="phase-item">
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => updateCustomPhaseName(type as ProjectType, phase.id, e.target.value)}
                  className="retro-input"
                />
                <button onClick={() => removeCustomPhase(type as ProjectType, phase.id)} className="retro-button">Remove</button>
              </div>
            ))}
            <button onClick={() => addCustomPhase(type as ProjectType)} className="retro-button">Add Phase</button>
          </div>
        ))}
      </div>
      {projects.map((project) => (
        <div key={project.id} className="project">
          <div className="project-header">
            <h2 className="neon-text">{project.name}</h2>
            <button
              onClick={() => completeProject(project.id)}
              className="retro-button complete-button"
            >
              Complete Project
            </button>
          </div>
          <h3 className="neon-text">Phases:</h3>
          <ProgressBar phases={project.phases} />
          <div className="phases">
            {project.phases.map((phase) => (
              <div key={phase.id} className="phase">
                <input
                  type="checkbox"
                  checked={phase.completed}
                  onChange={() => togglePhase(project.id, phase.id)}
                  className="retro-checkbox"
                />
                <span className={phase.completed ? 'completed' : ''}>{phase.name}</span>
              </div>
            ))}
          </div>
          {project.type === 'book' && (
            <div className="subprojects">
              <h3 className="neon-text">Chapters:</h3>
              <button onClick={() => addSubproject(project.id)} className="retro-button">Add Chapter</button>
              {project.subprojects.map((subproject) => (
                <div key={subproject.id} className="subproject">
                  <h4 className="neon-text">{subproject.name}</h4>
                  <ProgressBar phases={subproject.phases} />
                  <div className="phases">
                    {subproject.phases.map((phase) => (
                      <div key={phase.id} className="phase">
                        <input
                          type="checkbox"
                          checked={phase.completed}
                          onChange={() => togglePhase(project.id, phase.id, subproject.id)}
                          className="retro-checkbox"
                        />
                        <span className={phase.completed ? 'completed' : ''}>{phase.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectTracker;