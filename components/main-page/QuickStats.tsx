'use client';

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

// Ícones SVG
const CheckIcon = () => (
  <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-8 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-8 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z" />
  </svg>
);

interface StatCardProps {
  title: string;
  count: number;
  color: "success" | "danger" | "primary" | "warning";
  icon: React.ReactNode;
  onClick?: () => void;
}

function StatCard({ title, count, color, icon, onClick }: StatCardProps) {
  return (
    <Card 
      isPressable={!!onClick}
      onPress={onClick}
      className="hover:scale-105 transition-transform"
    >
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-default-500">{title}</span>
          <span className="text-2xl font-bold">{count}</span>
        </div>
        <Chip
          color={color}
          variant="flat"
          size="lg"
          classNames={{
            base: "w-12 h-12",
            content: "p-0 flex items-center justify-center"
          }}
        >
          {icon}
        </Chip>
      </CardBody>
    </Card>
  );
}

interface QuickStatsProps {
  completedToday: number;
  overdue: number;
  forToday: number;
  highPriority: number;
  onStatClick?: (stat: 'completed' | 'overdue' | 'today' | 'high-priority') => void;
}

export default function QuickStats({
  completedToday,
  overdue,
  forToday,
  highPriority,
  onStatClick
}: QuickStatsProps) {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-semibold">Quick Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Completed Today"
          count={completedToday}
          color="success"
          icon={<CheckIcon />}
          onClick={() => onStatClick?.('completed')}
        />
        <StatCard
          title="Overdue"
          count={overdue}
          color="danger"
          icon={<AlertIcon />}
          onClick={() => onStatClick?.('overdue')}
        />
        <StatCard
          title="For Today"
          count={forToday}
          color="primary"
          icon={<CalendarIcon />}
          onClick={() => onStatClick?.('today')}
        />
        <StatCard
          title="High Priority"
          count={highPriority}
          color="warning"
          icon={<FireIcon />}
          onClick={() => onStatClick?.('high-priority')}
        />
      </div>
    </div>
  );
}
