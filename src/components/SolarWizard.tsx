import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Check, Zap, Home, Building2, Warehouse, Sun, TrendingUp, Clock, Loader2, Download, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type RoofSpace = "small" | "medium" | "large";
type PhaseType = "single" | "three";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  whatsapp: z.string().trim().min(10, "Enter a valid WhatsApp number").max(20),
});

// Pricing model (Pakistan, approximate)
// Avg PKR/unit ≈ 50. 1 kW ≈ ~120 units/month generation.
function calculate(monthlyBill: number, roof: RoofSpace, phase: PhaseType) {
  const unitsConsumed = monthlyBill / 50; // rough units
  let recommendedKw = Math.max(3, Math.round((unitsConsumed / 120) * 1.1));

  // Constrain by roof
  const roofCap = roof === "small" ? 5 : roof === "medium" ? 10 : 20;
  recommendedKw = Math.min(recommendedKw, roofCap);

  // Three-phase recommended for >5kW
  if (phase === "single" && recommendedKw > 5) recommendedKw = 5;

  // Net-metering savings: ~85% of bill at recommended size
  const monthlySavings = Math.round(monthlyBill * 0.85);

  // System cost: ~PKR 160,000 per kW
  const systemCost = recommendedKw * 160000;
  const paybackYears = +(systemCost / (monthlySavings * 12)).toFixed(1);

  return { recommendedKw, monthlySavings, paybackYears, systemCost };
}

const stepLabels = ["Bill", "Roof", "Phase", "Results", "Proposal"];

export function SolarWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [bill, setBill] = useState<number>(25000);
  const [roof, setRoof] = useState<RoofSpace | null>(null);
  const [phase, setPhase] = useState<PhaseType | null>(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!roof || !phase) return null;
    return calculate(bill, roof, phase);
  }, [bill, roof, phase]);

  const canNext =
    (step === 0 && bill > 0) ||
    (step === 1 && roof !== null) ||
    (step === 2 && phase !== null) ||
    step === 3;

  const handleSubmit = async () => {
    const parsed = leadSchema.safeParse({ name, whatsapp });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!result || !roof || !phase) return;
    setSubmitting(true);
    const { error } = await supabase.from("solar_leads").insert({
      name: parsed.data.name,
      whatsapp: parsed.data.whatsapp,
      monthly_bill: bill,
      roof_space: roof,
      phase_type: phase,
      system_size_kw: result.recommendedKw,
      monthly_savings: result.monthlySavings,
      payback_years: result.paybackYears,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't save your details. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Proposal request received! Our team will WhatsApp you within 2 hours.");
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {Math.min(step + 1, stepLabels.length)} of {stepLabels.length} · {stepLabels[step]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Progress value={((step + 1) / stepLabels.length) * 100} className="h-1.5 mb-8" />

      <div className="min-h-[340px]">
        <AnimatePresence mode="wait">
          {/* STEP 0 — Bill */}
          {step === 0 && (
            <motion.div
              key="bill"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-2xl font-bold text-navy mb-2">
                What's your average monthly electricity bill?
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Drag the slider to your typical bill in PKR.
              </p>

              <div className="bg-gradient-night rounded-2xl p-6 text-navy-foreground mb-6">
                <div className="text-xs uppercase tracking-wider text-primary-glow font-semibold mb-1">
                  Monthly bill
                </div>
                <div className="font-display text-5xl font-bold tabular-nums">
                  PKR {bill.toLocaleString()}
                </div>
              </div>

              <Slider
                value={[bill]}
                onValueChange={(v) => setBill(v[0])}
                min={5000}
                max={300000}
                step={1000}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5,000</span>
                <span>150,000</span>
                <span>300,000+</span>
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Roof */}
          {step === 1 && (
            <motion.div
              key="roof"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-2xl font-bold text-navy mb-2">
                How much roof space is available?
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Pick the closest match to your rooftop area.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: "small", icon: Home, title: "Small", desc: "Up to 5 kW · ~400 sqft" },
                  { id: "medium", icon: Building2, title: "Medium", desc: "5–10 kW · ~800 sqft" },
                  { id: "large", icon: Warehouse, title: "Large", desc: "10 kW+ · 1500+ sqft" },
                ] as const).map((opt) => {
                  const Icon = opt.icon;
                  const active = roof === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setRoof(opt.id)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                        active
                          ? "border-primary bg-primary/5 shadow-orange"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      {active && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <Icon className={`h-7 w-7 mb-3 ${active ? "text-primary" : "text-navy"}`} />
                      <div className="font-display font-bold text-navy">{opt.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Phase */}
          {step === 2 && (
            <motion.div
              key="phase"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display text-2xl font-bold text-navy mb-2">
                What's your current connection phase?
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Check your meter or recent bill if unsure.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { id: "single", title: "Single Phase", desc: "Most homes · Up to 5 kW", icon: Zap },
                  { id: "three", title: "Three Phase", desc: "Larger homes & commercial", icon: Zap },
                ] as const).map((opt) => {
                  const Icon = opt.icon;
                  const active = phase === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPhase(opt.id)}
                      className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                        active
                          ? "border-primary bg-primary/5 shadow-orange"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      {active && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <Icon className={`h-7 w-7 mb-3 ${active ? "text-primary" : "text-navy"}`} />
                      <div className="font-display font-bold text-navy">{opt.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Results */}
          {step === 3 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary-deep text-xs font-semibold mb-3">
                  <Sparkles className="h-3 w-3" /> Your custom solar plan
                </div>
                <h3 className="font-display text-2xl font-bold text-navy">
                  Here's what we recommend
                </h3>
              </div>

              <div className="space-y-3">
                <ResultCard
                  icon={Sun}
                  label="Recommended System Size"
                  value={`${result.recommendedKw} kW`}
                  accent
                />
                <ResultCard
                  icon={TrendingUp}
                  label="Estimated Monthly Savings"
                  value={`PKR ${result.monthlySavings.toLocaleString()}`}
                />
                <ResultCard
                  icon={Clock}
                  label="Payback Period"
                  value={`${result.paybackYears} years`}
                />
              </div>

              <div className="mt-5 p-4 rounded-xl bg-accent border border-primary/20 text-center">
                <p className="text-sm text-navy">
                  <span className="font-bold">Lifetime savings:</span>{" "}
                  PKR {(result.monthlySavings * 12 * 25).toLocaleString()} over 25 years
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Lead capture */}
          {step === 4 && !submitted && (
            <motion.div
              key="lead"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="font-display text-2xl font-bold text-navy">
                  Get your detailed proposal
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Free PDF with full equipment specs, financing options, and net-metering payback breakdown — sent directly to your WhatsApp.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-navy font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Khan"
                    className="mt-1.5 h-11"
                    maxLength={80}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp" className="text-navy font-medium">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+92 300 1234567"
                    type="tel"
                    className="mt-1.5 h-11"
                    maxLength={20}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                🔒 We'll only contact you about your solar proposal. No spam, ever.
              </p>
            </motion.div>
          )}

          {/* Confirmation */}
          {step === 4 && submitted && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-6"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-sun flex items-center justify-center shadow-orange mb-5">
                <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy mb-2">
                You're all set, {name.split(" ")[0]}!
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Your detailed proposal is on its way to your WhatsApp. Our solar consultant will reach out within 2 business hours.
              </p>
              <Button onClick={onClose} variant="outline" className="border-navy text-navy">
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {!submitted && (
        <div className="flex items-center justify-between mt-8 pt-5 border-t">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange h-11 px-6 font-semibold"
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : step === 3 ? (
            <Button
              onClick={() => setStep(4)}
              className="bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange h-11 px-6 font-semibold"
            >
              Get Detailed Proposal <Download className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange h-11 px-6 font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>Send My Proposal <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  icon: Icon, label, value, accent = false,
}: { icon: typeof Sun; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
        accent ? "bg-gradient-sun border-transparent text-primary-foreground shadow-orange" : "bg-card border-border"
      }`}
    >
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${
        accent ? "bg-white/20" : "bg-accent text-primary-deep"
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className={`text-xs uppercase tracking-wider font-semibold ${
          accent ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}>
          {label}
        </div>
        <div className={`font-display text-2xl font-bold tabular-nums ${
          accent ? "" : "text-navy"
        }`}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}
