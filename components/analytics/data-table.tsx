'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Language-specific labels
const translations = {
  en: {
    download: 'Download',
    downloading: 'Downloading...',
    interactionsFound: 'interactions found',
    noInteractions: 'No interactions found.',
    page: 'Page',
    of: 'of',
  },
  ar: {
    download: 'تحميل',
    downloading: 'جاري التحميل...',
    interactionsFound: 'تفاعلات تم العثور عليها',
    noInteractions: 'لم يتم العثور على تفاعلات.',
    page: 'صفحة',
    of: 'من',
  },
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = translations[language as keyof typeof translations] || translations.en;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Fetch all interactions
      const response = await fetch('/api/analytics/store');
      const allData = await response.json();

      if (!allData.interactions) {
        throw new Error('Failed to fetch interactions');
      }

      // Convert data to text format with language-aware formatting
      const textContent = allData.interactions
        .map((row: any) => {
          const timestamp = new Date(row.timestamp).toLocaleString(
            language === 'ar' ? 'ar-SA' : undefined,
            {
              timeZone: 'Asia/Riyadh',
            }
          );

          const location = row.location
            ? `${row.location.city || ''}, ${row.location.country || ''}`
            : language === 'ar' ? 'غير معروف' : 'Unknown';

          if (language === 'ar') {
            return `التاريخ والوقت: ${timestamp}
المستخدم: ${row.userId}
الموقع: ${location}
اللغة: ${row.language}
السؤال: ${row.userInput}
الإجابة: ${row.assistantResponse}
----------------------------------------`;
          }

          return `Timestamp: ${timestamp}
User: ${row.userId}
Location: ${location}
Language: ${row.language}
Question: ${row.userInput}
Answer: ${row.assistantResponse}
----------------------------------------`;
        })
        .join('\n\n');

      // Create blob and download with proper text direction
      const blob = new Blob(['\ufeff', textContent], { // Add BOM for proper UTF-8 encoding
        type: 'text/plain;charset=utf-8',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-interactions-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center gap-2 bg-[#6b6291] hover:bg-[#6b6291]/90 text-white ${
            dir === 'rtl' ? 'flex-row-reverse' : ''
          }`}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? t.downloading : t.download}
        </Button>
        <div className="text-sm text-muted-foreground" dir={dir}>
          {table.getFilteredRowModel().rows.length} {t.interactionsFound}
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50/50 hover:bg-gray-50/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-gray-600"
                    dir={dir}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} dir={dir}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                  dir={dir}
                >
                  {t.noInteractions}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 text-sm text-muted-foreground" dir={dir}>
          {t.page} {table.getState().pagination.pageIndex + 1} {t.of}{' '}
          {table.getPageCount()}
        </div>
        <div className={`flex items-center space-x-6 lg:space-x-8 ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`flex items-center space-x-2 ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 lg:h-10 lg:w-10"
            >
              {dir === 'rtl' ? '>' : '<'}
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 lg:h-10 lg:w-10"
            >
              {dir === 'rtl' ? '<' : '>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
