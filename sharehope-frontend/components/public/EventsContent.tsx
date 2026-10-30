"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicEvent } from "@/types/event";

type EventCategory = "in-person" | "virtual";
type Filter = "all" | EventCategory;
type DrawerTab = "rsvp" | "donate" | "volunteer";

interface EventData {
  id: string;
  category: EventCategory;
  day: string;
  month: string;
  dateLine: string;
  title: string;
  excerpt: string;
  location: string;
  image: string;
  imageAlt: string;
  buttonText: string;
  buttonVariant: "solid" | "outline";
  featured: boolean;
  highlighted: boolean;
  metaTag: string;
  description: string;
  agenda: readonly string[];
  roles: readonly string[];
  defaultTab: DrawerTab;
  capacity?: number | null;
  reservedSeats?: number;
  remainingSeats?: number | null;
  soldOut?: boolean;
  enableRsvp?: boolean;
  enableDonate?: boolean;
  enableVolunteer?: boolean;
  startAt?: string;
  endAt?: string | null;
  timezone?: string;
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop";

const IMAGES = {
  gala: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
  summit:
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
  health:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
  youth:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
} as const;

const EVENT_SCHEDULES = {
  gala: { startAt: "2026-10-14T18:30:00-04:00", timeZone: "America/New_York" },
  summit: { startAt: "2026-11-08T13:00:00-05:00", timeZone: "America/New_York" },
  health: { startAt: "2026-11-22T10:00:00-08:00", timeZone: "America/Los_Angeles" },
  youth: { startAt: "2026-12-05T14:00:00-06:00", timeZone: "America/Chicago" },
} as const;

const content = {
  en: {
    heroTitle: "Events",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Events",
    eyebrow: "Gatherings & Field Updates",
    heading: "Upcoming Gatherings",
    filters: {
      all: "All Events",
      "in-person": "In-Person",
      virtual: "Virtual Dispatches",
    },
    locationLabel: "Location:",
    featured: "Featured",
    bottomNotice: "Looking for custom corporate or private briefings?",
    bottomLink: "Contact Our Event Operations Team →",
    drawer: {
      close: "[Close ✕]",
      dateTime: "Date & Time",
      venue: "Venue Location",
      about: "About This Gathering",
      highlights: "Key Schedule Highlights:",
      tabs: { rsvp: "1. RSVP", donate: "2. Donate", volunteer: "3. Volunteer" },
      rsvp: {
        intro: "Reserve your place for this gathering. Your confirmation will appear here when the RSVP is complete.",
        passType: "Pass Type",
        passOptions: [
          "Standard Free Pass",
          "Donor Guest Pass ($50 Suggested Donation)",
          "Media & Field Partner Pass",
        ],
        fullName: "Full Name *",
        namePlaceholder: "Alex Smith",
        guestCount: "Guest Count",
        guestOptions: ["1 Guest", "2 Guests", "3+ Guests"],
        email: "Email Address (optional)",
        emailPlaceholder: "alex@example.org",
        submit: "Confirm Ticket Pass",
        success: "RSVP Confirmed",
      },
      donate: {
        intro: "Directly support the field program budget associated with this event.",
        levelLabel: "Select Contribution Level",
        customLabel: "Or Custom Amount ($ USD)",
        email: "Donor Email *",
        emailPlaceholder: "donor@example.org",
        submit: "Proceed To Direct Gift",
        success: "Donation Received",
      },
      volunteer: {
        intro: "Join our event operational crew on-site or assist virtually.",
        roleLabel: "Volunteer Role *",
        fullName: "Full Name *",
        namePlaceholder: "Sam Taylor",
        email: "Email Address *",
        emailPlaceholder: "sam@example.org",
        submit: "Submit Volunteer Application",
        success: "Volunteer Application Received",
      },
      successNote: "Your place has been reserved for this event.",
    },
    events: [
      {
        id: "gala",
        category: "in-person",
        day: "14",
        month: "OCT",
        dateLine: "WED, OCT 14, 2026 • 6:30 PM EDT",
        title: "Annual Hope Gala & Auction",
        excerpt:
          "Join partners, field directors, and sponsors for an evening dedicated to securing direct project pledges for clean water expansion.",
        location: "Metropolitan Center, New York, NY",
        imageAlt: "Annual Hope Gala",
        buttonText: "RSVP",
        buttonVariant: "solid",
        featured: false,
        highlighted: false,
        metaTag: "IN-PERSON GALA • NEW YORK",
        description:
          "An annual flagship gathering bringing together clean water advocates, corporate partners, and humanitarian leaders. Proceeds directly fund clean water well drilling in rural districts.",
        agenda: [
          "6:30 PM — Welcoming Cocktail & Auction Gallery Viewing",
          "7:30 PM — Field Keynote & Live Audio Dispatch",
          "8:30 PM — Direct Project Pledges & Live Auction",
          "9:30 PM — Closing Reception & Network Session",
        ],
        roles: [
          "Guest Registration & Check-in",
          "Auction Table Usher & Coordinator",
          "VIP Hospitality Assistant",
          "Event Setup & Breakdown",
        ],
        defaultTab: "rsvp",
      },
      {
        id: "summit",
        category: "virtual",
        day: "08",
        month: "NOV",
        dateLine: "SUN, NOV 08, 2026 • 1:00 PM EST",
        title: "Global Water Summit & Field Dispatch",
        excerpt:
          "Live unedited video broadcast direct from active field sites showcasing new solar pump installations and community handovers.",
        location: "Virtual Stream (Online Webinar)",
        imageAlt: "Global Water Summit",
        buttonText: "Learn More",
        buttonVariant: "solid",
        featured: true,
        highlighted: true,
        metaTag: "FEATURED • VIRTUAL DISPATCH",
        description:
          "An interactive digital briefing connecting donors directly with field engineers on the ground. Features real-time video tours of newly commissioned solar pump systems.",
        agenda: [
          "1:00 PM — Live Unedited Stream from Field Site",
          "1:25 PM — Solar Pump Technical & Hygiene Impact Report",
          "1:45 PM — Audience Q&A with Regional Operations Lead",
          "2:00 PM — Direct Community Handover Ceremony",
        ],
        roles: [
          "Virtual Chat Moderator",
          "Q&A Session Coordinator",
          "Digital Engagement Volunteer",
          "Post-Event Dispatch Editor",
        ],
        defaultTab: "rsvp",
      },
      {
        id: "health",
        category: "in-person",
        day: "22",
        month: "NOV",
        dateLine: "SUN, NOV 22, 2026 • 10:00 AM PST",
        title: "Community Health & Wellness Drive",
        excerpt:
          "Hands-on volunteer day assembling maternal health kits and preparing essential medical shipment packages.",
        location: "Civic Pavilion, San Francisco, CA",
        imageAlt: "Community Health Drive",
        buttonText: "View Event",
        buttonVariant: "outline",
        featured: false,
        highlighted: false,
        metaTag: "COMMUNITY SERVICE • SAN FRANCISCO",
        description:
          "Hands-on volunteer mobilization day focused on assembling medical supplies, maternal hygiene kits, and emergency water purification tablets for field shipment.",
        agenda: [
          "10:00 AM — Orientation & Volunteer Safety Briefing",
          "10:30 AM — Assembly Line Kit Packing (Medical & Water)",
          "12:30 PM — Community Lunch & Impact Briefing",
          "1:30 PM — Pallet Staging & Logistics Cargo Loading",
        ],
        roles: [
          "Kit Assembly Line Captain",
          "Warehouse Cargo Loader",
          "Volunteer Check-in & Badge Desk",
          "Supply Inventory Monitor",
        ],
        defaultTab: "volunteer",
      },
      {
        id: "youth",
        category: "in-person",
        day: "05",
        month: "DEC",
        dateLine: "SAT, DEC 05, 2026 • 2:00 PM CST",
        title: "Youth Mentorship & Education Forum",
        excerpt:
          "An interactive workshop connecting local mentors with international educators to co-design learning kits for rural schools.",
        location: "Public Library Auditorium, Chicago, IL",
        imageAlt: "Youth Mentorship Workshop",
        buttonText: "RSVP",
        buttonVariant: "solid",
        featured: false,
        highlighted: false,
        metaTag: "EDUCATIONAL WORKSHOP • CHICAGO",
        description:
          "Connecting local teachers, student ambassadors, and global education specialists to design localized learning materials for remote community schools.",
        agenda: [
          "2:00 PM — Panel Discussion: Rural Education Access",
          "2:45 PM — Interactive Learning Kit Co-Design Session",
          "3:45 PM — Student Ambassador Presentations",
          "4:30 PM — Mentor Pairing & Network Mixer",
        ],
        roles: [
          "Workshop Facilitator Assistant",
          "Student Registration Host",
          "Materials Distribution Lead",
          "Event Photographer / Media Support",
        ],
        defaultTab: "rsvp",
      },
    ],
  },
  fr: {
    heroTitle: "Événements",
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Événements",
    eyebrow: "Rencontres et nouvelles du terrain",
    heading: "Prochaines rencontres",
    filters: {
      all: "Tous les événements",
      "in-person": "En personne",
      virtual: "Diffusions virtuelles",
    },
    locationLabel: "Lieu :",
    featured: "À la une",
    bottomNotice: "Vous cherchez des séances privées ou d'entreprise sur mesure ?",
    bottomLink: "Contactez notre équipe événementielle →",
    drawer: {
      close: "[Fermer ✕]",
      dateTime: "Date et heure",
      venue: "Lieu",
      about: "À propos de cet événement",
      highlights: "Moments clés du programme :",
      tabs: { rsvp: "1. RSVP", donate: "2. Donner", volunteer: "3. Bénévolat" },
      rsvp: {
        intro: "Réservez votre place pour cet événement. Votre confirmation apparaîtra ici une fois l’inscription terminée.",
        passType: "Type de billet",
        passOptions: [
          "Billet standard gratuit",
          "Billet invité donateur (don suggéré de 50 $)",
          "Billet média et partenaire de terrain",
        ],
        fullName: "Nom complet *",
        namePlaceholder: "Alexandre Tremblay",
        guestCount: "Nombre d'invités",
        guestOptions: ["1 invité", "2 invités", "3 invités et +"],
        email: "Adresse courriel (facultatif)",
        emailPlaceholder: "alexandre@exemple.org",
        submit: "Confirmer le billet",
        success: "RSVP confirmé",
      },
      donate: {
        intro: "Soutenez directement le budget du programme de terrain associé à cet événement.",
        levelLabel: "Choisir le niveau de contribution",
        customLabel: "Ou montant personnalisé ($ USD)",
        email: "Courriel du donateur *",
        emailPlaceholder: "donateur@exemple.org",
        submit: "Procéder au don direct",
        success: "Don reçu",
      },
      volunteer: {
        intro: "Joignez notre équipe opérationnelle sur place ou assistez virtuellement.",
        roleLabel: "Rôle de bénévole *",
        fullName: "Nom complet *",
        namePlaceholder: "Samuel Lavoie",
        email: "Adresse courriel *",
        emailPlaceholder: "samuel@exemple.org",
        submit: "Soumettre la candidature",
        success: "Candidature de bénévolat reçue",
      },
      successNote: "Votre place a été réservée pour cet événement.",
    },
    events: [
      {
        id: "gala",
        category: "in-person",
        day: "14",
        month: "OCT",
        dateLine: "MER. 14 OCT. 2026 • 18 H 30 HAE",
        title: "Gala annuel de l'espoir et encan",
        excerpt:
          "Joignez-vous aux partenaires, directeurs de terrain et commanditaires pour une soirée dédiée à des promesses de dons directes pour l'accès à l'eau potable.",
        location: "Metropolitan Center, New York, NY",
        imageAlt: "Gala annuel de l'espoir",
        buttonText: "RSVP",
        buttonVariant: "solid",
        featured: false,
        highlighted: false,
        metaTag: "GALA EN PERSONNE • NEW YORK",
        description:
          "Un rassemblement phare annuel réunissant des défenseurs de l'eau potable, des partenaires corporatifs et des leaders humanitaires. Les profits financent directement le forage de puits en milieu rural.",
        agenda: [
          "18 h 30 — Cocktail d'accueil et visite de la galerie d'encan",
          "19 h 30 — Discours de terrain et diffusion audio en direct",
          "20 h 30 — Promesses de dons directes et encan",
          "21 h 30 — Réception de clôture et réseautage",
        ],
        roles: [
          "Accueil et inscription des invités",
          "Coordonnateur des tables d'encan",
          "Assistant d'accueil VIP",
          "Installation et démantèlement",
        ],
        defaultTab: "rsvp",
      },
      {
        id: "summit",
        category: "virtual",
        day: "08",
        month: "NOV",
        dateLine: "DIM. 8 NOV. 2026 • 13 H HNE",
        title: "Sommet mondial de l'eau et diffusion du terrain",
        excerpt:
          "Diffusion vidéo en direct et sans montage depuis les sites de terrain actifs, présentant les nouvelles installations de pompes solaires et les transferts aux communautés.",
        location: "Diffusion virtuelle (webinaire en ligne)",
        imageAlt: "Sommet mondial de l'eau",
        buttonText: "En savoir plus",
        buttonVariant: "solid",
        featured: true,
        highlighted: true,
        metaTag: "À LA UNE • DIFFUSION VIRTUELLE",
        description:
          "Une séance d'information numérique interactive reliant les donateurs directement aux ingénieurs sur le terrain, avec des visites vidéo en temps réel des systèmes de pompes solaires nouvellement mis en service.",
        agenda: [
          "13 h — Diffusion en direct et sans montage depuis le terrain",
          "13 h 25 — Rapport technique et hygiénique sur les pompes solaires",
          "13 h 45 — Période de questions avec le directeur régional des opérations",
          "14 h — Cérémonie de transfert direct à la communauté",
        ],
        roles: [
          "Modérateur du clavardage virtuel",
          "Coordonnateur de la période de questions",
          "Bénévole à l'engagement numérique",
          "Éditeur de la diffusion post-événement",
        ],
        defaultTab: "rsvp",
      },
      {
        id: "health",
        category: "in-person",
        day: "22",
        month: "NOV",
        dateLine: "DIM. 22 NOV. 2026 • 10 H HNP",
        title: "Journée communautaire santé et bien-être",
        excerpt:
          "Journée de bénévolat pratique pour assembler des trousses de santé maternelle et préparer des envois de fournitures médicales essentielles.",
        location: "Civic Pavilion, San Francisco, CA",
        imageAlt: "Journée santé communautaire",
        buttonText: "Voir l'événement",
        buttonVariant: "outline",
        featured: false,
        highlighted: false,
        metaTag: "SERVICE COMMUNAUTAIRE • SAN FRANCISCO",
        description:
          "Journée de mobilisation pratique axée sur l'assemblage de fournitures médicales, de trousses d'hygiène maternelle et de pastilles de purification d'eau pour les envois sur le terrain.",
        agenda: [
          "10 h — Orientation et séance de sécurité pour les bénévoles",
          "10 h 30 — Assemblage de trousses en chaîne (médical et eau)",
          "12 h 30 — Dîner communautaire et séance d'impact",
          "13 h 30 — Préparation des palettes et chargement logistique",
        ],
        roles: [
          "Chef de chaîne d'assemblage de trousses",
          "Manutentionnaire d'entrepôt",
          "Accueil des bénévoles et table des badges",
          "Contrôleur d'inventaire des fournitures",
        ],
        defaultTab: "volunteer",
      },
      {
        id: "youth",
        category: "in-person",
        day: "05",
        month: "DÉC",
        dateLine: "SAM. 5 DÉC. 2026 • 14 H HNC",
        title: "Forum de mentorat jeunesse et éducation",
        excerpt:
          "Un atelier interactif reliant mentors locaux et éducateurs internationaux pour concevoir des trousses d'apprentissage destinées aux écoles rurales.",
        location: "Auditorium de la bibliothèque publique, Chicago, IL",
        imageAlt: "Atelier de mentorat jeunesse",
        buttonText: "RSVP",
        buttonVariant: "solid",
        featured: false,
        highlighted: false,
        metaTag: "ATELIER ÉDUCATIF • CHICAGO",
        description:
          "Relier enseignants locaux, ambassadeurs étudiants et spécialistes de l'éducation mondiale pour concevoir du matériel d'apprentissage adapté aux écoles communautaires éloignées.",
        agenda: [
          "14 h — Panel : l'accès à l'éducation en milieu rural",
          "14 h 45 — Session interactive de conception de trousses",
          "15 h 45 — Présentations des ambassadeurs étudiants",
          "16 h 30 — Jumelage de mentors et réseautage",
        ],
        roles: [
          "Assistant animateur d'atelier",
          "Hôte d'inscription des étudiants",
          "Responsable de distribution de matériel",
          "Photographe / soutien média",
        ],
        defaultTab: "rsvp",
      },
    ],
  },
} as const;

export default function EventsContent({ locale, managedEvents, editor }: { locale: string; managedEvents?: PublicEvent[]; editor?: { onEditEvent: (slug: string) => void; onCreateEvent: () => void } }) {
  const t = locale === "fr" ? content.fr : content.en;
  const [filter, setFilter] = useState<Filter>("all");
  const [openEvent, setOpenEvent] = useState<EventData | null>(null);
  const [activeTab, setActiveTab] = useState<DrawerTab>("rsvp");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [rsvpError, setRsvpError] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [volunteerStatus, setVolunteerStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [volunteerError, setVolunteerError] = useState("");
  const [donationAmount, setDonationAmount] = useState(50);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const sourceEvents = managedEvents !== undefined ? managedEvents.map((event) => ({ ...event, id: event.slug, category: event.category === "virtual" ? "virtual" as const : "in-person" as const, day: "", month: "", dateLine: "", location: event.location ?? (locale === "fr" ? "En ligne" : "Online"), image: event.imageUrl ?? HERO_IMAGE, buttonVariant: "solid" as const, defaultTab: "rsvp" as const })) : t.events;
  const events: EventData[] = sourceEvents.map((event) => {
    const schedule = managedEvents !== undefined ? { startAt: (event as PublicEvent).startAt, timeZone: (event as PublicEvent).timezone } : EVENT_SCHEDULES[event.id as keyof typeof EVENT_SCHEDULES];
    const start = new Date(schedule.startAt);
    const language = locale === "fr" ? "fr-CA" : "en-US";
    return {
      ...event,
      startAt: schedule.startAt,
      endAt: "endAt" in event ? event.endAt : null,
      timezone: schedule.timeZone,
      capacity: "capacity" in event ? event.capacity : null,
      reservedSeats: "reservedSeats" in event ? event.reservedSeats : 0,
      remainingSeats: "remainingSeats" in event ? event.remainingSeats : null,
      soldOut: "soldOut" in event ? event.soldOut : false,
      enableRsvp: "enableRsvp" in event ? event.enableRsvp : true,
      enableDonate: "enableDonate" in event ? event.enableDonate : true,
      enableVolunteer: "enableVolunteer" in event ? event.enableVolunteer : true,
      day: new Intl.DateTimeFormat(language, { day: "2-digit", timeZone: schedule.timeZone }).format(start),
      month: new Intl.DateTimeFormat(language, { month: "short", timeZone: schedule.timeZone }).format(start).replace(".", "").toUpperCase(),
      dateLine: new Intl.DateTimeFormat(language, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone: schedule.timeZone,
      }).format(start).toUpperCase(),
      image: "image" in event && event.image ? event.image : IMAGES[event.id as keyof typeof IMAGES],
    };
  });

  const visibleEvents =
    filter === "all" ? events : events.filter((e) => e.category === filter);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.filters.all },
    { id: "in-person", label: t.filters["in-person"] },
    { id: "virtual", label: t.filters.virtual },
  ];

  const allTabs: { id: DrawerTab; label: string }[] = [
    { id: "rsvp", label: t.drawer.tabs.rsvp },
    { id: "donate", label: t.drawer.tabs.donate },
    { id: "volunteer", label: t.drawer.tabs.volunteer },
  ];
  const tabs = allTabs.filter((tab) => !openEvent || (tab.id === "rsvp" ? openEvent.enableRsvp !== false : tab.id === "donate" ? openEvent.enableDonate !== false : openEvent.enableVolunteer !== false));

  const openDrawer = (event: EventData, tab?: DrawerTab) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpenEvent(event);
    const firstEnabled: DrawerTab = event.enableRsvp !== false ? "rsvp" : event.enableDonate !== false ? "donate" : "volunteer";
    const requestedEnabled = tab && ((tab === "rsvp" && event.enableRsvp !== false) || (tab === "donate" && event.enableDonate !== false) || (tab === "volunteer" && event.enableVolunteer !== false));
    setActiveTab(requestedEnabled && tab ? tab : firstEnabled);
    setRsvpStatus("idle");
    setRsvpError("");
    setRegistrationId("");
    setVolunteerStatus("idle");
    setVolunteerError("");
    setDonationAmount(50);
  };

  const submitVolunteer = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!openEvent) return;
    setVolunteerStatus("submitting");
    setVolunteerError("");
    const formElement = formEvent.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(openEvent.id)}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email"), guestCount: 1, passType: `Volunteer — ${form.get("role")}`, registrationType: "VOLUNTEER", locale: locale === "fr" ? "fr" : "en" }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error || (locale === "fr" ? "Impossible de confirmer votre bénévolat." : "We could not confirm your volunteer registration."));
      setVolunteerStatus("success");
      formElement.reset();
    } catch (error) {
      setVolunteerError(error instanceof Error ? error.message : (locale === "fr" ? "Impossible de confirmer votre bénévolat." : "We could not confirm your volunteer registration."));
      setVolunteerStatus("error");
    }
  };

  const submitRsvp = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!openEvent) return;
    setRsvpStatus("submitting");
    setRsvpError("");
    const formElement = formEvent.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch(`/api/events/${encodeURIComponent(openEvent.id)}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          guestCount: Number(form.get("guestCount")),
          passType: form.get("passType"),
          locale: locale === "fr" ? "fr" : "en",
        }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string; registrationId?: string };
      if (!response.ok) throw new Error(data.error || (locale === "fr" ? "Impossible de confirmer votre inscription." : "We could not confirm your RSVP."));
      setRegistrationId(data.registrationId ?? "");
      setRsvpStatus("success");
      formElement.reset();
    } catch (error) {
      setRsvpError(error instanceof Error ? error.message : (locale === "fr" ? "Impossible de confirmer votre inscription." : "We could not confirm your RSVP."));
      setRsvpStatus("error");
    }
  };

  const closeDrawer = () => {
    setOpenEvent(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  useEffect(() => {
    if (!openEvent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openEvent]);

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const calendarLinks = openEvent?.startAt ? (() => {
    const start = new Date(openEvent.startAt);
    const end = openEvent.endAt ? new Date(openEvent.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
    const compact = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const dates = `${compact(start)}/${compact(end)}`;
    const details = `${openEvent.description}\n\n${openEvent.location}`;
    const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(openEvent.title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(openEvent.location)}`;
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ShareHope//Events//EN\r\nBEGIN:VEVENT\r\nUID:${openEvent.id}@sharehope.org\r\nDTSTAMP:${compact(new Date())}\r\nDTSTART:${compact(start)}\r\nDTEND:${compact(end)}\r\nSUMMARY:${openEvent.title.replace(/,/g, "\\,")}\r\nLOCATION:${openEvent.location.replace(/,/g, "\\,")}\r\nDESCRIPTION:${openEvent.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    return { google, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
  })() : null;

  return (
    <div className="bg-white text-[#1E293B]">
      {/* Hero banner */}
      <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-slate-900 px-6 py-24 text-center text-white md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-brand-navy/75 mix-blend-multiply" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            {t.heroTitle}
          </h1>
          <nav aria-label={locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"} className="font-space-mono flex items-center justify-center space-x-2 pt-2 text-xs uppercase tracking-widest text-slate-300">
            <Link href="/" className="transition-colors hover:text-white">
              {t.breadcrumbHome}
            </Link>
            <span className="text-slate-500">/</span>
            <span className="font-semibold text-white">{t.breadcrumbCurrent}</span>
          </nav>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-6 py-16 md:py-24">
        {/* Filter bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <span className="font-space-mono text-xs font-bold uppercase tracking-widest text-brand-navy">
              {t.eyebrow}
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-navy md:text-4xl">
              {t.heading}
            </h2>
          </div>
          <div className="font-space-mono flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-wider text-[#64748B]" aria-label={t.heading}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={
                  filter === f.id
                    ? "border-b border-brand-navy pb-1 font-bold text-brand-navy"
                    : "pb-1 transition-colors hover:text-brand-navy"
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event rows */}
        <div aria-live="polite" className="divide-y divide-[#E2E8F0] border-b border-t border-[#E2E8F0]">
          {visibleEvents.length === 0 && <p className="py-12 text-center text-sm text-[#64748B]">{locale === "fr" ? "Aucun événement ne correspond à ce filtre." : "No events match this filter."}</p>}
          {visibleEvents.map((event) => (
            <article
              key={event.id}
              className="py-10 transition-colors hover:bg-slate-50/50 md:py-12"
            >
              <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:items-center md:gap-8">
                {/* Image */}
                <Link href={`/events/${event.id}`} onClick={(clickEvent) => { if (editor) { clickEvent.preventDefault(); editor.onEditEvent(event.id); } }} aria-label={`${editor ? "Edit" : locale === "fr" ? "Voir l’événement" : "View event"}: ${event.title}`} className="order-1 text-left md:order-2 md:col-span-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#E2E8F0] bg-slate-100">
                    {event.featured ? (
                      <span className="font-space-mono absolute left-0 top-0 z-10 bg-brand-navy px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                        {t.featured}
                      </span>
                    ) : null}
                    <Image
                      src={event.image}
                      alt={event.imageAlt}
                      fill
                      sizes="(min-width: 768px) 25vw, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Date */}
                <div className="order-2 flex items-baseline space-x-3 md:order-1 md:col-span-2 md:flex-col md:items-start md:space-x-0">
                  <span className="font-serif text-5xl font-bold leading-none text-brand-navy lg:text-6xl">
                    {event.day}
                  </span>
                  <span className="font-space-mono pt-1 text-sm font-bold uppercase tracking-widest text-brand-navy">
                    {event.month}
                  </span>
                </div>

                {/* Details */}
                <div className="order-3 space-y-3 md:order-3 md:col-span-5">
                  <div className="font-space-mono text-xs uppercase tracking-wider text-[#64748B]">
                    {event.dateLine}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-navy md:text-3xl"><Link href={`/events/${event.id}`} onClick={(clickEvent) => { if (editor) { clickEvent.preventDefault(); editor.onEditEvent(event.id); } }} className="text-left transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{event.title}</Link></h3>
                  <p className="text-sm leading-relaxed text-[#64748B]">{event.excerpt}</p>
                  <div className="font-space-mono flex items-center space-x-1 pt-1 text-xs font-semibold text-brand-navy">
                    <span>{t.locationLabel}</span>
                    <span className="font-normal text-[#64748B]">{event.location}</span>
                  </div>
                  {event.remainingSeats !== null && <p className={`font-space-mono text-xs font-bold uppercase tracking-wider ${event.soldOut ? "text-red-700" : "text-blue-700"}`}>{event.soldOut ? (locale === "fr" ? "Complet" : "Sold out") : locale === "fr" ? `${event.remainingSeats} places restantes` : `${event.remainingSeats} spaces left`}</p>}
                </div>

                {/* Action */}
                <div className="order-4 pt-2 md:order-4 md:col-span-2 md:pt-0 md:text-right">
                  <button
                    onClick={() => editor ? editor.onEditEvent(event.id) : openDrawer(event)}
                    className={
                      event.buttonVariant === "outline"
                        ? "font-space-mono w-full border border-brand-navy px-6 py-4 text-xs font-bold uppercase tracking-widest text-brand-navy transition-colors hover:bg-brand-navy hover:text-white md:w-auto"
                        : "font-space-mono w-full bg-brand-navy px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#0A1C2E] md:w-auto"
                    }
                  >
                    {editor ? "Edit event" : locale === "fr" ? "Voir l’événement" : "View event"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom notice */}
        <div className="space-y-4 pt-8 text-center">
          {editor && <button type="button" onClick={editor.onCreateEvent} className="font-space-mono mb-4 bg-brand-navy px-6 py-4 text-xs font-bold uppercase tracking-widest text-white">Add an event</button>}
          <p className="font-space-mono text-xs uppercase tracking-widest text-[#64748B]">
            {t.bottomNotice}
          </p>
          <Link
            href="/contact"
            className="font-space-mono inline-block border-b border-brand-navy pb-1 text-xs font-bold uppercase tracking-widest text-brand-navy transition-colors hover:text-slate-600"
          >
            {t.bottomLink}
          </Link>
        </div>
      </div>

      {/* Drawer overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 ${
          openEvent ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-over drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!openEvent}
        inert={!openEvent}
        aria-labelledby="event-drawer-title"
        tabIndex={-1}
        onKeyDown={trapDialogFocus}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-[#E2E8F0] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          openEvent ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {openEvent ? (
          <>
            {/* Drawer header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white p-6">
              <div className="space-y-1">
                <span className="font-space-mono text-[10px] font-bold uppercase tracking-widest text-brand-navy">
                  {openEvent.metaTag}
                </span>
                <h3 id="event-drawer-title" className="font-serif text-xl font-bold leading-snug text-brand-navy md:text-2xl">
                  {openEvent.title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeDrawer}
                aria-label={locale === "fr" ? "Fermer les détails de l’événement" : "Close event details"}
                className="font-space-mono border border-[#E2E8F0] p-2 text-xs uppercase text-[#64748B] transition-colors hover:bg-slate-50 hover:text-brand-navy"
              >
                {t.drawer.close}
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 space-y-8 overflow-y-auto p-6 md:p-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#E2E8F0] bg-slate-100">
                <Image
                  src={openEvent.image}
                  alt={openEvent.imageAlt}
                  fill
                  sizes="(min-width: 640px) 576px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Logistics */}
              <div className="font-space-mono grid grid-cols-2 gap-4 border-y border-[#E2E8F0] bg-slate-50/60 p-4 text-xs">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B]">
                    {t.drawer.dateTime}
                  </span>
                  <span className="block pt-1 font-bold text-brand-navy">
                    {openEvent.dateLine}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#64748B]">
                    {t.drawer.venue}
                  </span>
                  <span className="block pt-1 font-bold text-brand-navy">
                    {openEvent.location}
                  </span>
                </div>
              </div>

              {/* About + agenda */}
              <div className="space-y-4">
                <h4 className="font-space-mono border-b border-[#E2E8F0] pb-2 text-xs font-bold uppercase tracking-widest text-brand-navy">
                  {t.drawer.about}
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  {openEvent.description}
                </p>
                <div className="space-y-2 pt-2">
                  <span className="font-space-mono block text-xs uppercase tracking-wider text-[#64748B]">
                    {t.drawer.highlights}
                  </span>
                  <ul className="list-disc space-y-2 pl-4 text-xs text-[#1E293B]">
                    {openEvent.agenda.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3-tab action selector */}
              <div className="space-y-6 border border-[#E2E8F0] bg-white p-6">
                <div role="tablist" aria-label={locale === "fr" ? "Actions pour l’événement" : "Event actions"} className="font-space-mono flex border-b border-[#E2E8F0] text-xs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                      }}
                      role="tab"
                      id={`event-tab-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                      aria-controls={`event-panel-${tab.id}`}
                      className={
                        activeTab === tab.id
                          ? "flex-1 border-b-2 border-brand-navy py-3 font-bold uppercase tracking-widest text-brand-navy transition-all"
                          : "flex-1 border-b-2 border-transparent py-3 font-bold uppercase tracking-widest text-[#64748B] transition-all hover:text-brand-navy"
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* RSVP action */}
                {activeTab === "rsvp" ? (
                  <div id="event-panel-rsvp" role="tabpanel" aria-labelledby="event-tab-rsvp" className="space-y-4">
                    {rsvpStatus === "success" ? (
                      <div className="space-y-4 border border-blue-200 bg-blue-50 p-5 text-center" role="status" tabIndex={-1}>
                        <p className="font-serif text-xl font-bold text-blue-900">{t.drawer.rsvp.success}</p>
                        <p className="mt-2 text-xs text-blue-800">{t.drawer.successNote}</p>
                        <div className="text-xs text-blue-900"><strong>{openEvent.title}</strong><br />{openEvent.dateLine}<br />{openEvent.location}{registrationId&&<><br />{locale === "fr" ? "Référence" : "Reference"}: {registrationId.slice(0,8).toUpperCase()}</>}</div>
                        {calendarLinks&&<div className="flex flex-wrap justify-center gap-2"><a href={calendarLinks.google} target="_blank" rel="noreferrer" className="border border-blue-700 px-3 py-2 text-xs font-bold text-blue-900">Google Calendar</a><a href={calendarLinks.ics} download={`${openEvent.id}.ics`} className="border border-blue-700 px-3 py-2 text-xs font-bold text-blue-900">{locale === "fr" ? "Télécharger .ics" : "Download .ics"}</a></div>}
                      </div>
                    ) : openEvent.soldOut ? <div className="border border-amber-200 bg-amber-50 p-5 text-center"><p className="font-serif text-xl font-bold text-amber-900">{locale === "fr" ? "Cet événement est complet" : "This event is sold out"}</p><p className="mt-2 text-xs text-amber-800">{locale === "fr" ? "Contactez notre équipe pour connaître les prochaines possibilités." : "Contact our team for future opportunities."}</p></div> : (
                      <form className="space-y-4" onSubmit={submitRsvp}>
                        <p className="text-xs text-[#64748B]">{t.drawer.rsvp.intro}</p>
                        <label className="block space-y-1.5 text-xs font-bold text-brand-navy">
                          <span>{t.drawer.rsvp.passType}</span>
                          <select name="passType" required className="w-full border border-[#CBD5E1] bg-white px-3 py-3 font-normal">
                            {t.drawer.rsvp.passOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        </label>
                        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                          <label className="block space-y-1.5 text-xs font-bold text-brand-navy">
                            <span>{t.drawer.rsvp.fullName}</span>
                            <input name="fullName" required maxLength={160} autoComplete="name" placeholder={t.drawer.rsvp.namePlaceholder} className="w-full border border-[#CBD5E1] px-3 py-3 font-normal" />
                          </label>
                          <label className="block space-y-1.5 text-xs font-bold text-brand-navy">
                            <span>{t.drawer.rsvp.guestCount}</span>
                            <select name="guestCount" required className="w-full border border-[#CBD5E1] bg-white px-3 py-3 font-normal">
                              {Array.from({length:Math.min(10,openEvent.remainingSeats??10)},(_,index)=>index+1).map((count) => <option key={count} value={count}>{locale === "fr" ? `${count} ${count===1?"personne":"personnes"}` : `${count} ${count===1?"person":"people"}`}</option>)}
                            </select>
                          </label>
                        </div>
                        <label className="block space-y-1.5 text-xs font-bold text-brand-navy">
                          <span>{t.drawer.rsvp.email}</span>
                          <input name="email" type="email" maxLength={320} autoComplete="email" placeholder={t.drawer.rsvp.emailPlaceholder} className="w-full border border-[#CBD5E1] px-3 py-3 font-normal" />
                        </label>
                        <p className="text-[11px] leading-relaxed text-[#64748B]">{locale === "fr" ? "Nous utiliserons ces informations uniquement pour gérer votre inscription à cet événement. " : "We’ll use this information only to manage your registration for this event. "}<Link href="/privacy" className="underline">{locale === "fr" ? "Politique de confidentialité" : "Privacy policy"}</Link>.</p>
                        {rsvpStatus === "error" && <p className="text-sm font-semibold text-red-700" role="alert">{rsvpError}</p>}
                        <button type="submit" disabled={rsvpStatus === "submitting"} className="font-space-mono block w-full bg-brand-navy py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#0A1C2E] disabled:cursor-wait disabled:opacity-60">
                          {rsvpStatus === "submitting" ? (locale === "fr" ? "Confirmation…" : "Confirming…") : t.drawer.rsvp.submit}
                        </button>
                      </form>
                    )}
                  </div>
                ) : null}

                {/* Donation action */}
                {activeTab === "donate" ? (
                  <div id="event-panel-donate" role="tabpanel" aria-labelledby="event-tab-donate" className="space-y-4">
                    <p className="text-xs text-[#64748B]">{t.drawer.donate.intro}</p>
                    <div className="grid grid-cols-3 gap-2" aria-label={locale === "fr" ? "Montant du don" : "Donation amount"}>
                      {[25, 50, 100].map((amount) => <button key={amount} type="button" onClick={() => setDonationAmount(amount)} aria-pressed={donationAmount === amount} className={`border px-3 py-3 text-sm font-bold ${donationAmount === amount ? "border-brand-navy bg-brand-navy text-white" : "border-[#CBD5E1] text-brand-navy"}`}>${amount}</button>)}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#64748B]">{locale === "fr" ? `Votre don de ${donationAmount} $ sera associé à ${openEvent.title}.` : `Your $${donationAmount} gift will be associated with ${openEvent.title}.`}</p>
                    <Link href={`/donate?event=${encodeURIComponent(openEvent.id)}&amount=${donationAmount}`} className="font-space-mono block w-full bg-brand-navy py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#0A1C2E]">{locale === "fr" ? `Continuer avec ${donationAmount} $` : `Continue with $${donationAmount}`}</Link>
                    <Link href={`/events/${openEvent.id}/donate`} className="block text-center text-[11px] font-semibold text-brand-navy underline">{locale === "fr" ? "Ouvrir la page de campagne complète" : "Open the full campaign page"}</Link>
                  </div>
                ) : null}

                {/* Volunteer action */}
                {activeTab === "volunteer" ? (
                  <div id="event-panel-volunteer" role="tabpanel" aria-labelledby="event-tab-volunteer" className="space-y-4">
                    {volunteerStatus === "success" ? <div role="status" className="border border-blue-200 bg-blue-50 p-5 text-center text-sm font-semibold text-blue-900">{locale === "fr" ? "Merci! Votre place de bénévole est confirmée." : "Thank you! Your volunteer place is confirmed."}</div> : <form className="space-y-4" onSubmit={submitVolunteer}>
                      <p className="text-xs text-[#64748B]">{t.drawer.volunteer.intro}</p>
                      <label className="block space-y-1.5 text-xs font-bold text-brand-navy"><span>{locale === "fr" ? "Rôle bénévole" : "Volunteer role"}</span><select name="role" required className="w-full border border-[#CBD5E1] bg-white px-3 py-3 font-normal">{(openEvent.roles.length ? openEvent.roles : [locale === "fr" ? "Soutien général à l’événement" : "General event support"]).map((role) => <option key={role}>{role}</option>)}</select></label>
                      <label className="block space-y-1.5 text-xs font-bold text-brand-navy"><span>{locale === "fr" ? "Nom complet *" : "Full name *"}</span><input name="fullName" required maxLength={160} autoComplete="name" className="w-full border border-[#CBD5E1] px-3 py-3 font-normal" /></label>
                      <label className="block space-y-1.5 text-xs font-bold text-brand-navy"><span>{locale === "fr" ? "Adresse courriel (facultatif)" : "Email address (optional)"}</span><input name="email" type="email" maxLength={320} autoComplete="email" className="w-full border border-[#CBD5E1] px-3 py-3 font-normal" /></label>
                      {volunteerStatus === "error" && <p role="alert" className="text-sm font-semibold text-red-700">{volunteerError}</p>}
                      <button type="submit" disabled={volunteerStatus === "submitting" || openEvent.soldOut} className="font-space-mono block w-full bg-brand-navy py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#0A1C2E] disabled:cursor-not-allowed disabled:opacity-60">{openEvent.soldOut ? (locale === "fr" ? "Complet" : "Event is full") : volunteerStatus === "submitting" ? (locale === "fr" ? "Inscription…" : "Registering…") : (locale === "fr" ? "Confirmer mon bénévolat" : "Confirm volunteer registration")}</button>
                    </form>}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}
