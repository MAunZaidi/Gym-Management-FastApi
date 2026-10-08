import { Activity, BicepsFlexed, HeartPulse, PersonStanding, Sparkles, UsersRound, Zap } from "lucide-react";

export const publicNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Memberships", href: "/memberships" },
  { label: "Classes", href: "/classes" },
  { label: "Trainers", href: "/trainers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export const services = [
  { number: "01", name: "Strength training", detail: "Build a stronger foundation with progressive, purposeful work.", icon: BicepsFlexed, image: "/images/site-feature.jpg", imagePosition: "center 42%" },
  { number: "02", name: "Personal coaching", detail: "One-to-one guidance shaped around your goals and your life.", icon: PersonStanding, image: "/images/trainer-editorial-02.jpg", imagePosition: "center 19%" },
  { number: "03", name: "Group training", detail: "Shared effort, expert direction, and energy that carries you further.", icon: UsersRound, image: "/images/service-group.jpg", imagePosition: "center 27%" },
  { number: "04", name: "Functional training", detail: "Move with power and confidence well beyond the gym floor.", icon: Zap, image: "/images/trainer-editorial-03.jpg", imagePosition: "center 36%" },
  { number: "05", name: "Cardio conditioning", detail: "Build endurance with a pace and progression that work for you.", icon: Activity, image: "/images/service-cardio.jpg", imagePosition: "center 30%" },
  { number: "06", name: "Mobility & recovery", detail: "Train for longevity with better movement and intentional recovery.", icon: HeartPulse, image: "/images/trainer-editorial-04.jpg", imagePosition: "center 21%" },
  { number: "07", name: "Nutrition support", detail: "Practical habits to support training, energy, and consistency.", icon: Sparkles, image: null, imagePosition: "center" }
];

export const principles = [
  { number: "01", title: "Start where you are", text: "A good training plan meets you at your current level and moves with you." },
  { number: "02", title: "Progress with purpose", text: "We value technique, consistency, and measured progress over quick fixes." },
  { number: "03", title: "Find your people", text: "The best work happens in a space where you feel welcome and supported." }
];

