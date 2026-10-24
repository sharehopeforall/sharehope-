"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, FilePenLine, Globe2, HeartHandshake, Newspaper, Plus, TicketCheck, TriangleAlert, UserPlus, UsersRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAdminBlogPosts } from "@/hooks/useBlog";
import { useAdminEvents } from "@/hooks/useEvents";
import { useAdminPrograms } from "@/hooks/usePrograms";
import { useTeamMembers } from "@/hooks/useTeam";
import { eventsApi } from "@/lib/api/events";
import type { EventRegistration } from "@/types/event";

const compactDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const dashboardLoadedAt = Date.now();

export function AdminDashboardClient() {
  const { data: user } = useCurrentUser();
  const events = useAdminEvents();
  const programs = useAdminPrograms();
  const blog = useAdminBlogPosts();
  const owner = user?.role === "SUPER_ADMIN";
  const team = useTeamMembers(owner);
  const registrations = useQuery({
    queryKey: ["dashboard-registrations", (events.data ?? []).map((event) => event.id).join(",")],
    enabled: Boolean(events.data),
    queryFn: async () => {
      const lists = await Promise.all((events.data ?? []).map(async (event) => ({ event, registrations: await eventsApi.listRegistrations(event.id) })));
      return lists.flatMap(({ event, registrations: entries }) => entries.map((registration) => ({ ...registration, eventTitle: event.en.title })));
    },
  });

  const upcoming = useMemo(() => (events.data ?? []).filter((event) => event.status === "PUBLISHED" && new Date(event.startAt).getTime() >= dashboardLoadedAt).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()).slice(0, 5), [events.data]);
  const recentRegistrations = useMemo(() => [...(registrations.data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6), [registrations.data]);
  const draftEvents = (events.data ?? []).filter((event) => event.status === "DRAFT");
  const draftPrograms = (programs.data ?? []).filter((program) => !program.published);
  const draftPosts = (blog.data ?? []).filter((post) => post.status === "DRAFT");
  const capacityAlerts = (events.data ?? []).filter((event) => event.status === "PUBLISHED" && event.capacity !== null && event.capacity - event.reservedSeats <= 5);
  const activeTeam = (team.data ?? []).filter((member) => member.status === "ACTIVE").length;
  const reservedSeats = (events.data ?? []).reduce((total, event) => total + event.reservedSeats, 0);
  const loading = events.isLoading || programs.isLoading || blog.isLoading;
  const hasError = events.isError || programs.isError || blog.isError;

  const attention = [
    ...(draftEvents.length ? [{ label: `${draftEvents.length} event${draftEvents.length === 1 ? "" : "s"} awaiting publication`, href: "/admin/events", tone: "amber" }] : []),
    ...(capacityAlerts.length ? [{ label: `${capacityAlerts.length} event${capacityAlerts.length === 1 ? " is" : "s are"} at or near capacity`, href: "/admin/events", tone: "red" }] : []),
    ...(draftPosts.length ? [{ label: `${draftPosts.length} blog draft${draftPosts.length === 1 ? "" : "s"} to review`, href: "/admin/blog", tone: "blue" }] : []),
    ...(draftPrograms.length ? [{ label: `${draftPrograms.length} unpublished program${draftPrograms.length === 1 ? "" : "s"}`, href: "/admin/programs", tone: "green" }] : []),
  ];

  const quickActions = [
    { label: "Create event", href: "/admin/events?new=1", icon: CalendarDays },
    { label: "Write blog post", href: "/admin/blog?new=1", icon: Newspaper },
    { label: "Add program", href: "/admin/programs?new=1", icon: HeartHandshake },
    ...(owner ? [{ label: "Add team member", href: "/admin/team?new=1", icon: UserPlus }] : []),
  ];

  if (loading) return <div className="p-8 text-sm text-slate-500">Preparing your dashboard…</div>;

  return <div className="bg-[#F5F6F4] p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="flex flex-col justify-between gap-6 rounded-3xl bg-brand-navy p-7 text-white lg:flex-row lg:items-end lg:p-9">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#FFC72C]">ShareHope operations</p><h1 className="mt-3 font-serif text-4xl font-bold">Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Here is what needs attention across your events, programs, stories, and organization.</p></div>
        <Link href="/admin/website" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/15"><Globe2 size={18} />Open website editor</Link>
      </section>

      {hasError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">Some dashboard information could not be loaded. The available sections are shown below.</p>}

      <section><div className="mb-3 flex items-center gap-2"><Plus className="text-brand-green" size={18} /><h2 className="font-bold text-brand-navy">Quick actions</h2></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{quickActions.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-green"><span className="flex items-center gap-3 text-sm font-bold text-brand-navy"><span className="rounded-xl bg-[#EEF6F0] p-2.5 text-brand-green"><Icon size={18} /></span>{label}</span><ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-green" size={17} /></Link>)}</div></section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Upcoming events", value: upcoming.length, detail: "Published and scheduled", icon: CalendarDays },
          { label: "Reserved seats", value: reservedSeats, detail: `${(registrations.data ?? []).filter((item) => item.registrationType === "VOLUNTEER" && item.status !== "CANCELLED").length} volunteer registrations`, icon: TicketCheck },
          { label: "Published programs", value: (programs.data ?? []).filter((program) => program.published).length, detail: `${draftPrograms.length} in draft`, icon: HeartHandshake },
          { label: owner ? "Active team" : "Published stories", value: owner ? activeTeam : (blog.data ?? []).filter((post) => post.status === "PUBLISHED").length, detail: owner ? `${(team.data ?? []).filter((member) => member.status === "ON_LEAVE").length} currently on leave` : `${draftPosts.length} in draft`, icon: owner ? UsersRound : Newspaper },
        ].map(({ label, value, detail, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><Icon className="text-brand-green" size={19} /></div><p className="mt-3 text-3xl font-bold text-brand-navy">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>)}
      </section>

      <div className="grid gap-7 xl:grid-cols-[.85fr_1.5fr]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex items-center gap-3 border-b p-5"><span className="rounded-xl bg-amber-50 p-2 text-amber-700"><TriangleAlert size={19} /></span><div><h2 className="font-bold text-brand-navy">Attention required</h2><p className="text-xs text-slate-500">Work that may need your review</p></div></header>{attention.length ? <div className="divide-y divide-slate-100">{attention.map((item) => <Link key={item.label} href={item.href} className="group flex items-center justify-between gap-4 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><span>{item.label}</span><ArrowRight className="shrink-0 text-slate-300 group-hover:text-brand-green" size={16} /></Link>)}</div> : <div className="p-8 text-center"><p className="font-semibold text-brand-navy">You’re all caught up.</p><p className="mt-1 text-sm text-slate-500">No publishing or capacity alerts right now.</p></div>}</section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold text-brand-navy">Upcoming events</h2><p className="text-xs text-slate-500">Published events ordered by date</p></div><Link href="/admin/events" className="text-xs font-bold text-brand-green">View all →</Link></header>{upcoming.length ? <div className="divide-y divide-slate-100">{upcoming.map((event) => { const remaining = event.capacity === null ? null : Math.max(0, event.capacity - event.reservedSeats); return <div key={event.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-bold text-brand-navy">{event.en.title}</p><p className="mt-1 text-xs text-slate-500">{compactDate.format(new Date(event.startAt))} · {event.location || (event.category === "virtual" ? "Online" : "Location not set")}</p></div><div className="text-left sm:text-right"><p className="text-sm font-bold text-brand-navy">{event.reservedSeats} reserved</p><p className={`text-xs ${remaining !== null && remaining <= 5 ? "font-semibold text-red-600" : "text-slate-400"}`}>{remaining === null ? "Unlimited capacity" : `${remaining} remaining`}</p></div><Link href="/admin/events" className="rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-bold text-brand-navy hover:border-brand-green">Manage</Link></div>; })}</div> : <div className="p-10 text-center text-sm text-slate-500">No upcoming published events.</div>}</section>
      </div>

      <div className="grid gap-7 xl:grid-cols-[1.35fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold text-brand-navy">Recent registrations</h2><p className="text-xs text-slate-500">RSVP and volunteer activity across events</p></div><Link href="/admin/events" className="text-xs font-bold text-brand-green">Manage events →</Link></header>{registrations.isLoading ? <p className="p-8 text-center text-sm text-slate-500">Loading registrations…</p> : recentRegistrations.length ? <div className="divide-y divide-slate-100">{recentRegistrations.map((registration: EventRegistration & { eventTitle: string }) => <div key={registration.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-brand-navy">{registration.fullName}</p><p className="truncate text-xs text-slate-500">{registration.eventTitle}</p></div><div className="shrink-0 text-right"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${registration.registrationType === "VOLUNTEER" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>{registration.registrationType}</span><p className="mt-1 text-[11px] text-slate-400">{dateTime.format(new Date(registration.createdAt))}</p></div></div>)}</div> : <div className="p-10 text-center text-sm text-slate-500">No registrations have been recorded yet.</div>}</section>

        {owner ? <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold text-brand-navy">Team snapshot</h2><p className="text-xs text-slate-500">Private owner-only personnel overview</p></div><Link href="/admin/team" className="text-xs font-bold text-brand-green">Directory →</Link></header><div className="grid grid-cols-2 gap-px bg-slate-100"><div className="bg-white p-5"><p className="text-3xl font-bold text-brand-navy">{activeTeam}</p><p className="mt-1 text-xs text-slate-500">Active</p></div><div className="bg-white p-5"><p className="text-3xl font-bold text-brand-navy">{(team.data ?? []).filter((member) => member.status === "ON_LEAVE").length}</p><p className="mt-1 text-xs text-slate-500">On leave</p></div><div className="bg-white p-5"><p className="text-3xl font-bold text-brand-navy">{(team.data ?? []).filter((member) => member.status === "INACTIVE").length}</p><p className="mt-1 text-xs text-slate-500">Inactive</p></div><div className="bg-white p-5"><p className="text-3xl font-bold text-brand-navy">{(team.data ?? []).filter((member) => member.status === "FORMER").length}</p><p className="mt-1 text-xs text-slate-500">Former</p></div></div><div className="p-4"><Link href="/admin/team?new=1" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-bold text-white"><UserPlus size={17} />Add team member</Link></div></section> : <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><FilePenLine className="text-brand-green" /><h2 className="mt-4 font-bold text-brand-navy">Content workspace</h2><p className="mt-2 text-sm leading-6 text-slate-500">You have {draftPosts.length + draftPrograms.length + draftEvents.length} draft items across the website.</p><Link href="/admin/website" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-green">Continue editing <ArrowRight size={16} /></Link></section>}
      </div>
    </div>
  </div>;
}
