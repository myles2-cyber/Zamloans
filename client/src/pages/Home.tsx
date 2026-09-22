import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, Check, ChevronRight, CircleHelp, FileText, LockKeyhole, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { PortalHeader } from "@/components/PortalHeader";

const steps = [
  { number: "01", title: "Tell us what you need", text: "Share a few details about your income and the goal behind your loan." },
  { number: "02", title: "Review your quote", text: "See your total repayment, fees, and estimated instalment before you decide." },
  { number: "03", title: "Get a decision", text: "Your application is reviewed securely. There is no payment required to apply." },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [amount, setAmount] = useState(8000);
  const [term, setTerm] = useState(6);
  const monthly = useMemo(() => Math.round((amount * (1 + 0.125 * (term / 12))) / term), [amount, term]);
  const total = monthly * term;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f2] text-[#102c28]">
      <PortalHeader />
      <main>
        <section className="relative px-5 pb-20 pt-12 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="soft-grid absolute inset-0 -z-0 opacity-70" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="max-w-2xl">
              <div className="rise-in mb-7 inline-flex items-center gap-2 rounded-full border border-[#cae1d7] bg-white/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#27695e] shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#e77d51]" />
                Simple borrowing, clearly explained
              </div>
              <h1 className="rise-in max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.07em] text-[#0d4b45] [animation-delay:80ms] sm:text-7xl">
                A clearer way to move <span className="text-[#e77d51]">forward.</span>
              </h1>
              <p className="rise-in mt-7 max-w-xl text-lg leading-8 text-[#5c7068] [animation-delay:140ms]">
                Flexible personal loans with the numbers up front. Explore a plan, understand the cost, and apply when it feels right for you.
              </p>
              <div className="rise-in mt-9 flex flex-col gap-3 sm:flex-row [animation-delay:200ms]">
                <Link href="/apply">
                  <Button className="h-14 w-full rounded-2xl bg-[#0d4b45] px-7 text-base font-bold text-white shadow-[0_16px_30px_rgba(13,75,69,0.18)] hover:bg-[#083c37] sm:w-auto">
                    Start an application <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="ghost" className="h-14 w-full rounded-2xl px-7 text-base font-bold text-[#0d4b45] hover:bg-white/70 sm:w-auto">
                    See how it works <ArrowDown className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#72847b]">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4b9c7b]" /> No application fee</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4b9c7b]" /> No upfront tax</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4b9c7b]" /> Secure sign-in</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mr-0">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#f6b58f]/45 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/80 bg-[#fffdf8] p-5 shadow-[0_28px_70px_rgba(24,70,57,0.14)] sm:p-7">
                <div className="mb-7 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a8d83]">Your example plan</p>
                    <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#0d4b45]">K{monthly.toLocaleString()}<span className="text-base font-bold text-[#71857c]"> / month</span></p>
                  </div>
                  <div className="rounded-2xl bg-[#e4f3e9] px-3 py-2 text-right text-xs font-bold text-[#2d725b]">
                    <span className="block text-[10px] uppercase tracking-[0.12em]">Example APR</span>
                    12.5%
                  </div>
                </div>
                <div className="space-y-7">
                  <label className="block">
                    <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>How much?</span><span className="text-[#0d4b45]">K{amount.toLocaleString()}</span></div>
                    <input aria-label="Loan amount" type="range" min="1000" max="25000" step="500" value={amount} onChange={event => setAmount(Number(event.target.value))} className="range-teal w-full" />
                    <div className="mt-2 flex justify-between text-xs font-semibold text-[#9aaba2]"><span>K1,000</span><span>K25,000</span></div>
                  </label>
                  <label className="block">
                    <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>Repayment period</span><span className="text-[#0d4b45]">{term} months</span></div>
                    <input aria-label="Repayment period" type="range" min="3" max="24" step="3" value={term} onChange={event => setTerm(Number(event.target.value))} className="range-coral w-full" />
                    <div className="mt-2 flex justify-between text-xs font-semibold text-[#9aaba2]"><span>3 months</span><span>24 months</span></div>
                  </label>
                </div>
                <div className="mt-8 rounded-2xl bg-[#f2f6f0] p-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-[#70827a]">Estimated total repayment</span><strong className="text-[#0d4b45]">K{total.toLocaleString()}</strong></div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#dce9de] pt-3 text-sm"><span className="text-[#70827a]">Application fee</span><strong className="text-[#2d725b]">K0</strong></div>
                </div>
                <Link href="/apply" className="mt-5 flex h-12 items-center justify-center rounded-xl bg-[#e77d51] text-sm font-extrabold text-white transition-colors hover:bg-[#d96d42]">Continue with this plan <ChevronRight className="ml-1 h-4 w-4" /></Link>
                <p className="mt-4 text-center text-[11px] leading-5 text-[#8a9b92]">Illustrative estimate only. Your final offer depends on eligibility and verification.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="safety" className="border-y border-[#dce7df] bg-[#eaf4ed] px-5 py-5 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2d8a68]" /><p className="text-sm leading-6 text-[#38695c]"><strong className="font-extrabold text-[#1b594d]">A safer borrowing promise.</strong> We never ask you to pay a tax, deposit, or “release fee” before your loan is approved.</p></div>
            <a href="#rates" className="shrink-0 text-sm font-extrabold text-[#1b594d] underline decoration-[#7eb99f] underline-offset-4">Read the fee guide</a>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e77d51]">Borrow with context</p><h2 className="mt-4 max-w-sm text-4xl font-black leading-tight tracking-[-0.06em] text-[#0d4b45]">Less guesswork. More confidence.</h2><p className="mt-5 max-w-sm leading-7 text-[#70827a]">A friendly application experience that gives you the information you need before you make a decision.</p></div>
              <div className="grid gap-4 sm:grid-cols-3">{steps.map(step => <div key={step.number} className="rounded-[1.5rem] border border-[#dce7df] bg-white/65 p-5 transition-transform duration-200 hover:-translate-y-1"><span className="text-xs font-black tracking-[0.18em] text-[#e77d51]">{step.number}</span><h3 className="mt-8 text-lg font-extrabold tracking-[-0.03em] text-[#0d4b45]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#71847b]">{step.text}</p></div>)}</div>
            </div>
          </div>
        </section>

        <section id="rates" className="bg-[#0d4b45] px-5 py-20 text-white lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#f6b58f]">What you will see</p><h2 className="mt-4 max-w-md text-4xl font-black leading-tight tracking-[-0.06em]">The full cost, before you accept.</h2><p className="mt-5 max-w-lg leading-7 text-[#bdd3c7]">Interest, fees, instalments, and total repayment are shown in one place. Government taxes, if legally applicable to a specific transaction, are explained separately and paid only through the appropriate official channel—not to unlock a loan.</p><Link href="/apply" className="mt-8 inline-flex items-center font-extrabold text-[#f6b58f]">Build your application <ArrowRight className="ml-2 h-4 w-4" /></Link></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ icon: WalletCards, title: "Straightforward quotes", text: "No hidden line items or surprise release charges." }, { icon: FileText, title: "Clear documents", text: "Review the agreement and repayment schedule first." }, { icon: LockKeyhole, title: "Protected account", text: "Sign in through managed OAuth with secure sessions." }, { icon: CircleHelp, title: "Human support", text: "Get answers before you commit to a plan." }].map(item => <div key={item.title} className="rounded-2xl border border-white/15 bg-white/[0.07] p-5"><item.icon className="h-5 w-5 text-[#f6b58f]" /><h3 className="mt-5 font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#bdd3c7]">{item.text}</p></div>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e77d51]">Ready when you are</p><h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-[#0d4b45] sm:text-5xl">Make your next step a clear one.</h2><p className="mx-auto mt-5 max-w-lg leading-7 text-[#70827a]">You can explore your options without committing. Applications are reviewed securely and there is never a fee to submit one.</p><div className="mt-8 flex justify-center gap-3"><Link href="/apply"><Button className="h-13 rounded-2xl bg-[#e77d51] px-7 font-extrabold text-white hover:bg-[#d96d42]">Apply for a loan <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>{!isAuthenticated && <Button onClick={startLogin} variant="ghost" className="h-13 rounded-2xl px-6 font-extrabold text-[#0d4b45] hover:bg-white">Sign in</Button>}</div></div>
        </section>
      </main>
      <footer className="border-t border-[#dce7df] px-5 py-8 text-center text-xs text-[#82948b] lg:px-8"><p>© 2026 ClearPath Loans. Prototype experience for demonstration purposes.</p><p className="mt-2">ClearPath is not Zambia Loan and is not affiliated with any third-party lender. Check local licensing and consumer-protection requirements before launch.</p></footer>
    </div>
  );
}
