'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import MainHeader from "@/components/main-page/MainHeader";
import MainSidebar from "@/components/main-page/MainSidebar";
import QuickStats from "@/components/main-page/QuickStats";
import QuickFilters from "@/components/main-page/QuickFilters";
import TaskList from "@/components/main-page/TaskList";
import { Task, Project, TaskFilter } from "@/types";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [selectedView, setSelectedView] = useState<string>('home');
  const [filter, setFilter] = useState<TaskFilter>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock data - substituir com dados reais do Firebase
  useEffect(() => {
    if (user) {
      // Mock de projetos
      setProjects([
        {
          id: '1',
          name: 'Trabalho',
          color: '#3b82f6',
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Pessoal',
          color: '#10b981',
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      // Mock de tarefas
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      setTasks([
        {
          id: '1',
          title: 'Revisar código do projeto',
          description: 'Revisar PR #123',
          status: 'pendente',
          priority: 'alta',
          dueDate: today,
          projectId: '1',
          project: projects[0],
          tags: ['code-review', 'urgente'],
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Reunião com cliente',
          status: 'pendente',
          priority: 'urgente',
          dueDate: yesterday,
          projectId: '1',
          project: projects[0],
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Comprar mantimentos',
          status: 'pendente',
          priority: 'media',
          dueDate: tomorrow,
          projectId: '2',
          project: projects[1],
          tags: ['casa'],
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Estudar Next.js',
          status: 'em_progresso',
          priority: 'media',
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          title: 'Escrever documentação',
          status: 'concluida',
          priority: 'baixa',
          dueDate: today,
          projectId: '1',
          project: projects[0],
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: new Date()
        }
      ]);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filtrar tarefas baseado no filtro ativo
  const filteredTasks = tasks.filter(task => {
    if (filter.projectId && task.projectId !== filter.projectId) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.status && task.status !== filter.status) return false;
    
    if (filter.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (filter.dueDate) {
        case 'hoje':
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        
        case 'proximos':
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          return dueDate > today && dueDate <= nextWeek;
        
        case 'atrasadas':
          if (!task.dueDate) return false;
          return new Date(task.dueDate) < today && task.status !== 'concluida';
        
        case 'sem_data':
          return !task.dueDate;
      }
    }
    
    return true;
  });

  // Calcular estatísticas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    completedToday: tasks.filter(t => {
      if (!t.completedAt || t.status !== 'concluida') return false;
      const completedDate = new Date(t.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length,
    
    overdue: tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < today && 
      t.status !== 'concluida'
    ).length,
    
    forToday: tasks.filter(t => {
      if (!t.dueDate || t.status === 'concluida') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length,
    
    highPriority: tasks.filter(t => 
      (t.priority === 'alta' || t.priority === 'urgente') && 
      t.status !== 'concluida'
    ).length
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'concluida' ? 'pendente' : 'concluida';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'concluida' ? new Date() : undefined
        };
      }
      return task;
    }));
  };

  const handleClickTask = (taskId: string) => {
    console.log('Abrir modal de tarefa:', taskId);
    // TODO: Implementar modal de edição de tarefa
  };

  const handleCreateTask = () => {
    console.log('Criar nova tarefa');
    // TODO: Implementar modal de criação de tarefa
  };

  const handleStatClick = (stat: string) => {
    const filterMap: Record<string, Partial<TaskFilter>> = {
      'completed': { status: 'concluida' },
      'overdue': { dueDate: 'atrasadas' },
      'today': { dueDate: 'hoje' },
      'high-priority': { priority: 'alta' }
    };
    
    setFilter({ ...filter, ...filterMap[stat] });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader onCreateTask={handleCreateTask} />
      
      <div className="flex flex-1">
        <MainSidebar
          projects={projects}
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-7xl space-y-6">
            <QuickStats
              completedToday={stats.completedToday}
              overdue={stats.overdue}
              forToday={stats.forToday}
              highPriority={stats.highPriority}
              onStatClick={handleStatClick}
            />

            <QuickFilters
              filter={filter}
              projects={projects}
              onFilterChange={setFilter}
              onClearFilters={() => setFilter({})}
            />

            <TaskList
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onClickTask={handleClickTask}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
