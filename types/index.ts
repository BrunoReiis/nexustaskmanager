import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Priority = "baixa" | "media" | "alta" | "urgente";

export type TaskStatus = "pendente" | "em_progresso" | "concluida" | "cancelada";

export interface Project {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  projectId?: string;
  project?: Project;
  tags?: string[];
  assignedTo?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskFilter {
  projectId?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: "hoje" | "proximos" | "atrasadas" | "sem_data";
  tags?: string[];
  assignedTo?: string;
}
