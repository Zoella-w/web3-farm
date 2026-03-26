"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { Input } from "@/components/Input";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Home() {
  const [name, setName] = useLocalStorage<string>("name", "");
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Next.js 14 Template Demo
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            A minimal template with TypeScript, Tailwind CSS, and App Router.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Button Component Section */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
          </Card>

          {/* Input Component Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input & Hooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name (Stored in LocalStorage)</label>
                <Input
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Value from localStorage: <span className="font-mono">{name || "empty"}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Interactive State</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Button onClick={() => setCount(count - 1)} variant="outline">
                -
              </Button>
              <span className="text-2xl font-bold min-w-[3rem] text-center">{count}</span>
              <Button onClick={() => setCount(count + 1)} variant="outline">
                +
              </Button>
              <Button onClick={() => setCount(0)} variant="secondary" className="ml-auto">
                Reset
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
