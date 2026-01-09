'use client';

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Project } from "@/types";

interface MainSidebarProps {
  projects: Project[];
  selectedView: 'inbox' | 'home' | string; // string para projectId
  onViewChange: (view: string) => void;
}

export default function MainSidebar({
  projects,
  selectedView,
  onViewChange
}: MainSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'inbox', label: '📥 Inbox', count: 0 },
    { id: 'home', label: '🏠 Home', count: 0 },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-divider bg-background transition-all duration-300 z-30 ${isCollapsed ? 'w-16' : 'w-64'} overflow-hidden`}>
        <div className="flex h-full flex-col p-4">
          {/* Toggle Button */}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={() => setIsCollapsed(!isCollapsed)}
            className="mb-4 self-end"
          >
            {isCollapsed ? '→' : '←'}
          </Button>

          {/* Main Menu */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="mb-2 text-xs font-semibold text-default-500">MAIN</p>
            )}
            <div className="flex flex-col gap-1">
              {menuItems.map(item => (
                <Button
                  key={item.id}
                  variant={selectedView === item.id ? 'flat' : 'light'}
                  color={selectedView === item.id ? 'secondary' : 'default'}
                  className={`${isCollapsed ? 'min-w-0 px-2' : 'justify-start'}`}
                  onPress={() => onViewChange(item.id)}
                >
                  {isCollapsed ? (
                    <span className="text-xl leading-none">{item.label.split(' ')[0]}</span>
                  ) : (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <Chip size="sm" variant="flat">
                          {item.count}
                        </Chip>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="flex-1">
            {!isCollapsed && (
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-default-500">PROJECTS</p>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => {/* TODO: Open create project modal */}}
                >
                  +
                </Button>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {projects.length === 0 && !isCollapsed ? (
                <p className="py-4 text-center text-sm text-default-400">
                  No projects
                </p>
              ) : (
                projects.map(project => (
                  <Button
                    key={project.id}
                    variant={selectedView === project.id ? 'flat' : 'light'}
                    color={selectedView === project.id ? 'secondary' : 'default'}
                    className={`${isCollapsed ? 'min-w-0 px-2' : 'justify-start'}`}
                    onPress={() => onViewChange(project.id)}
                  >
                    {isCollapsed ? (
                      <div 
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                    ) : (
                      <>
                        <div 
                          className="h-3 w-3 rounded-full flex-shrink-0 mr-2"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="flex-1 text-left truncate">{project.name}</span>
                      </>
                    )}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Bottom Section */}
          {!isCollapsed && (
            <div className="border-t border-divider pt-4">
              <Button
                variant="light"
                className="w-full justify-start"
                onPress={() => {/* TODO: Go to reports */}}
              >
                📊 Reports
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer to prevent content from going under sidebar */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} />
    </>
  );
}
