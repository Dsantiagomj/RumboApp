import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      {/* Header with theme toggle */}
      <div className="container mx-auto flex items-center justify-between p-8">
        <h1 className="text-foreground text-2xl font-bold">Rumbo</h1>
        <ThemeToggle />
      </div>

      {/* Design system showcase */}
      <div className="container mx-auto max-w-4xl space-y-12 p-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-foreground text-5xl font-bold">AI-Powered Life Assistant</h2>
          <p className="text-muted-foreground text-xl">
            Navigate your financial journey with intelligent guidance
          </p>
        </div>

        {/* Button variants */}
        <div className="border-border bg-card space-y-4 rounded-lg border p-8">
          <h3 className="text-card-foreground text-2xl font-semibold">Design System</h3>
          <p className="text-muted-foreground">
            Purple theme with oklch colors, Inter font, and Shadcn/ui components
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-muted-foreground mb-3 text-sm font-medium">Button Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h4 className="text-muted-foreground mb-3 text-sm font-medium">Button Sizes</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <span className="text-xl">+</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Color palette */}
        <div className="border-border bg-card space-y-4 rounded-lg border p-8">
          <h3 className="text-card-foreground text-2xl font-semibold">Financial Colors</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-[oklch(var(--positive))]" />
              <p className="text-sm font-medium">Positive (Green)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-[oklch(var(--negative))]" />
              <p className="text-sm font-medium">Negative (Red)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-[oklch(var(--neutral))]" />
              <p className="text-sm font-medium">Neutral (Gray-blue)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-[oklch(var(--warning))]" />
              <p className="text-sm font-medium">Warning (Amber)</p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="border-border bg-card space-y-4 rounded-lg border p-8">
          <h3 className="text-card-foreground text-2xl font-semibold">Typography</h3>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <p className="text-base">
              Body text with Inter font family. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit.
            </p>
            <p className="text-muted-foreground text-sm">Muted text for secondary information</p>
            <p className="text-2xl font-bold tabular-nums">$1,234,567.89</p>
            <p className="text-muted-foreground text-xs">
              Financial numbers use tabular-nums for alignment
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
