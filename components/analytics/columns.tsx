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
import { useLanguage } from '@/contexts/language-context';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MapPin, MoreHorizontal } from 'lucide-react';
import { ResponseModal } from './response-modal';

// Column translations
const columnLabels = {
  en: {
    source: 'Source',
    language: 'Language',
    response: 'Response',
    userInput: 'User Input',
    user: 'User',
    time: 'Time',
    actions: 'Actions',
    unknown: 'Unknown',
    copyId: 'Copy Interaction ID',
    copyThreadId: 'Copy Thread ID',
    copyResponse: 'Copy Full Response',
  },
  ar: {
    source: 'المصدر',
    language: 'اللغة',
    response: 'الرد',
    userInput: 'سؤال المستخدم',
    user: 'المستخدم',
    time: 'الوقت',
    actions: 'الإجراءات',
    unknown: 'غير معروف',
    copyId: 'نسخ معرف التفاعل',
    copyThreadId: 'نسخ معرف المحادثة',
    copyResponse: 'نسخ الرد الكامل',
  },
};

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
    header: ({ table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return (
        <div className="font-medium">
          <Badge variant="outline" className="bg-gray-50">
            {t.source}
          </Badge>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">
        <Badge variant="outline" className="bg-gray-50">
          {row.getValue('source')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'language',
    header: ({ column, table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0"
        >
          {t.language}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <Badge variant="secondary" className="font-medium">
          {row.getValue('language')}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'assistantResponse',
    header: ({ table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return t.response;
    },
    cell: ({ row }) => {
      const text = row.getValue('assistantResponse') as string;
      return <ResponseModal response={text} />;
    },
  },
  {
    accessorKey: 'userInput',
    header: ({ column, table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0"
        >
          {t.userInput}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const text = row.getValue('userInput') as string;
      const { language } = useLanguage();
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      return (
        <div
          className="max-w-[300px] truncate font-medium"
          title={text}
          dir={dir}
        >
          {text}
        </div>
      );
    },
  },
  {
    accessorKey: 'userId',
    header: ({ table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return t.user;
    },
    cell: ({ row }) => {
      const location = row.original.location;
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      return (
        <div className="font-medium space-y-1" dir={dir}>
          <Badge variant="outline" className="rounded-sm">
            {row.getValue('userId')}
          </Badge>
          {location && (location.city || location.country) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {location.city && location.country
                  ? `${location.city}, ${location.country}`
                  : location.city || location.country || t.unknown}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column, table }) => {
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent px-0"
        >
          {t.time}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue('timestamp'));
      const { language } = useLanguage();
      const dir = language === 'ar' ? 'rtl' : 'ltr';

      const formattedDate = timestamp.toLocaleDateString(
        language === 'ar' ? 'ar-SA' : undefined,
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'Asia/Riyadh',
        }
      );

      const formattedTime = timestamp.toLocaleTimeString(
        language === 'ar' ? 'ar-SA' : undefined,
        {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Riyadh',
        }
      );

      return (
        <div className="font-medium" dir={dir}>
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
      const { language } = useLanguage();
      const t = columnLabels[language as keyof typeof columnLabels] || columnLabels.en;
      const dir = language === 'ar' ? 'rtl' : 'ltr';

      return (
        <div dir={dir}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t.actions}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(interaction.id)}
                className="cursor-pointer"
              >
                {t.copyId}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(interaction.threadId)
                }
                className="cursor-pointer"
              >
                {t.copyThreadId}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(interaction.assistantResponse)
                }
                className="cursor-pointer"
              >
                {t.copyResponse}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
