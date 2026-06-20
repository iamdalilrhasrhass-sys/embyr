import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class StaticSeoGuardTests(unittest.TestCase):
    def test_next_proxy_replaces_deprecated_middleware(self):
        self.assertFalse((ROOT / "src/middleware.ts").exists())
        proxy = ROOT / "src/proxy.ts"
        self.assertTrue(proxy.exists())
        self.assertIn("function proxy", proxy.read_text())

    def test_locale_detection_does_not_redirect_root_homepage(self):
        routing = (ROOT / "src/i18n/routing.ts").read_text()
        self.assertIn("localeDetection: false", routing)

    def test_mobile_viewport_keeps_user_zoom_available(self):
        layout = (ROOT / "src/app/[locale]/layout.tsx").read_text()
        self.assertNotIn("maximum-scale", layout)
        self.assertNotIn("user-scalable", layout)

    def test_ga4_placeholder_id_is_not_loaded(self):
        component = (ROOT / "src/components/GoogleAnalytics.tsx").read_text()
        self.assertIn("GA_MEASUREMENT_ID === 'G-XXXXXXXXXX'", component)

    def test_homepage_uses_current_keyword_h1(self):
        messages = (ROOT / "messages/en/common.json").read_text()
        self.assertIn("Free Inclusive Dating App for Every Orientation", messages)

    def test_legacy_fr_urls_redirect_to_real_pages(self):
        config = (ROOT / "next.config.ts").read_text()
        self.assertIn('source: "/fr/conditions"', config)
        self.assertIn('destination: "/fr/terms"', config)
        self.assertIn('source: "/fr/verification-age"', config)
        self.assertIn('destination: "/fr/age-verification"', config)
        self.assertIn('source: "/fr/a-propos"', config)
        self.assertIn('destination: "/fr/about"', config)

    def test_sitemap_uses_final_indexable_fr_routes(self):
        sitemap_data = (ROOT / "src/seo/sitemap-data.ts").read_text()
        self.assertIn('path: "/fr/terms"', sitemap_data)
        self.assertIn('path: "/fr/age-verification"', sitemap_data)
        self.assertIn('path: "/fr/about"', sitemap_data)
        self.assertNotIn('path: "/fr/conditions"', sitemap_data)
        self.assertNotIn('path: "/fr/verification-age"', sitemap_data)
        self.assertNotIn('path: "/fr/a-propos"', sitemap_data)


if __name__ == "__main__":
    unittest.main()
