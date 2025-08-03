"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { generateCounterCode } from "@/ai/flows/generate-counter-code";
import { CodeDisplay } from "@/components/code-display";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Please enter a description of at least 10 characters.",
  }),
});

export default function PyCoderClient() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedCode("");
    try {
      const result = await generateCounterCode({ description: values.description });
      if (result && result.code) {
        setGeneratedCode(result.code);
      } else {
        throw new Error("Failed to generate code. The AI returned an empty response.");
      }
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate Python code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center p-8">
          <h1 className="text-5xl font-headline font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-accent/80">
            PyCoder
          </h1>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Generate Python counter code snippets with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold">Counter Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., a counter that starts at 10, increments by 2, and cannot go above 20."
                        className="min-h-[120px] resize-y focus:ring-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the counter you want to create in plain English.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Code"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedCode && (
        <CodeDisplay code={generatedCode} filename="counter_script.py" />
      )}
    </div>
  );
}
