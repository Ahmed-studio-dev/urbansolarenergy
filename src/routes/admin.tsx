import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Users, DollarSign, Phone, RefreshCw } from "lucide-react";
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
      { title: "Admin · Leads — Evergreen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  service_type: string;
  yard_size: string;
  estimate_min: number;
  estimate_max: number;
  created_at: string;
};

function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const totalValue = leads.reduce((sum, l) => sum + (l.estimate_min + l.estimate_max) / 2, 0);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-primary-deep">
              Evergreen <span className="text-muted-foreground font-normal">/ Admin</span>
            </span>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-primary-deep">Leads Dashboard</h1>
          <p className="text-muted-foreground mt-1">All quote requests, sorted by most recent.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} label="Total Leads" value={leads.length.toString()} />
          <StatCard
            icon={DollarSign}
            label="Pipeline Value (avg)"
            value={`$${Math.round(totalValue).toLocaleString()}`}
          />
          <StatCard
            icon={Phone}
            label="Awaiting Callback"
            value={leads.filter((l) => Date.now() - new Date(l.created_at).getTime() < 86400000).length.toString()}
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Yard Size</TableHead>
                <TableHead className="text-right">Estimate</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Loading leads…
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No leads yet. Share your quote page to start collecting!
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {lead.service_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.yard_size}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      ${lead.estimate_min}–${lead.estimate_max}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value,
}: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-semibold text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}