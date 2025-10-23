import { ThemeToggle } from '@/components/theme-toggle';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Minha Loja</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          Hi
        </div>
      </main>
    </div>
  );
}

export default App;
