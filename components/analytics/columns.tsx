'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MapPin, MoreHorizontal } from 'lucide-react';
import { ResponseModal } from './response-modal';

export type Interaction = {
  id: string;
  userId: string;
  timestamp: string;
  userInput: string;
  assistantResponse: string;
  language: string;
  source: string;
  sessionId: string;
  threadId: string;
  location?: {
    city?: string;
    country?: string;
    countryCode?: string;
  };
};

export const columns: ColumnDef<Interaction>[] = [
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => (
      <div className="font-medium text-left">
        <Badge variant="outline" className="bg-gray-50">
          {row.getValue('source')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'language',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Language
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-left">
        <Badge variant="secondary" className="font-medium">
          {row.getValue('language')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'assistantResponse',
    header: 'Response',
    cell: ({ row }) => {
      const text = row.getValue('assistantResponse') as string;
      return <ResponseModal response={text} />;
    },
  },
  {
    accessorKey: 'userInput',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            User Input
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const text = row.getValue('userInput') as string;
      return (
        <div
          className="max-w-[300px] truncate font-medium text-left"
          title={text}
        >
          {text}
        </div>
      );
    },
  },
  {
    accessorKey: 'userId',
    header: 'User',
    cell: ({ row }) => {
      const location = row.original.location;
      return (
        <div className="font-medium text-left space-y-1">
          <Badge variant="outline" className="rounded-sm">
            {row.getValue('userId')}
          </Badge>
          {location && (location.city || location.country) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {location.city && location.country
                  ? `${location.city}, ${location.country}`
                  : location.city || location.country}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue('timestamp'));
      const formattedDate = timestamp.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = timestamp.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
      return (
        <div className="font-medium text-left">
          <div>{formattedTime}</div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const interaction = row.original;

      return (
        <div className="text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(interaction.id)}
                className="cursor-pointer"
              >
                Copy Interaction ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(interaction.threadId)
                }
                className="cursor-pointer"
              >
                Copy Thread ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(interaction.assistantResponse)
                }
                className="cursor-pointer"
              >
                Copy Full Response
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
