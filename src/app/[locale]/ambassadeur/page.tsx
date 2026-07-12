"use client";
import { useState } from "react";
export default function AmbassadeurPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen text-white" style={{background:"#0a0614"}}>
      <section className="pt-32 pb-16 px-4 text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block px-5 py-2 rounded-full text-sm font-medium tracking-wider mb-6 border border-white/15 bg-white/[0.04] text-white/60">
            Ambassador program
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Become an Embir Ambassador
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
            Help us build the community. Ambassadors get early access, better visibility, and founder status for life.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
            What you get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {title:"Founder Status",desc:"Help shape the product and its community.",hl:"Everything needed to meet someone is free. No credit card required"},
              {title:"Verified Badge",desc:"Your profile gets priority verification and a founder badge.",hl:"Trusted profile"},
              {title:"Better Visibility",desc:"Your profile appears first in search results.",hl:"Top placement"},
              {title:"Early Access",desc:"Try new features before anyone else.",hl:"Shape the platform"},
              {title:"Reciprocal messaging",desc:"Text messages after a mutual connection, with blocking and reporting tools.",hl:"Core connection"},
              {title:"Priority Support",desc:"Direct access to the team when you need help.",hl:"Fast response"},
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] h-full">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 mb-3">{item.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] text-white/50">{item.hl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          {submitted ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10">
              <h2 className="text-2xl font-bold text-white mb-3">Thanks</h2>
              <p className="text-white/50">We'll reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-10">
              <h2 className="text-2xl font-bold text-white mb-4">Apply</h2>
              <p className="text-white/40 text-sm mb-6">Leave your info and we'll get back to you.</p>
              <input
                type="text"
                placeholder="Your name or @username"
                className="w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-white text-sm mb-3 placeholder:text-white/25 outline-none focus:border-white/30"
                required
              />
              <button
                type="submit"
                className="w-full rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
