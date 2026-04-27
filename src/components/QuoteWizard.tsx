import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, TreePine, Sprout, Check, ArrowLeft, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

type ServiceType = "Lawn Mowing" | "Tree Trimming" | "Full Landscaping";
type YardSize = "Small" | "Medium" | "Large";

const services: { id: ServiceType; icon: typeof Scissors; desc: string }[] = [
  { id: "Lawn Mowing", icon: Scissors, desc: "Weekly or bi-weekly mowing, edging & cleanup" },
  { id: "Tree Trimming", icon: TreePine, desc: "Pruning, shaping & safe removal" },
  { id: "Full Landscaping", icon: Sprout, desc: "Design, planting & complete yard makeovers" },
];

const yardSizes: { id: YardSize; sqft: string }[] = [
  { id: "Small", sqft: "Under 2,500 sq ft" },
  { id: "Medium", sqft: "2,500 – 7,500 sq ft" },
  { id: "Large", sqft: "Over 7,500 sq ft" },
];

const PRICING: Record<ServiceType, Record<YardSize, [number, number]>> = {
  "Lawn Mowing": { Small: [45, 65], Medium: [70, 110], Large: [120, 180] },
  "Tree Trimming": { Small: [120, 200], Medium: [220, 380], Large: [400, 650] },
  "Full Landscaping": { Small: [800, 1500], Medium: [1800, 3500], Large: [4000, 8500] },
};

const contactSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

const variants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export function QuoteWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceType | null>(null);
  const [yard, setYard] = useState<YardSize | null>(null);
  const [contact, setContact] = useState({ full_name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState<[number, number] | null>(null);

  const totalSteps = 3;

  const handleSubmit = async () => {
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!service || !yard) return;

    setSubmitting(true);
    const [min, max] = PRICING[service][yard];

    const { error } = await supabase.from("leads").insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      service_type: service,
      yard_size: yard,
      estimate_min: min,
      estimate_max: max,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setEstimate([min, max]);
    setStep(4);
  };

  if (step === 4 && estimate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center py-6"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
          <PartyPopper className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 text-balance">
          Your estimate is ready!
        </h2>
        <p className="text-muted-foreground mb-8 text-balance max-w-md mx-auto">
          Based on your selections, here's your rough estimated price range:
        </p>
        <div className="bg-gradient-soft border rounded-2xl p-8 mb-8 shadow-card">
          <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Estimated Price Range
          </div>
          <div className="font-display text-5xl md:text-6xl font-semibold text-primary-deep">
            ${estimate[0]} <span className="text-muted-foreground text-3xl">–</span> ${estimate[1]}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {service} · {yard} yard
          </div>
        </div>
        <p className="text-foreground/80 mb-6 max-w-md mx-auto">
          Our team will call you within <strong>24 hours</strong> to finalize the details and schedule your service.
        </p>
        <Button onClick={onClose} variant="outline" size="lg">
          Back to home
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              n <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
        <span className="ml-3 text-sm text-muted-foreground tabular-nums">
          {step}/{totalSteps}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                What service do you need?
              </h2>
              <p className="text-muted-foreground mb-6">Pick one to get started.</p>
              <div className="grid gap-3">
                {services.map((s) => {
                  const Icon = s.icon;
                  const selected = service === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setService(s.id)}
                      className={`group flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 hover:border-primary hover:shadow-card ${
                        selected
                          ? "border-primary bg-accent shadow-card"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{s.id}</div>
                        <div className="text-sm text-muted-foreground">{s.desc}</div>
                      </div>
                      {selected && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                How big is your yard?
              </h2>
              <p className="text-muted-foreground mb-6">A rough estimate is fine.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {yardSizes.map((y) => {
                  const selected = yard === y.id;
                  return (
                    <button
                      key={y.id}
                      onClick={() => setYard(y.id)}
                      className={`p-5 rounded-xl border-2 text-center transition-all duration-200 hover:border-primary hover:shadow-card ${
                        selected
                          ? "border-primary bg-accent shadow-card"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="font-display text-2xl font-semibold text-foreground">{y.id}</div>
                      <div className="text-xs text-muted-foreground mt-1">{y.sqft}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                Where should we send it?
              </h2>
              <p className="text-muted-foreground mb-6">
                We'll text and email your estimate right away.
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={contact.full_name}
                    onChange={(e) => setContact({ ...contact, full_name: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="ghost"
          onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        {step < 3 ? (
          <Button
            size="lg"
            onClick={() => setStep(step + 1)}
            disabled={(step === 1 && !service) || (step === 2 && !yard)}
            className="bg-gradient-hero hover:opacity-95 shadow-elegant"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-hero hover:opacity-95 shadow-elegant"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              "Get My Estimate"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}