'use client';

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { SearchIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface MainHeaderProps {
  onCreateTask: () => void;
}

export default function MainHeader({ onCreateTask }: MainHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="z-10 w-full border-b border-divider bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Date */}
        <div className="flex items-center gap-6">
          <span className="hidden text-sm text-default-500 md:block capitalize">
            {today}
          </span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[300px] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search tasks..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />

          <Button
            color="secondary"
            size="sm"
            className="px-6"
            onPress={onCreateTask}
          >
            + New Task
          </Button>
        </div>
      </div>
    </header>
  );
}
