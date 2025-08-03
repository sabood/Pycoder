"use client";

import { Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CodeDisplayProps {
  code: string;
  filename: string;
  className?: string;
}

export function CodeDisplay({ code, filename, className }: CodeDisplayProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The Python code has been copied.",
        });
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <Card className={cn("shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 bg-muted/50 rounded-t-lg border-b">
        <CardTitle className="text-sm font-code font-semibold">{filename}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy code">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download code">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-auto max-h-[500px] w-full">
          <pre className="font-code text-sm leading-relaxed">
            <div className="flex">
              <div className="select-none text-right pr-4 pl-2 py-4 text-muted-foreground/50">
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>
              <code className="block flex-1 p-4 overflow-x-auto">{code}</code>
            </div>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
