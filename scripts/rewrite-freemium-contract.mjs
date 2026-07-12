import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOTS = [
  "messages",
  "src/seo",
  "src/app/[locale]",
  "src/components/landing",
  "src/components/seo",
];
const FILES = [
  "src/app/llms.txt/route.ts",
  "src/app/manifest.ts",
  "src/components/rich-content.tsx",
  "src/components/seo-pages.tsx",
  "src/components/ShareWidget.tsx",
  "src/lib/landing-copy.ts",
];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".json"]);

const FR_PROMISE = "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.";
const EN_PROMISE = "Everything needed to meet someone is free. No credit card required.";
const ES_PROMISE = "Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria.";

function preserveInitialCase(source, replacement) {
  if (/^[A-ZÀ-ÖØ-Þ]/.test(source)) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function rewriteFreemiumCopy(input) {
  let output = input
    // Repair artifacts left by the previous broad rewrite before applying the
    // durable public contract.
    .replace(/\bEverything is free(?:, for everyone)?\.?/gi, EN_PROMISE)
    .replace(/\bAll (?:product )?features are free\.?/gi, EN_PROMISE)
    .replace(/\bEvery feature is free\.?/gi, EN_PROMISE)
    .replace(/\bTout est gratuit(?:, pour tout le monde)?\.?/gi, FR_PROMISE)
    .replace(/\bToutes les fonctionnalités sont gratuites\.?/gi, FR_PROMISE)
    .replace(/\bcompletely free core connections\b/gi, "free core connections without a credit card")
    .replace(/\bcompletely free\b/gi, "free for core connections")
    .replace(/\benti[eè]rement gratuit(e)? pour les connexions essentielles\b/gi, (_match, feminine) =>
      feminine ? "gratuite pour les connexions essentielles" : "gratuit pour les connexions essentielles",
    )
    .replace(/\bEmbir at launch is free for core connections\.[^"\n]*/gi, EN_PROMISE)
    .replace(/\bfree for core connections core connections\b/gi, "free core connections")
    .replace(/transparent transparent optional services/gi, "transparent optional services")
    .replace(/a transparent optional services/gi, "transparent optional services")
    .replace(/the transparent optional services is/gi, "the optional-services model is")
    .replace(/the transparent optional services will/gi, "optional services will")
    .replace(/avec un options facultatives transparentes/gi, "avec des options facultatives transparentes")
    .replace(/options premium optionnelles/gi, "services premium facultatifs")
    .replace(/100\s*%\s*Everything needed to meet someone is free\. No credit card required/gi, EN_PROMISE)
    .replace(/everything will be Everything needed to meet someone is free\. No credit card required/gi, "everything will be free")
    .replace(/stay Everything needed to meet someone is free\. No credit card required/gi, "keep every feature free")
    .replace(/application de rencontre gay connexions essentielles gratuites/gi, "application de rencontre gay dont les connexions essentielles sont gratuites")
    .replace(/application de rencontre gay majeure connexions essentielles gratuites/gi, "grande application de rencontre gay dont les connexions essentielles sont gratuites")
    .replace(/app de rencontre gay connexions essentielles gratuites/gi, "app de rencontre gay dont les connexions essentielles sont gratuites")
    .replace(
      /We're not going to tell you everything will be free forever\./gi,
      EN_PROMISE,
    )
    .replace(
      /Why not just stay free forever\?/gi,
      "How does Embir fund the service?",
    )
    .replace(
      /Pourquoi ne pas rester gratuit pour toujours\s*\?/gi,
      "Comment Embir finance-t-il le service ?",
    )
    .replace(
      /100\s*%\s*free during (?:our |the )?launch/gi,
      (match) => preserveInitialCase(match, "free for core connections"),
    )
    .replace(
      /100\s*%\s*gratuit(?:e)? au lancement/gi,
      (match) =>
        preserveInitialCase(
          match,
          /gratuite/i.test(match)
            ? "gratuite pour les connexions essentielles"
            : "gratuit pour les connexions essentielles",
        ),
    )
    .replace(
      /lifetime premium access/gi,
      (match) => preserveInitialCase(match, "early access to optional services"),
    )
    .replace(
      /acc[eè]s premium [aà] vie/gi,
      (match) => preserveInitialCase(match, "accès anticipé aux services facultatifs"),
    )
    .replace(
      /premium [aà] vie/gi,
      (match) => preserveInitialCase(match, "services premium facultatifs"),
    )
    .replace(
      /lifetime premium/gi,
      (match) => preserveInitialCase(match, "optional services"),
    )
    .replace(
      /no premium tiers/gi,
      (match) => preserveInitialCase(match, "no credit card for core connections"),
    )
    .replace(
      /no paid features/gi,
      (match) => preserveInitialCase(match, "no credit card for core connections"),
    )
    .replace(
      /gratis para siempre/gi,
      (match) => preserveInitialCase(match, "gratis para las conexiones esenciales"),
    )
    .replace(
      /premium de por vida/gi,
      (match) => preserveInitialCase(match, "servicios premium opcionales"),
    )
    .replace(
      /100\s*%\s*free/gi,
      (match) => preserveInitialCase(match, "free for core connections"),
    )
    .replace(
      /100\s*%\s*gratuite/gi,
      (match) => preserveInitialCase(match, "gratuite pour les connexions essentielles"),
    )
    .replace(
      /100\s*%\s*gratuit/gi,
      (match) => preserveInitialCase(match, "gratuit pour les connexions essentielles"),
    )
    .replace(
      /free forever/gi,
      (match) => preserveInitialCase(match, "free for core connections"),
    )
    .replace(
      /gratuite? pour toujours/gi,
      (match) =>
        preserveInitialCase(
          match,
          /gratuite/i.test(match)
            ? "gratuite pour les connexions essentielles"
            : "gratuit pour les connexions essentielles",
        ),
    )
    // Remove launch-timed price promises while retaining legacy route slugs.
    .replace(/\bFree-at-launch dating platform\b/g, EN_PROMISE)
    .replace(/\bfree-at-launch dating platform\b/g, "dating platform with free core connections")
    .replace(/\ba free-at-launch (app|platform|model)\b/gi, "an $1 with free core connections")
    .replace(/\bthe free-at-launch (app|platform|model)\b/gi, "the $1 with free core connections")
    .replace(/\bfree-at-launch access\b/gi, "access to free core connections")
    .replace(/\bfree-at-launch promise\b/gi, "free-core-connection promise")
    .replace(/\bfree-at-launch\b/gi, "free for core connections")
    .replace(/\bfree at launch\b/gi, "free for core connections")
    .replace(/\bfree during (?:our |the |UK |London )?launch\b/gi, "free for core connections")
    .replace(/\bcompletely free during (?:our |the |UK )?launch\b/gi, "free for core connections")
    .replace(/\bDuring our UK launch, every feature is completely free\.?/gi, EN_PROMISE)
    .replace(/\bDuring our core connection experience, every core feature is free\b/gi, EN_PROMISE)
    .replace(/\bfor core connection features, all features are free\s*[—-]\s*messaging, matching, profiles\.?/gi, EN_PROMISE)
    .replace(/\bEverything is free, for everyone\.?/gi, EN_PROMISE)
    .replace(/\bEmbir is free for everyone, always\.?/gi, EN_PROMISE)
    .replace(/\bFree\. Forever\.?/gi, EN_PROMISE)
    .replace(/\bFree lifetime access to all features\. No catch\.?/gi, "Help shape the product and its community.")
    .replace(/\bFounding members keep lifetime access to premium features without ever paying\.?/gi, "Founding members help shape the product and receive early access to optional services.")
    .replace(/\bFree lifetime access\b/gi, "Early access to optional services")
    .replace(/\b100\s*% core connection features are free\b/gi, "Core connection features are free")
    .replace(/\bcompletely free for core connection features\b/gi, "free for core connections")
    .replace(/\ball features are free for core connection features\b/gi, "everything needed to meet someone is free")
    .replace(/\bevery feature is completely free\b/gi, "everything needed to meet someone is free")
    .replace(/\bthe launch is free so early members can test the core experience before premium features arrive\.?/gi, EN_PROMISE)
    .replace(/\bJoin while everything is free\b/gi, "Join Embir")
    .replace(/\bExperience the full platform at no cost, and help shape its future before any premium features exist\.?/gi, `${EN_PROMISE} Help shape the product.`)
    .replace(/\bA freemium model will be introduced later to fund the mobile app\.?/gi, "Optional services can fund safety, moderation and product development.")
    .replace(/\bWhen (?:the )?freemium arrives,?\s*/gi, "With optional services, ")
    .replace(/\bbefore (?:any )?(?:paid options|premium features|a freemium model) arrive\b/gi, "while helping shape the product")
    .replace(/\bThe founding phase runs through the launch period\.[^"\n]*/gi, `${EN_PROMISE} Optional services will be announced transparently and will not gate the path to a real meeting.`)
    .replace(/\bEvery feature\s*[—-][^"\n]*completely free during our UK launch\.[^"\n]*/gi, `${EN_PROMISE} Founding members help shape the product.`)
    .replace(/\bDuring our core connection experience, everything needed to meet someone is free[^"\n]*\./gi, EN_PROMISE)
    .replace(/\bEverything needed to meet someone on Embir is free\. No credit card required\.[^<"\n]*/gi, `${EN_PROMISE} Create a profile, discover compatible people and message reciprocal connections.`)
    .replace(/\bEverything needed to meet someone on Embir is free\. No credit card required\.?/gi, EN_PROMISE)
    .replace(/\bFounding members keep lifetime access to[^.<"\n]*\.?/gi, "Founding members help shape the product and receive early access to optional services.")
    .replace(/\bfree for core connection features for founding members\b/gi, "free for core connections")
    .replace(/\bfree for core connections dating app\b/gi, "dating app with free core connections")
    .replace(/\. free for core connection features\b/g, ". Core connection features are free")
    .replace(/\. free for core connections\b/g, ". Core connections are free")
    .replace(/\bYes\. free for core connection features\.?/g, EN_PROMISE)
    .replace(/\bfree for core connection features\b/gi, "free for core connections")
    .replace(/\bCore features are free for core connections(?: for all users regardless of orientation)?\.?/gi, "Core connection features are free for everyone.")
    .replace(/\bCore features free for core connections\b/gi, "Free core connection features")
    .replace(/\bEmbir is free for core connections\b/gi, "Embir's core connection features are free")
    .replace(/\bCreate your profile for free for core connections\b/gi, "Create your profile without a credit card")
    .replace(/\bJoin free for core connections\b/gi, "Join without a credit card")
    .replace(/\ban model with free core connections\b/gi, "a model with free core connections")
    .replace(/\ban? free for core connections inclusive dating app\b/gi, "an inclusive dating app with free core connections")
    .replace(/\ba free for core connections international dating platform\b/gi, "an international dating platform with free core connections")
    .replace(/\bcore connection features are free dating app\b/gi, "dating app with free core connections")
    .replace(/\bIs Embir core connection features are free\?/gi, "Are Embir's core connection features free?")
    .replace(/\bWhy is Embir core connection features are free\?/gi, "Why are Embir's core connection features free?")
    .replace(/\bEmbir core connection experience\b/gi, "Embir's core connection experience")
    .replace(/\bwith transparent optional services\b/gi, "with a transparent optional-services model")
    .replace(/\band transparent optional services\b/gi, "and a transparent optional-services model")
    .replace(/\btransparent optional services will\b/g, "Optional services will")
    .replace(/\btransparent optional services\.\b/gi, "a transparent optional-services model.")
    .replace(/\bfree launch access\b/gi, "free core connection access")
    .replace(/\ba free launch\b/gi, "free core connections")
    .replace(/\bfree launch\b/gi, "free core connections")
    .replace(/\bLaunch price\b/g, "Core access")
    .replace(/\bNo ads during the founding phase\b/gi, "No ads in core discovery")
    .replace(/\btruly free core features during the founding phase\b/gi, "free core connection features without a credit card")
    .replace(/\bCore features stay open during the founding phase:[^"\n]*\.?/gi, EN_PROMISE)
    .replace(/\bAll core features accessible at no cost during the founding phase\.?/gi, EN_PROMISE)
    .replace(/\bJoin during the founding phase to help build the community you want to date in\.?/gi, "Join and help build the community you want to meet in.")
    .replace(/\bThe founding phase is free because the business model is transparent freemium, not ad targeting\.?/gi, EN_PROMISE)
    .replace(/\bcore connection features are free for founding members; transparent freemium may fund safety later\.?/gi, "everything needed to meet someone is free without a credit card; optional services can fund safety and moderation.")
    .replace(/\bfor core connection features, Embir is free\. Core features \(profile, discovery, messaging, compatibility\) are accessible at no cost\. A freemium model may be introduced later[^<\n]*/gi, EN_PROMISE)
    .replace(/\bEmbir is free for core connections[^<\n]*When a freemium model arrives later[^<\n]*/gi, `${EN_PROMISE} Create a profile, set reciprocal preferences, discover compatible people and message your connections.`)
    .replace(/\bFounding members will receive priority access and product benefits when premium features arrive\.?/gi, "Founding members help shape the product.")
    .replace(/\bfree core connections for founding members\b/gi, "free core connections")
    .replace(/\bWhen (?:a|the) freemium model (?:launches|arrives) later,[^"\n]*/gi, "Optional services are clearly separated from core connections.")
    .replace(/\bA freemium model (?:may|will) (?:come|be introduced) later[^"\n]*/gi, "Optional services can fund safety, moderation and product development.")
    .replace(/\bYes, during the entire core connection experience\.[^"\n]*/gi, EN_PROMISE)
    .replace(/free for core connections, with a transparent optional-services model\. This page explains what is free now, why paid options may arrive later, and what will not become a trap\./gi, `${EN_PROMISE} Optional services are clearly separated from the path to a meeting.`)
    .replace(/optional services will be transparent: core discovery, messaging, and profile creation will stay free\.[^"\n]*/gi, `${EN_PROMISE} Optional services are clearly labelled and fund safety, moderation and product development.`)
    .replace(/The founding phase is the moment to join[^"\n]*/gi, "Embir is building a smaller, intentional community where members help shape the culture and product.")
    .replace(/The founding phase scale makes real moderation feasible[^"\n]*/gi, "Human moderation processes are designed to grow with the community.")
    .replace(/"q": "(?:When will Embir (?:become paid|add a premium tier|switch to freemium)|What happens when Embir (?:adds a premium tier|adds premium|goes freemium))\?",\s*\n\s*"a": "[^"]*"/gi, `"q": "How do optional services work?",\n      "a": "${EN_PROMISE} Optional services are clearly separated and cannot replace compatibility, reciprocity or consent."`)
    .replace(/a model with free core connections that lets you test everything before any premium options arrive/gi, "a model where the full path to a meeting works without a credit card")
    .replace(/No early paywall\. Join the founding community, test everything, and see for yourself before a freemium model arrives\./gi, EN_PROMISE)
    .replace(/No limited likes, no paywall on messaging\. Test the full experience\. Founding members get to shape the community before any premium features exist\./gi, `${EN_PROMISE} Founding members help shape the community.`)
    .replace(/We want to build a quality founding community before introducing any paid features\.[^"\n]*/gi, `${EN_PROMISE} Optional services can fund the mobile app, safety tools and moderation.`)
    // French contract and recurrent generated FAQ fragments.
    .replace(/\bgratuitement pendant le lancement\b/gi, "gratuitement, sans carte bancaire")
    .replace(/\bgratuite? pendant (?:notre |le |son )?lancement\b/gi, (match) =>
      preserveInitialCase(match, /gratuite/i.test(match) ? "gratuite pour les connexions essentielles" : "gratuit pour les connexions essentielles"),
    )
    .replace(/\bgratuite? au lancement\b/gi, (match) =>
      preserveInitialCase(match, /gratuite/i.test(match) ? "gratuite pour les connexions essentielles" : "gratuit pour les connexions essentielles"),
    )
    .replace(/\bgratuit[eé]s? pour tous au lancement\b/gi, "gratuit pour les connexions essentielles")
    .replace(/\bgratuit[eé]s? pour les connexions essentielles au lancement\b/gi, "gratuit pour les connexions essentielles")
    .replace(/\bgratuité totale au lancement\b/gi, "gratuité des connexions essentielles")
    .replace(/\blancement totalement gratuit\b/gi, "accès gratuit aux connexions essentielles")
    .replace(/\bPendant (?:notre |l[’']|l&apos;)?expérience de connexion,? (?:toutes les fonctionnalités|chaque fonction essentielle|les fonctionnalités principales)[^.<\n]*(?:gratuites?|gratuite)[^.<\n]*\.?/gi, FR_PROMISE)
    .replace(/\bPendant toute l'expérience de connexion, accédez à 100% des fonctionnalités sans sortir votre carte bleue\.?/gi, FR_PROMISE)
    .replace(/\bTout est gratuit pour les connexions essentielles\.?/gi, FR_PROMISE)
    .replace(/\bC'est entièrement gratuit pour les connexions essentielles\.?/gi, FR_PROMISE)
    .replace(/\bLe lancement est gratuit[^.<\n]*\.?/gi, FR_PROMISE)
    .replace(/\bGratuit pour tous au lancement\b/gi, "Connexions essentielles gratuites")
    .replace(/\bVraiment gratuit\s*[—-]\s*rejoins pendant le lancement\b/gi, "Rencontre sans carte bancaire")
    .replace(/\bEmbir au lancement est entièrement gratuit\.?/gi, FR_PROMISE)
    .replace(/\bEmbir au lancement est l'expérience gratuite la plus complète\.?/gi, FR_PROMISE)
    .replace(/\bEmbir au lancement\s*[—-]\s*fonctionnalités vraiment gratuites\.?/gi, FR_PROMISE)
    .replace(/\bEmbir au lancement est enti[eè]rement gratuit\.?/gi, FR_PROMISE)
    .replace(/\bPendant le lancement en France, tout est gratuit\.[^<"\n]*/gi, `${FR_PROMISE} Les membres fondateurs contribuent aux choix produit.`)
    .replace(/\bPas de limites artificielles pendant le lancement\b/gi, "Pas de limites artificielles sur les connexions essentielles")
    .replace(/\bGratuit, épuré, messagerie complète au lancement\b/gi, "Gratuit pour les connexions essentielles, interface épurée, messagerie incluse")
    .replace(/\bz[eé]ro abonnement pendant le lancement\b/gi, "aucune carte bancaire pour les connexions essentielles")
    .replace(/\bAucun paiement requis pour utiliser les fonctions essentielles pendant le lancement\b/gi, "Aucune carte bancaire requise pour utiliser les fonctions essentielles")
    .replace(/\bAucun cr[eé]dit, aucun abonnement pendant le lancement\b/gi, "Aucun crédit ni carte bancaire pour les connexions essentielles")
    .replace(/\bPas de crédits, pas de boosts, pas d'urgence artificielle pendant le lancement\b/gi, "Pas de crédits, de boosts ni d'urgence artificielle sur les connexions essentielles")
    .replace(/\bAccès complet et gratuit à toutes les fonctions essentielles pendant le lancement\b/gi, "Accès gratuit aux fonctions nécessaires pour rencontrer quelqu’un, sans carte bancaire")
    .replace(/\bCe qui est gratuit\s*[—-]\s*vraiment\s*[—-]\s*pendant le lancement\b/gi, "Ce qui est gratuit pour rencontrer quelqu’un")
    .replace(/\bSans paywall au lancement\b/gi, "Sans carte bancaire")
    .replace(/\bPendant le lancement, tu as accès à toutes les fonctions du produit\.[^"\n]*/gi, `${FR_PROMISE} Les services supplémentaires éventuels restent facultatifs.`)
    .replace(/\bPourquoi\+Embir\+est\+gratuit\+au\+lancement\b/gi, "Connexions+essentielles+gratuites+sur+Embir")
    .replace(/\bApplication\+de\+rencontre\+moderne\+et\+gratuite\+au\+lancement\b/gi, "Application+de+rencontre+sans+carte+bancaire")
    .replace(/\bApplication\+de\+rencontre\+sans\+abonnement\+[—-]\+100%\+gratuite\b/gi, "Application+de+rencontre+sans+carte+bancaire")
    .replace(/\. gratuit pour les connexions essentielles\b/g, ". Les connexions essentielles sont gratuites")
    .replace(/\. sans carte bancaire\b/g, ". Sans carte bancaire")
    .replace(/\bOui\. gratuit pour les connexions essentielles\.?/g, FR_PROMISE)
    .replace(/\bLa version gratuite inclura toujours les fonctions essentielles[^"\n]*\./gi, FR_PROMISE)
    .replace(/\bgratuit pour les connexions essentielles pour tous\b/gi, "connexions essentielles gratuites pour tout le monde")
    .replace(/\bgratuit pour les connexions essentielles\s*[—-]\s*toutes les fonctionnalit[eé]s\b/gi, "gratuit pour les connexions essentielles — sans carte bancaire")
    .replace(/\bEmbir expérience de connexion\b/gi, "L’expérience Embir")
    .replace(/\bfonctionnalit[eé]s compl[eè]tes accessibles sans abonnement\b/gi, "profil, découverte, réciprocité et messagerie accessibles sans carte bancaire")
    .replace(/\bune des abonnements les plus chers\b/gi, "l'un des abonnements les plus chers")
    .replace(/\bSur Embir, Tout ce qu’il faut\b/g, "Sur Embir, tout ce qu’il faut")
    .replace(/\bet Tout ce qu’il faut\b/g, "et tout ce qu’il faut")
    .replace(/\bOui, Tout ce qu'il faut\b/g, "Oui, tout ce qu'il faut")
    .replace(/\bTout ce qu’il faut pour rencontrer quelqu’un est gratuit\. Sans carte bancaire\. Sans piège, sans période d'essai, sans carte bancaire\./g, "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire ni période d'essai.")
    .replace(/\bOn ne va pas te dire que tout sera Tout ce qu'il faut pour rencontrer quelqu'un est gratuit\. Sans carte bancaire\.\. Ce serait mentir\.[^"\n]*/gi, "Le contrat d’accès porte sur le chemin vers une rencontre. Les services supplémentaires éventuels restent clairement facultatifs.")
    .replace(/\bPourquoi ne pas rester Tout ce qu'il faut pour rencontrer quelqu'un est gratuit\. Sans carte bancaire\. \?/gi, "Comment Embir finance-t-il le service ?")
    .replace(/\bLes membres fondateurs (?:conservent|recevront) l'accès prioritaire[^.<"\n]*(?:fonctionnalités premium|options facultatives)[^.<"\n]*\.?/gi, "Les membres fondateurs contribuent aux choix produit.")
    .replace(/\bavec un lancement centré sur la France \(Paris, Lyon, Marseille\)\. C'est gratuit, sans pub, et tous les profils sont vérifiés\./gi, "pour toutes les orientations, avec des connexions essentielles gratuites sans carte bancaire.")
    .replace(/\bQuand un modèle freemium arrivera plus tard,[^<\n]*/gi, "Des services facultatifs peuvent financer l’application mobile, la sécurité et la modération, sans bloquer le chemin vers une rencontre.")
    .replace(/\bOui, pendant toute l'expérience de connexion\.[^"\n]*/gi, FR_PROMISE)
    .replace(/\bgratuites pendant la phase fondatrice\b/gi, "gratuites sans carte bancaire")
    .replace(/\bLes fonctions essentielles restent ouvertes pendant la phase fondatrice[^"\n]*\.?/gi, FR_PROMISE)
    .replace(/\bPas de publicités pendant la phase fondatrice\b/gi, "Pas de publicité dans la découverte essentielle")
    .replace(/freemium futur transparent, aucun piege d'abonnement dans la phase fondatrice/gi, "services facultatifs transparents et aucun piège d'abonnement sur le chemin vers une rencontre")
    .replace(/Freemium transparent : ce qui est gratuit aujourd'hui le restera pour les fonctions de base/gi, "Connexions essentielles gratuites sans carte bancaire, services facultatifs transparents")
    .replace(/Embir expérience de connexion/gi, "L’expérience Embir")
    .replace(/La phase fondatrice est le bon moment pour rejoindre[^"\n]*/gi, "Embir construit une communauté plus intentionnelle où les membres contribuent à la culture et au produit.")
    .replace(/L'échelle de la phase fondatrice rend une vraie modération possible\./gi, "Les procédures de modération humaine sont conçues pour évoluer avec la communauté.")
    .replace(/"q": "(?:Que se passe-t-il quand Embir ajoute un tier premium|Quand Embir (?:ajoutera-t-il un tier premium|passera-t-il au freemium|passera-t-elle en freemium|deviendra-t-il payant)) \?",\s*\n\s*"a": "[^"]*"/gi, `"q": "Comment fonctionnent les services facultatifs ?",\n      "a": "${FR_PROMISE} Les services facultatifs restent séparés et ne remplacent ni la compatibilité, ni la réciprocité, ni le consentement."`)
    .replace(/Quand le freemium arrivera, il sera transparent, avec les fonctionnalites de base gratuites\./gi, "Les services facultatifs restent transparents et séparés du chemin vers une rencontre.")
    .replace(/Embir est gratuit pour les connexions essentielles afin que la communaute fondatrice puisse tester les profils, la decouverte, les messages et la compatibilite avant l'arrivee du futur freemium\./gi, FR_PROMISE)
    .replace(/La plateforme reste gratuite pour les connexions essentielles pour permettre a la communaute fondatrice de se former avant le futur modele freemium\./gi, FR_PROMISE)
    .replace(/Pas de paywall précoce\. Rejoignez la communauté fondatrice, testez tout, et voyez par vous-même avant qu'un modèle freemium n'arrive\./gi, FR_PROMISE)
    .replace(/Les membres fondateurs recevront un accès prioritaire et des avantages produit lors du lancement des fonctionnalités premium\./gi, "Les membres fondateurs contribuent aux choix produit.")
    .replace(/Yes, free for core connections\. No credit card for core connections\. You can match, chat, and meet without ever paying\. No subscription, no ads, no like limits\./gi, EN_PROMISE)
    .replace(/\bgratuit lancement\b/gi, "connexions essentielles gratuites")
    .replace(/\bPrix au lancement\b/gi, "Accès essentiel")
    // Spanish contract.
    .replace(/\bgratis en el lanzamiento\b/gi, "gratis para las conexiones esenciales")
    .replace(/\bgratis durante (?:el )?lanzamiento\b/gi, "gratis para las conexiones esenciales")
    .replace(/\bfase de lanzamiento gratuita\b/gi, ES_PROMISE);

  return output;
}

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files;
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const files = (
    await Promise.all(ROOTS.map((root) => listFiles(path.resolve(root))))
  ).flat().concat(FILES.map((file) => path.resolve(file)));
  const changed = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const rewritten = rewriteFreemiumCopy(source);
    if (rewritten === source) continue;
    changed.push(path.relative(process.cwd(), file));
    if (shouldWrite) await writeFile(file, rewritten);
  }

  console.log(JSON.stringify({
    mode: shouldWrite ? "write" : "dry-run",
    checkedFiles: files.length,
    changedFiles: changed.length,
    files: changed,
  }, null, 2));
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
