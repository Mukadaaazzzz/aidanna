import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 p-8 text-center shadow-2xl">
          <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Ready to transform your learning?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600">Start creating unforgettable stories today.</p>
          <div className="mt-6 flex justify-center">
            <Link 
              href="#pricing" 
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all hover:scale-105"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}