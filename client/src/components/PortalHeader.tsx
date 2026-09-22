import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export function PortalHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce7df]/80 bg-[#f7f8f2]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="ClearPath Loans home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0d4b45] text-[#f6b58f] shadow-[0_8px_24px_rgba(13,75,69,0.18)] transition-transform duration-200 group-hover:-rotate-3">
            <span className="text-xl font-black tracking-[-0.1em]">CP</span>
          </span>
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-0.03em] text-[#0d4b45]">ClearPath</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#70827a]">Loans</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#52655d] md:flex">
          <a href="/#how-it-works" className="transition-colors hover:text-[#0d4b45]">How it works</a>
          <a href="/#rates" className="transition-colors hover:text-[#0d4b45]">Rates & fees</a>
          <a href="/#safety" className="transition-colors hover:text-[#0d4b45]">Safety</a>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hidden text-sm font-bold text-[#0d4b45] sm:block">My account</Link>
              <Button onClick={() => logout()} variant="outline" className="h-10 rounded-full border-[#cfded5] bg-white/50 px-4 text-[#0d4b45] hover:bg-white">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <Button onClick={startLogin} variant="outline" className="h-10 rounded-full border-[#cfded5] bg-white/50 px-4 font-bold text-[#0d4b45] hover:bg-white">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          )}
          <Link href={isAuthenticated ? "/apply" : "/apply"}>
            <Button className="h-10 rounded-full bg-[#e77d51] px-4 font-bold text-white shadow-[0_8px_20px_rgba(231,125,81,0.2)] hover:bg-[#d96d42]">
              Apply <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
