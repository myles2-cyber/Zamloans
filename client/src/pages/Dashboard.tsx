import { useAuth } from "@/_core/hooks/useAuth";
import { PortalHeader } from "@/components/PortalHeader";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, Clock3, FileText, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const statusCopy = {
  submitted: { label: "Received", note: "Your application is in our queue.", icon: Check, tone: "bg-[#e4f3e9] text-[#2d725b]" },
  under_review: { label: "Under review", note: "We are reviewing the details you shared.", icon: Clock3, tone: "bg-[#fff2db] text-[#a76a1d]" },
  approved: { label: "Offer ready", note: "Your offer is ready for you to review.", icon: Check, tone: "bg-[#e4f3e9] text-[#2d725b]" },
  declined: { label: "Not approved", note: "We could not approve this application at this time.", icon: FileText, tone: "bg-[#fff0ea] text-[#b64d2e]" },
} as const;

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const auth = trpc.auth.me.useQuery();
  const applications = trpc.loans.mine.useQuery(undefined, { enabled: Boolean(auth.data) });
  const latest = applications.data?.[0];

  if (loading || auth.isLoading) return <div className="grid min-h-screen place-items-center bg-[#f7f8f2] text-[#0d4b45]"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAuthenticated || !auth.data) return <div className="min-h-screen bg-[#f7f8f2] text-[#102c28]"><PortalHeader /><main className="mx-auto max-w-xl px-5 py-20 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#2d8a68]" /><h1 className="mt-6 text-3xl font-black text-[#0d4b45]">Your account is private</h1><p className="mt-3 text-[#70827a]">Sign in to view saved applications and updates.</p><Link href="/apply" className="mt-7 inline-flex h-12 items-center rounded-xl bg-[#0d4b45] px-6 font-bold text-white">Go to application <ArrowRight className="ml-2 h-4 w-4" /></Link></main></div>;

  const displayUser = user ?? auth.data;
  const meta = latest ? statusCopy[latest.status] : null;
  const StatusIcon = meta?.icon ?? FileText;

  return (
    <div className="min-h-screen bg-[#f7f8f2] text-[#102c28]"><PortalHeader /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e77d51]">Borrower dashboard</p><h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#0d4b45]">Good to see you, {displayUser?.name?.split(" ")[0] || "there"}.</h1><p className="mt-3 text-[#70827a]">Your application details and updates live here.</p></div><Link href="/apply"><Button className="h-12 rounded-xl bg-[#e77d51] font-extrabold text-white hover:bg-[#d96d42]">New application <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[#dce7df] bg-white/80 p-6 shadow-[0_20px_50px_rgba(24,70,57,0.06)] sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#7c9187]">Latest application</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#0d4b45]">{latest ? `Application #${latest.id}` : "No application yet"}</h2></div>{meta && <span className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold ${meta.tone}`}><StatusIcon className="h-3.5 w-3.5" /> {meta.label}</span>}</div>
          {latest ? <><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#f2f6f0] p-4"><p className="text-xs font-bold text-[#82948b]">Requested</p><p className="mt-2 text-xl font-black text-[#0d4b45]">K{Number(latest.requestedAmount).toLocaleString()}</p></div><div className="rounded-2xl bg-[#f2f6f0] p-4"><p className="text-xs font-bold text-[#82948b]">Term</p><p className="mt-2 text-xl font-black text-[#0d4b45]">{latest.termMonths} months</p></div><div className="rounded-2xl bg-[#f2f6f0] p-4"><p className="text-xs font-bold text-[#82948b]">Submitted</p><p className="mt-2 text-xl font-black text-[#0d4b45]">{new Date(latest.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p></div></div><div className="mt-7 rounded-2xl border border-[#dce7df] p-4"><div className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#e77d51]" /><div><p className="text-sm font-extrabold text-[#0d4b45]">{meta?.note}</p><p className="mt-1 text-sm leading-6 text-[#72847b]">We will update this dashboard when there is progress. You do not need to pay anything to move your application forward.</p></div></div></div></> : <div className="mt-10 rounded-2xl border border-dashed border-[#cbded2] bg-[#f8fbf7] p-8 text-center"><FileText className="mx-auto h-8 w-8 text-[#87aa99]" /><p className="mt-4 font-extrabold text-[#0d4b45]">Your first application starts here.</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#72847b]">Create an application to see your plan and status in this dashboard.</p><Link href="/apply" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0d4b45] px-5 text-sm font-extrabold text-white">Start now <ArrowRight className="ml-2 h-4 w-4" /></Link></div>}
        </section>
        <aside className="rounded-[2rem] bg-[#0d4b45] p-6 text-white sm:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><ShieldCheck className="h-5 w-5 text-[#f6b58f]" /></div><h2 className="mt-6 text-2xl font-black tracking-[-0.04em]">Your information stays yours.</h2><p className="mt-4 text-sm leading-7 text-[#bdd3c7]">ClearPath uses managed sign-in and protected sessions. We do not display or store raw passwords in this application.</p><div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm"><div className="flex items-center gap-3 text-[#d5e6dd]"><Check className="h-4 w-4 text-[#f6b58f]" /> Secure account session</div><div className="flex items-center gap-3 text-[#d5e6dd]"><Check className="h-4 w-4 text-[#f6b58f]" /> Transparent application record</div><div className="flex items-center gap-3 text-[#d5e6dd]"><Check className="h-4 w-4 text-[#f6b58f]" /> No advance-fee loan requests</div></div><a href="mailto:support@clearpath.example" className="mt-8 inline-flex items-center text-sm font-extrabold text-[#f6b58f]">Contact support <MessageCircle className="ml-2 h-4 w-4" /></a></aside>
      </div>
      <section className="mt-8 rounded-2xl border border-[#dce7df] bg-[#eaf4ed] p-5"><p className="text-sm leading-6 text-[#38695c]"><strong className="text-[#1b594d]">Important:</strong> ClearPath Loans is a product prototype. Before accepting real applications, add verified lender licensing, legal disclosures, credit-decision policies, privacy terms, and a regulated payment/disbursement provider.</p></section>
    </main></div>
  );
}
