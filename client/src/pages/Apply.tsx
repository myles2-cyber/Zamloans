import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { PortalHeader } from "@/components/PortalHeader";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

export default function Apply() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const submitApplication = trpc.loans.submit.useMutation();
  const [amount, setAmount] = useState(8000);
  const [term, setTerm] = useState(6);
  const [purpose, setPurpose] = useState("Household expenses");
  const [monthlyIncome, setMonthlyIncome] = useState(9000);
  const [employmentStatus, setEmploymentStatus] = useState("Employed full-time");
  const [error, setError] = useState("");
  const monthly = useMemo(() => Math.round((amount * (1 + 0.125 * (term / 12))) / term), [amount, term]);
  const total = monthly * term;

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#f7f8f2] text-[#0d4b45]">Loading secure application…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f8f2] text-[#102c28]"><PortalHeader /><main className="mx-auto max-w-xl px-5 py-20 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#e4f3e9] text-[#2d8a68]"><ShieldCheck className="h-8 w-8" /></div><h1 className="mt-7 text-4xl font-black tracking-[-0.06em] text-[#0d4b45]">Sign in to continue</h1><p className="mt-4 leading-7 text-[#70827a]">Your application is saved to your secure borrower account. Sign in through the managed account portal to begin.</p><Button onClick={startLogin} className="mt-8 h-12 rounded-xl bg-[#0d4b45] px-7 font-bold text-white hover:bg-[#083c37]">Secure sign in <ArrowRight className="ml-2 h-4 w-4" /></Button><div><Link href="/" className="mt-6 inline-flex items-center text-sm font-bold text-[#0d4b45]"><ArrowLeft className="mr-2 h-4 w-4" /> Back home</Link></div></main></div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await submitApplication.mutateAsync({ requestedAmount: amount, termMonths: term, purpose, monthlyIncome, employmentStatus });
      setLocation("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not submit your application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] text-[#102c28]"><PortalHeader /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16"><div className="mb-10 flex items-center justify-between"><div><Link href="/" className="mb-5 inline-flex items-center text-sm font-bold text-[#5e766c]"><ArrowLeft className="mr-2 h-4 w-4" /> Back home</Link><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e77d51]">Application · Step 1 of 1</p><h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#0d4b45] sm:text-5xl">Build your plan.</h1><p className="mt-3 max-w-xl leading-7 text-[#70827a]">Tell us a little about what you need. This application is for eligibility review only and does not guarantee approval.</p></div><div className="hidden items-center gap-2 rounded-full bg-[#e4f3e9] px-4 py-2 text-xs font-extrabold text-[#2d725b] sm:flex"><ShieldCheck className="h-4 w-4" /> Private & secure</div></div>
      <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#dce7df] bg-white/80 p-5 shadow-[0_20px_50px_rgba(24,70,57,0.06)] sm:p-8">
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="block sm:col-span-2"><div className="mb-3 flex items-center justify-between text-sm font-extrabold"><span>Requested amount</span><span className="text-[#0d4b45]">K{amount.toLocaleString()}</span></div><input type="range" min="1000" max="25000" step="500" value={amount} onChange={event => setAmount(Number(event.target.value))} className="range-teal w-full" /><div className="mt-2 flex justify-between text-xs font-semibold text-[#9aaba2]"><span>K1,000</span><span>K25,000</span></div></label>
            <label className="block sm:col-span-2"><div className="mb-3 flex items-center justify-between text-sm font-extrabold"><span>Preferred term</span><span className="text-[#0d4b45]">{term} months</span></div><input type="range" min="3" max="24" step="3" value={term} onChange={event => setTerm(Number(event.target.value))} className="range-coral w-full" /><div className="mt-2 flex justify-between text-xs font-semibold text-[#9aaba2]"><span>3 months</span><span>24 months</span></div></label>
            <label className="block"><span className="mb-2 block text-sm font-extrabold">What is the loan for?</span><select value={purpose} onChange={event => setPurpose(event.target.value)} className="h-12 w-full rounded-xl border border-[#d5e2da] bg-[#fbfcf9] px-3 text-sm font-semibold text-[#30534a] outline-none focus:border-[#5eaa8a] focus:ring-2 focus:ring-[#b8dfc8]"><option>Household expenses</option><option>Education or training</option><option>Medical expenses</option><option>Business working capital</option><option>Emergency expense</option></select></label>
            <label className="block"><span className="mb-2 block text-sm font-extrabold">Monthly income</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8a9b92]">K</span><input required type="number" min="0" value={monthlyIncome} onChange={event => setMonthlyIncome(Number(event.target.value))} className="h-12 w-full rounded-xl border border-[#d5e2da] bg-[#fbfcf9] pl-8 pr-3 text-sm font-semibold text-[#30534a] outline-none focus:border-[#5eaa8a] focus:ring-2 focus:ring-[#b8dfc8]" /></div></label>
            <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-extrabold">Employment status</span><select value={employmentStatus} onChange={event => setEmploymentStatus(event.target.value)} className="h-12 w-full rounded-xl border border-[#d5e2da] bg-[#fbfcf9] px-3 text-sm font-semibold text-[#30534a] outline-none focus:border-[#5eaa8a] focus:ring-2 focus:ring-[#b8dfc8]"><option>Employed full-time</option><option>Employed part-time</option><option>Self-employed</option><option>Contractor</option><option>Other regular income</option></select></label>
          </div>
          <div className="mt-8 rounded-2xl border border-[#dce7df] bg-[#f2f6f0] p-4"><div className="flex gap-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4a9275]" /><p className="text-xs leading-5 text-[#58756a]">Any applicable statutory taxes or government charges will be disclosed with the final agreement and paid only through the relevant official process. ClearPath will never ask for a tax payment before loan disbursement.</p></div></div>
          {error && <p className="mt-4 rounded-xl bg-[#fff0ea] p-3 text-sm font-semibold text-[#b64d2e]">{error}</p>}
          <Button disabled={submitApplication.isPending} type="submit" className="mt-7 h-13 w-full rounded-xl bg-[#0d4b45] text-base font-extrabold text-white hover:bg-[#083c37]">{submitApplication.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting securely…</> : <>Submit application <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
          <p className="mt-4 text-center text-xs text-[#879990]">By continuing, you agree to review the disclosures and privacy notice before accepting any offer.</p>
        </form>

        <aside className="h-fit rounded-[2rem] bg-[#0d4b45] p-6 text-white shadow-[0_20px_50px_rgba(13,75,69,0.16)] sm:p-8 lg:sticky lg:top-28"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6b58f]">Your estimate</p><p className="mt-4 text-4xl font-black tracking-[-0.06em]">K{monthly.toLocaleString()}<span className="text-base font-bold text-[#b5d1c4]"> / month</span></p><div className="mt-8 space-y-4 text-sm"><div className="flex justify-between border-b border-white/10 pb-4"><span className="text-[#b5d1c4]">Amount</span><strong>K{amount.toLocaleString()}</strong></div><div className="flex justify-between border-b border-white/10 pb-4"><span className="text-[#b5d1c4]">Term</span><strong>{term} months</strong></div><div className="flex justify-between border-b border-white/10 pb-4"><span className="text-[#b5d1c4]">Illustrative APR</span><strong>12.5%</strong></div><div className="flex justify-between"><span className="text-[#b5d1c4]">Estimated total</span><strong>K{total.toLocaleString()}</strong></div></div><div className="mt-8 rounded-2xl bg-white/10 p-4"><div className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f6b58f]" /><p className="text-xs leading-5 text-[#d5e6dd]">No application fee. No upfront tax. No payment is needed to submit this application.</p></div></div><p className="mt-5 text-[11px] leading-5 text-[#9fc0b1]">This estimate is illustrative and may change after eligibility checks. A final offer, if available, will include the exact repayment schedule.</p></aside>
      </div>
    </main></div>
  );
}
