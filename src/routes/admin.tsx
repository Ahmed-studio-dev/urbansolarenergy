import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sun, Users, TrendingUp, Zap, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin · Solar Leads — Urban Energy" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  monthly_bill: number;
  roof_space: string;
  phase_type: string;
  system_size_kw: number;
  monthly_savings: number;
  payback_years: number;
  created_at: string;
};

function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("solar_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const totalKw = leads.reduce((s, l) => s + Number(l.system_size_kw), 0);
  const pipelineValue = leads.reduce((s, l) => s + Number(l.system_size_kw) * 160000, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-night text-navy-foreground sticky top-0 z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-sun flex items-center justify-center shadow-orange">
              <Sun className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-base font-bold leading-none">Urban Energy</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-glow font-semibold mt-0.5">Admin · Leads</div>
            </div>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}
            className="bg-white/5 border-white/15 text-navy-foreground hover:bg-white/10 hover:text-navy-foreground">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-navy">Solar Leads Dashboard</h1>
          <p className="text-muted-foreground mt-1">High-intent prospects from the ROI calculator.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} label="Total Leads" value={leads.length.toString()} />
          <StatCard icon={Zap} label="Pipeline kW" value={`${totalKw.toFixed(1)} kW`} />
          <StatCard
            icon={TrendingUp}
            label="Pipeline Value"
            value={`PKR ${(pipelineValue / 100000).toFixed(1)}L`}
          />
        </div>

        <div className="bg-card rounded-2xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Name</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Bill</TableHead>
                  <TableHead>Roof</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead className="text-right">System</TableHead>
                  <TableHead className="text-right">Savings/mo</TableHead>
                  <TableHead className="text-right">Payback</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      Loading leads…
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No leads yet. Share your calculator to start collecting!
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((l) => (
                    <TableRow key={l.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-navy">{l.name}</TableCell>
                      <TableCell>
                        <a
                          href={`https://wa.me/${l.whatsapp.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary-deep hover:text-primary font-medium"
                        >
                          <Phone className="h-3.5 w-3.5" /> {l.whatsapp}
                        </a>
                      </TableCell>
                      <TableCell className="tabular-nums">PKR {l.monthly_bill.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{l.roof_space}</Badge></TableCell>
                      <TableCell className="capitalize text-muted-foreground">{l.phase_type}</TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-primary-deep">
                        {l.system_size_kw} kW
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        PKR {l.monthly_savings.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{l.payback_years} yrs</TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(l.created_at).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-sun flex items-center justify-center shadow-orange">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-bold text-navy">{value}</div>
        </div>
      </div>
    </div>
  );
}
