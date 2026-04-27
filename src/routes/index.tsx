import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Clock, ShieldCheck, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteWizard } from "@/components/QuoteWizard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Evergreen Lawn & Landscape — Get an Instant Estimate" },
      { name: "description", content: "Free instant estimate for lawn mowing, tree trimming, and full landscaping. Local pros, transparent pricing, fast response." },
    ],
  }),
});

function Index() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-hero flex items-center justify-center shadow-card">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-primary-deep">Evergreen</span>
          </div>
          <a
            href="tel:5551234567"
            className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            (555) 123-4567
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/40 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border shadow-card mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                Trusted by 2,400+ homeowners
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-balance text-primary-deep">
              Get an Instant Estimate for Your Lawn
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl text-balance">
              Tell us a few quick details about your yard. We'll show you a price
              range right away — and call you within 24 hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => setShowWizard(true)}
                className="h-14 px-8 text-base bg-gradient-hero hover:opacity-95 shadow-elegant"
              >
                Start My Quote
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
              <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Takes 60 seconds</span>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span>4.9 / 5 (1,200+ reviews)</span>
              </div>
            </div>
          </motion.div>

          {/* Wizard / Visual card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-elegant border">
              {showWizard ? (
                <QuoteWizard onClose={() => setShowWizard(false)} />
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
                    <Leaf className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">
                    Free instant quote
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    No credit card. No commitment. Just a price range tailored to your yard.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowWizard(true)}
                    className="w-full h-12 bg-gradient-hero hover:opacity-95"
                  >
                    Start My Quote
                  </Button>
                  <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>✓ Mowing</div>
                    <div>✓ Trimming</div>
                    <div>✓ Landscaping</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Evergreen Lawn & Landscape</div>
          <div className="flex gap-6">
            <span>Licensed & Insured</span>
            <span>Local Family-Owned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
