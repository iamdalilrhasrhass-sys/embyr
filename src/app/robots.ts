import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog/", "/guide/", "/guides/", "/comparaison/", "/comparison/", "/comparisons/", "/legal/", "/about/", "/faq/", "/ambassadeur/", "/ambassadrice/", "/welcome/", "/paris/", "/london/", "/new-york/", "/france/", "/uk/", "/us/", "/usa/", "/rencontre/", "/dating/", "/freemium/", "/product/", "/free-dating-app/", "/lgbtq-dating-app/", "/verified-dating-app/", "/modern-dating-app/", "/serious-dating-app/", "/grindr-alternative/", "/application-rencontre/", "/site-rencontre-gay/", "/rencontre-gay/", "/rencontre-lgbtq/", "/rencontre-serieuse/", "/rencontre-discrete/", "/rencontre-sans-abonnement/", "/rencontre-sans-pub/", "/rencontre-avec-profils-verifies/", "/profils-verifies/", "/securite-rencontre/", "/chat-gay/", "/plan-gay/", "/couple-gay/", "/bars-gay/", "/gay-pres-de-chez-moi/", "/gay-dating-app-uk/", "/gay-dating-app-usa/", "/gay-dating-in-paris/", "/application-rencontre-gay/", "/application-rencontre-gratuite/", "/dating-app-without-ads/", "/free-gay-dating-app/", "/installer-application/", "/certification/", "/temoignages/", "/test-gay/", "/top-gay-cities/", "/mode-discret/", "/videos/", "/inviter/", "/invite/"],
        disallow: [
          "/auth/",
          "/api/",
          "/dashboard/",
          "/messages/",
          "/decouvrir/",
          "/membres/",
          "/profiles/",
          "/notifications/",
          "/parametres/",
          "/favoris/",
          "/salons/",
          "/albums/",
          "/annonces/",
          "/blacklist/",
          "/forum/",
          "/verification/",
          "/admin/",
          "/reddit-setup/",
          "/sites-partenaires/",
          "/premium/",
          "/pricing/",
        ],
      },
    ],
    sitemap: "https://embir.xyz/sitemap.xml",
  };
}
