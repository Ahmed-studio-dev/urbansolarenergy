import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, ArrowRight, ShieldCheck, Award, Zap, TrendingUp, Clock, Sparkles, BatteryCharging, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SolarWizard } from "@/components/SolarWizard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Urban Energy — Solar Savings Calculator for Pakistan" },
      { name: "description", content: "See how much you can save with smart solar. Get your custom system size, monthly savings, and payback period in 60 seconds." },
    ],
  }),
});

function Index() {
  const [showWizard, setShowWizard] = useState(false);

  const openCalculator = () => {
    setShowWizard(true);
    // Wait for the wizard to mount, then smoothly scroll it into view
    setTimeout(() => {
      const el = document.getElementById("calculator");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-sun flex items-center justify-center shadow-orange">
              <Sun className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-navy-foreground">Urban Energy</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-glow font-semibold">Smart Solar Systems</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-navy-foreground/80">
            <a href="#how" className="hover:text-primary-glow transition-colors">How it works</a>
            <a href="tel:+923001234567" className="font-medium hover:text-primary-glow transition-colors">
              +92 300 123 4567
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-aurora text-navy-foreground pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl -z-0" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium">Trusted by 5,000+ homes across Pakistan</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] text-balance">
              See How Much You Can{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent">
                  Save
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-sun origin-left rounded-full"
                />
              </span>
              <br />
              with Urban Energy's{" "}
              <span className="text-primary-glow">Smart Solar.</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-navy-foreground/75 max-w-xl text-balance">
              Get a personalized solar plan in 60 seconds — system size, monthly savings,
              and payback period tailored to your bill, roof, and connection.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={openCalculator}
                className="h-14 px-8 text-base bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange font-bold"
              >
                Calculate My Savings
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
              <a
                href="#how"
                className="inline-flex items-center justify-center h-14 px-6 text-sm font-medium text-navy-foreground/80 hover:text-primary-glow transition-colors"
              >
                How does it work? →
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="5,000+" l="Installations" />
              <Stat n="40 MW" l="Generated" />
              <Stat n="4.9★" l="Customer rating" />
            </div>
          </motion.div>

          {/* Wizard card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div id="calculator" className="bg-card text-foreground rounded-3xl p-6 md:p-7 shadow-elegant border border-white/10 scroll-mt-24">
              {showWizard ? (
                <SolarWizard onClose={() => setShowWizard(false)} />
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-sun shadow-orange">
                    <Sun className="h-8 w-8 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-primary-deep text-[11px] font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="h-3 w-3" /> Free Calculator
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy mb-2">
                    Solar ROI Calculator
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    3 quick questions. Get your custom system size,
                    savings & payback in seconds.
                  </p>
                  <Button
                    size="lg"
                    onClick={openCalculator}
                    className="w-full h-12 bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange font-bold"
                  >
                    Start Calculator <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 60 seconds</span>
                    <span>·</span>
                    <span>No signup needed</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-background py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary-deep text-xs font-bold uppercase tracking-wider mb-4">
              How it works
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-balance">
              Three steps to know your solar payback.
            </h2>
            <p className="mt-3 text-muted-foreground">
              No site visit, no pressure. Just data-driven numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: LineChart, n: "01", t: "Tell us your bill", d: "Enter your average monthly electricity bill in PKR." },
              { icon: BatteryCharging, n: "02", t: "Pick roof & phase", d: "Select roof size and your current connection phase." },
              { icon: TrendingUp, n: "03", t: "See your savings", d: "Get system size, monthly savings, and exact payback period." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-2xl p-6 border shadow-card hover:shadow-orange transition-shadow"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="h-11 w-11 rounded-xl bg-gradient-sun flex items-center justify-center shadow-orange">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-display text-3xl font-bold text-accent">{s.n}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-navy mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Trust */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, t: "AEDB Certified" },
              { icon: Award, t: "25-Year Warranty" },
              { icon: Zap, t: "Tier-1 Panels" },
              { icon: TrendingUp, t: "Net-Metering Setup" },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.t} className="flex items-center gap-3 justify-center text-navy">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold">{b.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-night text-navy-foreground py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
            Stop overpaying WAPDA. Start generating your own power.
          </h2>
          <p className="mt-3 text-navy-foreground/70 max-w-xl mx-auto">
            Join thousands of Pakistani homes saving 80%+ on their bills with Urban Energy.
          </p>
          <Button
            size="lg"
            onClick={openCalculator}
            className="mt-7 h-14 px-8 bg-gradient-sun hover:opacity-95 text-primary-foreground shadow-orange font-bold"
          >
            Get My Free Solar Plan <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-navy-foreground/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-sun flex items-center justify-center">
              <Sun className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-navy-foreground">Urban Energy</span>
          </div>
          <div>© {new Date().getFullYear()} Urban Energy Pakistan. All rights reserved.</div>
          <div className="flex gap-5">
            <span>AEDB Certified</span>
            <span>Lahore · Karachi · Islamabad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl font-bold text-primary-glow">{n}</div>
      <div className="text-xs text-navy-foreground/60 mt-0.5">{l}</div>
    </div>
  );
}
