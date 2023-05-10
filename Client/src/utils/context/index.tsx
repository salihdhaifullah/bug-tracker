import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null)as any;

const TasksDispatchContext = createContext(null)as any;

export function TasksProvider({ children }: any) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks: sac[], action: any) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        title: action.title,
        error: action.error
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

interface sac {
  id: string;
  title: string;
  error: boolean;
};

const initialTasks: sac[] = [
  { id: "0", title: 'Philosopher’s Path', error: true },
  { id: "1", title: 'Visit the temple', error: false },
  { id: "2", title: 'Drink matcha', error: false }
];
