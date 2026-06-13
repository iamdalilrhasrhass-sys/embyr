"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    q: "Ton premier date idéal ?",
    answers: [
      { text: "Un resto gastronomique aux chandelles 🕯️", score: "romantic" },
      { text: "Netflix & chill direct chez toi 🛋️", score: "bold" },
      { text: "Un bar branché avec de la musique live 🎸", score: "social" },
      { text: "Une rando en pleine nature 🌲", score: "adventurous" },
    ],
  },
  {
    q: "Ton message d'ouverture sur une app de rencontre ?",
    answers: [
      { text: "\"Salut, ça va ?\" — classique, efficace ✌️", score: "romantic" },
      { text: "\"T'es célibataire ou t'es juste venu pour les likes ?\" 😏", score: "bold" },
      { text: "\"Alors, raconte-moi ton pire date, je te raconte le mien\" 😂", score: "social" },
      { text: "\"Partons en week-end, je m'occupe de tout\" 🚗", score: "adventurous" },
    ],
  },
  {
    q: "Ta tenue pour une soirée gay ?",
    answers: [
      { text: "Chemise bien coupée, look clean 👔", score: "romantic" },
      { text: "T-shirt moulant qui met en valeur 💪", score: "bold" },
      { text: "Pièce vintage dénichée en friperie 🧥", score: "social" },
      { text: "Ce qui est propre, honnêtement mdr 👕", score: "adventurous" },
    ],
  },
  {
    q: "Tu vois un mec mignon au bar. Tu fais quoi ?",
    answers: [
      { text: "Je lui souris et j'attends qu'il vienne 😊", score: "romantic" },
      { text: "Je vais direct lui parler, la vie est courte 🔥", score: "bold" },
      { text: "Je demande à un pote de faire les présentations 🕺", score: "social" },
      { text: "Je lui envoie un verre depuis l'autre bout du bar 🍸", score: "adventurous" },
    ],
  },
  {
    q: "Le trait le plus important chez un partenaire ?",
    answers: [
      { text: "La fidélité et la tendresse 💕", score: "romantic" },
      { text: "La confiance en soi et l'ambition 🎯", score: "bold" },
      { text: "L'humour et la vibe positive 😂", score: "social" },
      { text: "L'ouverture d'esprit et la spontanéité 🌈", score: "adventurous" },
    ],
  },
];

const results: Record<string, { emoji: string; title: string; description: string; color: string; gradient: string }> = {
  romantic: {
    emoji: "💘",
    title: "Le Romantique Passionné",
    description: "Tu crois au grand amour et aux gestes attentionnés. Pour toi, une rencontre doit avoir de la profondeur. Les applis de rencontre superficielles te frustrent — tu veux du vrai. Embir est fait pour les mecs comme toi qui cherchent plus qu'un swipe.",
    color: "from-rose-500 to-pink-600",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
  bold: {
    emoji: "🔥",
    title: "Le Confiant Audacieux",
    description: "Tu sais ce que tu veux et tu n'as pas peur d'y aller. Ta confiance attire les regards, mais tu cherches quelqu'un qui peut suivre ton rythme. Sur Embir, trouve des mecs qui aiment les personnalités fortes et le franc-parler.",
    color: "from-orange-500 to-red-600",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  social: {
    emoji: "🦋",
    title: "Le Papillon Social",
    description: "Tu vis pour les rencontres, les éclats de rire et les soirées improvisées. Pour toi, chaque nouvelle personne est une histoire qui commence. Embir te connecte avec une communauté vibrante prête à sortir et s'amuser.",
    color: "from-purple-500 to-indigo-600",
    gradient: "from-purple-500/20 to-indigo-500/20",
  },
  adventurous: {
    emoji: "🌍",
    title: "L'Aventurier Libre",
    description: "Les sentiers battus, c'est pour les autres. Tu préfères les chemins de traverse et les rencontres imprévues. Tu veux un partenaire qui te rejoindra dans tes explorations. Embir attire les esprits libres qui refusent les cases.",
    color: "from-emerald-500 to-teal-600",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
};

export default function GayTestPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnswer = (score: string) => {
    const newScores = { ...scores, [score]: (scores[score] || 0) + 1 };
    setScores(newScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setScores({});
    setResult(null);
    setCopied(false);
  };

  const shareText = result
    ? `🌈 J'ai passé le test "Quel mec gay es-tu ?" et je suis "${results[result].emoji} ${results[result].title}" !\n\nDécouvre ton type sur Embir → https://embir.xyz/test-gay\n\n#Embir #GayDating #RencontreGay`
    : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await handleCopy();
    }
  };

  if (result && results[result]) {
    const r = results[result];
    return (
      <main className="emb-page min-h-screen">
        <section className="py-16 px-4 sm:px-6">
          <div className="emb-container max-w-lg text-center">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 sm:p-10">
              <div className="text-7xl mb-4">{r.emoji}</div>
              <div className={`inline-block rounded-full bg-gradient-to-r ${r.color} px-4 py-1 text-sm font-semibold text-white mb-4`}>
                Ton type gay
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{r.title}</h1>
              <p className="text-white/60 text-base leading-relaxed mb-8">{r.description}</p>

              <div className={`rounded-2xl bg-gradient-to-br ${r.gradient} border border-white/10 p-5 mb-8`}>
                <p className="text-white/80 text-sm font-medium">
                  Rejoins Embir — l&apos;app de rencontre gay 100% gratuite
                </p>
                <Link
                  href="/auth/register"
                  className={`mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${r.color} px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02]`}
                >
                  Créer mon profil gratuitement ✨
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="rounded-full bg-white/[0.08] border border-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.12] transition-all"
                >
                  📤 Partager mon résultat
                </button>
                <button
                  onClick={handleCopy}
                  className="rounded-full bg-white/[0.05] border border-white/10 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/[0.08] transition-all"
                >
                  {copied ? "✅ Copié !" : "📋 Copier le texte"}
                </button>
                <button
                  onClick={handleRestart}
                  className="rounded-full bg-white/[0.03] border border-white/10 px-6 py-3 text-sm font-medium text-white/50 hover:bg-white/[0.06] transition-all"
                >
                  🔄 Refaire le test
                </button>
              </div>
            </div>

            <p className="text-white/30 text-xs mt-8">
              Plus de 50 000 mecs ont déjà fait le test. Et toi, t&apos;es quel type ?
            </p>
          </div>
        </section>
      </main>
    );
  }

  const current = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <main className="emb-page min-h-screen">
      <section className="py-16 px-4 sm:px-6">
        <div className="emb-container max-w-lg">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌈</div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Quel mec gay es-tu ?
            </h1>
            <p className="text-white/50 text-base">
              {questions.length} questions pour découvrir ton type. Prêt ?
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] mb-8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/30 text-xs text-center -mt-6 mb-8">
            Question {step + 1}/{questions.length}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {current.q}
            </h2>
            <div className="space-y-3">
              {current.answers.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(a.score)}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-rose-400/30 px-5 py-4 text-white/80 hover:text-white text-sm sm:text-base transition-all"
                >
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
