import { PortalHeader } from "@/components/PortalHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";

const FEE_USD = 10;

export default function Apply() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/swiftwallet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phoneNumber }) });
      const payload = await response.json() as { success?: boolean; message?: string; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error || "Payment could not be started.");
      setMessage(payload.message || "Payment prompt sent to your phone.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment could not be started.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f2] text-[#102c28]"><PortalHeader /><main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16"><Link href="/" className="mb-8 inline-flex items-center text-sm font-bold text-[#5e766c]"><ArrowLeft className="mr-2 h-4 w-4" /> Back home</Link><div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"><section><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e77d51]">Secure Swift Wallet payment</p><h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#0d4b45] sm:text-5xl">Pay the disclosed fee.</h1><p className="mt-4 max-w-xl leading-7 text-[#70827a]">This prototype uses Swift Wallet to send a payment prompt to a Kenyan mobile number. The customer-facing amount is shown only in US dollars.</p><form onSubmit={handleSubmit} className="mt-9 max-w-xl rounded-[2rem] border border-[#dce7df] bg-white/80 p-6 shadow-[0_20px_50px_rgba(24,70,57,0.06)] sm:p-8"><label className="block text-sm font-extrabold text-[#0d4b45]">Kenyan M-Pesa number<input required value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} placeholder="07XXXXXXXX" pattern="(?:\\+?254|0)7[0-9]{8}" className="mt-2 h-13 w-full rounded-xl border border-[#d5e2da] bg-[#fbfcf9] px-4 text-base font-semibold text-[#30534a] outline-none focus:border-[#5eaa8a] focus:ring-2 focus:ring-[#b8dfc8]" /></label><div className="mt-5 rounded-2xl border border-[#dce7df] bg-[#f2f6f0] p-4"><div className="flex gap-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4a9275]" /><p className="text-xs leading-5 text-[#58756a]">Swift Wallet handles the local currency conversion privately on the server. No database is used and no payment credentials are stored in this site.</p></div></div>{message && <p className="mt-4 rounded-xl bg-[#eaf4ed] p-3 text-sm font-semibold text-[#2d725b]">{message}</p>}<Button disabled={isSubmitting} type="submit" className="mt-6 h-13 w-full rounded-xl bg-[#e77d51] text-base font-extrabold text-white hover:bg-[#d96d42]">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending payment prompt…</> : <>Continue to payment <ArrowRight className="ml-2 h-4 w-4" /></>}</Button></form></section><aside className="rounded-[2rem] bg-[#0d4b45] p-6 text-white shadow-[0_20px_50px_rgba(13,75,69,0.16)] sm:p-8 lg:sticky lg:top-28"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6b58f]">Amount due</p><p className="mt-4 text-5xl font-black tracking-[-0.06em]">${FEE_USD.toFixed(2)}</p><p className="mt-3 text-sm leading-6 text-[#bdd3c7]">One clearly disclosed service fee. The customer-facing experience does not display Kenyan shilling amounts.</p><div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm"><div className="flex items-center gap-3 text-[#d5e6dd]"><Check className="h-4 w-4 text-[#f6b58f]" /> No application fee</div><div className="flex items-center gap-3 text-[#d5e6dd]"><Check className="h-4 w-4 text-[#f6b58f]" /> No upfront tax or release charge</div><div className="flex items-center gap-3 text-[#d5e6dd]"><ShieldCheck className="h-4 w-4 text-[#f6b58f]" /> Swift Wallet secure prompt</div></div><p className="mt-8 text-[11px] leading-5 text-[#9fc0b1]">Before production use, verify lender licensing, fee disclosures, consumer consent, and Swift Wallet merchant approval.</p></aside></div></main></div>
  );
}
