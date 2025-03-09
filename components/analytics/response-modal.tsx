'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ResponseModalProps {
  response: string;
}

export function ResponseModal({ response }: ResponseModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="max-w-[260px] truncate text-muted-foreground">
        {response}
      </div>
      <Button
        variant="ghost"
        className="px-2 h-6 text-xs hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        See more
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">AI Response</DialogTitle>
          </DialogHeader>
          <div className="text-base whitespace-pre-wrap">{response}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
