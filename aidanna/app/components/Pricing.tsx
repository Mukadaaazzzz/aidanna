import React from "react";
import Link from "next/link";
import { CheckCircle2, Crown, Zap, Users, BookOpen } from "lucide-react";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "₦0",
      description: "Perfect for trying storytelling",
      icon: BookOpen,
      popular: false,
      features: [
        "10 stories daily",
        "Basic Narrative mode", 
        "Basic Dialogue mode",
        "Multilingual (Yoruba, Hausa & Igbo)",
        "Standard support"
      ],
      cta: "Start Free",
      href: "/signup"
    },
    {
      name: "Pro Learner",
      price: "₦2,500",
      description: "For students & professionals",
      icon: Zap,
      popular: true,
      features: [
        "Unlimited stories",
        "Advanced story modes (Narrative, Dialogues)",
        "Pdf files support",
        "Voice mode",
        "Save & Export ",
        "Priority support"
      ],
      cta: "Go Pro",
      href: "/upgrade"
    },
    {
      name: "Team",
      price: "₦99,500",
      description: "For corporate training & classrooms",
      icon: Users,
      popular: false,
      features: [
        "Everything in Pro",
        "5 team seats",
        "Shared story library",
        "LMS integration",
        "Admin dashboard",
        "Custom templates",
        "Dedicated support"
      ],
      cta: "Coming soon", 
      href: "/"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing for <span className="text-purple-600">Every Learner</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Start free, upgrade as you grow. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 transition-all hover:scale-105 ${
                tier.popular
                  ? "border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50 ring-2 ring-purple-500/20"
                  : "border-gray-200 bg-gradient-to-br from-gray-50 to-white"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-1 text-sm font-semibold text-white">
                    <Crown className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  tier.popular ? "bg-white text-purple-600" : "bg-purple-500/20 text-purple-600"
                }`}>
                  <tier.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-gray-600">{tier.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                <span className="text-gray-600">/{tier.name === "Team" ? "month" : "month"}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block w-full rounded-xl py-4 text-center font-semibold transition ${
                  tier.popular
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-600 hover:to-fuchsia-600"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}