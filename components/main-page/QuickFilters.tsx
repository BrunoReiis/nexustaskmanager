'use client';

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { TaskFilter, Priority, Project } from "@/types";

interface QuickFiltersProps {
  filter: TaskFilter;
  projects: Project[];
  onFilterChange: (filter: TaskFilter) => void;
  onClearFilters: () => void;
}

export default function QuickFilters({
  filter,
  projects,
  onFilterChange,
  onClearFilters
}: QuickFiltersProps) {
  const hasActiveFilters = Object.values(filter).some(v => v !== undefined && v !== null);

  const priorities: Priority[] = ['baixa', 'media', 'alta', 'urgente'];
  const priorityLabels: Record<Priority, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente'
  };

  const dueDateOptions = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'proximos', label: 'Próximos 7 dias' },
    { key: 'atrasadas', label: 'Atrasadas' },
    { key: 'sem_data', label: 'Sem data' }
  ];

  return (
    <div className="w-full rounded-lg border border-divider bg-content1 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filtros Rápidos</h3>
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={onClearFilters}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Filtro de Projeto */}
        <Select
          label="Projeto"
          placeholder="Todos os projetos"
          size="sm"
          selectedKeys={filter.projectId ? [filter.projectId] : []}
          onChange={(e) => onFilterChange({ ...filter, projectId: e.target.value || undefined })}
        >
          {projects.map((project) => (
            <SelectItem key={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </Select>

        {/* Filtro de Prioridade */}
        <Select
          label="Prioridade"
          placeholder="Todas as prioridades"
          size="sm"
          selectedKeys={filter.priority ? [filter.priority] : []}
          onChange={(e) => onFilterChange({ ...filter, priority: e.target.value as Priority || undefined })}
        >
          {priorities.map((priority) => (
            <SelectItem key={priority}>
              {priorityLabels[priority]}
            </SelectItem>
          ))}
        </Select>

        {/* Filtro de Prazo */}
        <Select
          label="Prazo"
          placeholder="Todos os prazos"
          size="sm"
          selectedKeys={filter.dueDate ? [filter.dueDate] : []}
          onChange={(e) => onFilterChange({ 
            ...filter, 
            dueDate: e.target.value as TaskFilter['dueDate'] || undefined 
          })}
        >
          {dueDateOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        {/* Filtro de Status */}
        <Select
          label="Status"
          placeholder="Todos os status"
          size="sm"
          selectedKeys={filter.status ? [filter.status] : []}
          onChange={(e) => onFilterChange({ 
            ...filter, 
            status: e.target.value as TaskFilter['status'] || undefined 
          })}
        >
          <SelectItem key="pendente">
            Pendente
          </SelectItem>
          <SelectItem key="em_progresso">
            Em Progresso
          </SelectItem>
          <SelectItem key="concluida">
            Concluída
          </SelectItem>
        </Select>
      </div>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filter.projectId && (
            <Chip
              onClose={() => onFilterChange({ ...filter, projectId: undefined })}
              variant="flat"
              color="primary"
              size="lg"
              className="px-10"
            >
              Projeto: {projects.find(p => p.id === filter.projectId)?.name}
            </Chip>
          )}
          {filter.priority && (
            <Chip
              onClose={() => onFilterChange({ ...filter, priority: undefined })}
              variant="flat"
              color="warning"
              size="lg"
              className="px-3"
            >
              {priorityLabels[filter.priority]}
            </Chip>
          )}
          {filter.dueDate && (
            <Chip
              onClose={() => onFilterChange({ ...filter, dueDate: undefined })}
              variant="flat"
              color="secondary"
              size="lg"
              className="px-3"
            >
              {dueDateOptions.find(o => o.key === filter.dueDate)?.label}
            </Chip>
          )}
          {filter.status && (
            <Chip
              onClose={() => onFilterChange({ ...filter, status: undefined })}
              variant="flat"
              color="success"
              size="lg"
              className="px-3"
            >
              Status: {filter.status}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
