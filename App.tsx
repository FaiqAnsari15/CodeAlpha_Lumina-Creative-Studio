
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, User, Project, Task, TaskStatus, Priority } from './types';
import Layout from './components/Layout';
import KanbanBoard from './components/KanbanBoard';
import AuthPage from './components/Auth';

const initialState: AppState = {
  user: null,
  projects: [],
  tasks: [],
  notifications: [],
  activeProjectId: null,
  isLoading: true
};

type Action = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_ACTIVE_PROJECT'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'SET_LOADING'; payload: boolean };

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload, isLoading: false };
    case 'SET_PROJECTS': return { ...state, projects: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload };
    case 'SET_ACTIVE_PROJECT': return { ...state, activeProjectId: action.payload };
    case 'ADD_TASK': return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
    };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    default: return state;
  }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadAppData = () => {
      const storedUser = localStorage.getItem('lumina_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });

        const mockProjects: Project[] = [
          { id: 'p1', name: 'Brand Identity: Zenith', description: 'Visual refresh for Zenith Corp', ownerId: user.id, members: [], createdAt: new Date().toISOString() },
          { id: 'p2', name: 'Studio Portfolio v2', description: 'Immersive WebGL portfolio', ownerId: user.id, members: [], createdAt: new Date().toISOString() }
        ];

        const mockTasks: Task[] = [
          { id: 't1', projectId: 'p1', title: 'Logo Exploration', description: 'Create 10 distinct concept sketches for the primary mark.', status: TaskStatus.TODO, priority: Priority.HIGH, assigneeId: user.id, createdAt: new Date().toISOString(), comments: [], labels: ['Creative'] },
          { id: 't2', projectId: 'p1', title: 'Typography System', description: 'Select primary and secondary typeface pairings.', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: user.id, createdAt: new Date().toISOString(), comments: [], labels: ['Design'] },
          { id: 't3', projectId: 'p2', title: 'Asset Optimization', description: 'Export all 3D models with proper glTF compression.', status: TaskStatus.REVIEW, priority: Priority.URGENT, assigneeId: user.id, createdAt: new Date().toISOString(), comments: [], labels: ['Technical'] }
        ];

        dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
        dispatch({ type: 'SET_TASKS', payload: mockTasks });
        dispatch({ type: 'SET_ACTIVE_PROJECT', payload: 'p1' });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    setTimeout(loadAppData, 800);
  }, []);

  if (state.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-indigo-950">
        <div className="w-16 h-16 lumina-gradient rounded-full animate-pulse mb-4 shadow-2xl shadow-emerald-500/20"></div>
        <p className="text-emerald-400 font-bold tracking-widest text-xs uppercase">Illuminating Workspace...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Routes>
          <Route path="/auth" element={!state.user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/" element={state.user ? <Layout /> : <Navigate to="/auth" />}>
            <Route index element={<KanbanBoard />} />
            <Route path="project/:projectId" element={<KanbanBoard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
