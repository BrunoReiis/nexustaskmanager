'use client';

import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Task, Priority } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onClick: (taskId: string) => void;
}

function TaskItem({ task, onToggle, onClick }: TaskItemProps) {
  const priorityColors: Record<Priority, "default" | "primary" | "success" | "warning" | "danger"> = {
    baixa: "default",
    media: "primary",
    alta: "warning",
    urgente: "danger"
  };

  const priorityLabels: Record<Priority, string> = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    urgente: "Urgente"
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'concluida';
  const isCompleted = task.status === 'concluida';

  return (
    <Card 
      isPressable
      onPress={() => onClick(task.id)}
      className={`mb-2 ${isCompleted ? 'opacity-60' : ''}`}
    >
      <CardBody className="p-3">
        <div className="flex items-start gap-3">
          <Checkbox
            isSelected={isCompleted}
            onValueChange={() => onToggle(task.id)}
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${isCompleted ? 'line-through text-default-400' : ''}`}>
              {task.title}
            </h3>
            
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {task.project && (
                <Chip
                  size="sm"
                  variant="flat"
                  style={{ backgroundColor: `${task.project.color}20`, color: task.project.color }}
                >
                  {task.project.name}
                </Chip>
              )}
              
              <Chip
                size="sm"
                color={priorityColors[task.priority]}
                variant="flat"
              >
                {priorityLabels[task.priority]}
              </Chip>

              {task.dueDate && (
                <Chip
                  size="sm"
                  color={isOverdue ? "danger" : "default"}
                  variant="flat"
                >
                  {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Chip>
              )}

              {task.tags?.map(tag => (
                <Chip key={tag} size="sm" variant="flat">
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onClickTask: (taskId: string) => void;
}

export default function TaskList({ tasks, onToggleTask, onClickTask }: TaskListProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const categorizedTasks = {
    overdue: tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < today && 
      t.status !== 'concluida'
    ),
    today: tasks.filter(t => {
      if (!t.dueDate || t.status === 'concluida') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }),
    upcoming: tasks.filter(t => {
      if (!t.dueDate || t.status === 'concluida') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate > today && dueDate <= nextWeek;
    }),
    noDate: tasks.filter(t => !t.dueDate && t.status !== 'concluida')
  };

  const renderSection = (title: string, tasks: Task[], showCount = true) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-default-600">
          {title}
          {showCount && (
            <Chip size="sm" variant="flat">
              {tasks.length}
            </Chip>
          )}
        </h3>
        <div>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onClick={onClickTask}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderSection('⚠️ Atrasadas', categorizedTasks.overdue)}
      {renderSection('📅 Hoje', categorizedTasks.today)}
      {renderSection('📆 Próximos Dias', categorizedTasks.upcoming)}
      {renderSection('📋 Sem Data', categorizedTasks.noDate)}
      
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-default-500">Nenhuma tarefa encontrada</p>
          <p className="text-sm text-default-400">Crie uma nova tarefa para começar</p>
        </div>
      )}
    </div>
  );
}
