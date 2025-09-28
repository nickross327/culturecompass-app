
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, ExternalLink, Cloud } from 'lucide-react';

export default function StaticExportPage() {
  const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CultureCompass – Cultural Dos & Don'ts + AI Travel Planner</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Explore 90+ countries with cultural dos & don'ts and an AI travel planner. Travel smarter and respectfully with CultureCompass.">
  <meta property="og:title" content="CultureCompass">
  <meta property="og:description" content="90+ countries • cultural dos & don'ts • AI travel planner">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://culturecompass.app/">
  <style>
    :root { color-scheme: light dark; }
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.5; }
    header { padding: 32px 16px; background: #0b1220; color: #fff; }
    header .wrap, main .wrap, footer .wrap { max-width: 980px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p.lead { margin: 0; font-size: 18px; opacity: 0.95; }
    .cta { margin-top: 16px; display:flex; gap:12px; flex-wrap:wrap; }
    .badge { display:inline-block; padding:10px 14px; background:#16a34a; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; }
    main { padding: 32px 16px; }
    section { margin-bottom: 32px; }
    h2 { font-size: 22px; margin: 0 0 8px; }
    .grid { display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .card { border: 1px solid #d8dbe1; border-radius: 12px; padding: 16px; background: #fff; }
    .shots { display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); }
    .shot { border:1px solid #d8dbe1; border-radius:12px; aspect-ratio: 9/19.5; background:#f5f7fb; display:flex; align-items:center; justify-content:center; color:#5c6270; font-size:14px; }
    footer { border-top:1px solid #e7e9ee; padding: 24px 16px; font-size: 14px; }
    a { color: #0b57d0; }
    .muted { color:#596275; font-size: 14px; }
    @media (prefers-color-scheme: dark) {
      header { background:#0b1220; color:#fff; }
      .card, .shot { background:#121826; border-color:#263043; color:#cfd7e6; }
      footer { border-color:#263043; }
      body { background:#0b1220; color:#e8eefc; }
      a { color:#8ab4ff; }
      .badge { background:#15803d; }
    }
  </style>
</head>
<body>
  <header role="banner">
    <div class="wrap">
      <h1>CultureCompass</h1>
      <p class="lead">Explore <strong>90+ countries</strong> with cultural <strong>dos & don'ts</strong> and plan smarter with our <strong>AI travel planner</strong>.</p>
      <div class="cta" aria-label="Store badges">
        <div class="badge" aria-label="Available on the Web">Available Now on All Devices</div>
      </div>
      <p class="muted" style="margin-top:8px;">Made by The Language Club Limited (UK). No JavaScript required to view this page.</p>
    </div>
  </header>
  <main id="content" role="main">
    <div class="wrap">
      <section aria-labelledby="features">
        <h2 id="features">What you get</h2>
        <div class="grid">
          <div class="card">
            <strong>90+ Country Guides</strong>
            <p>Essential etiquette, greetings, and norms—quickly understand what's respectful in each destination.</p>
          </div>
          <div class="card">
            <strong>Cultural Dos & Don'ts</strong>
            <p>Clear, actionable guidance to avoid faux pas at work, at the table, and in public.</p>
          </div>
          <div class="card">
            <strong>AI Travel Planner</strong>
            <p>Ask questions and get instant, context-aware suggestions for itineraries and cultural situations.</p>
          </div>
          <div class="card">
            <strong>Lightweight & Offline-friendly</strong>
            <p>Fast, distraction-free experience with cached guides for when you're on the move.</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="screens">
        <h2 id="screens">In-app preview</h2>
        <div class="shots" role="list">
          <div class="shot" role="listitem">Country guide screen</div>
          <div class="shot" role="listitem">Dos & Don'ts cards</div>
          <div class="shot" role="listitem">AI planner prompt</div>
          <div class="shot" role="listitem">Badges & progress</div>
        </div>
        <p class="muted">Screens are illustrative; your App Store screenshots will match the live iOS UI.</p>
      </section>
      <section aria-labelledby="about">
        <h2 id="about">About</h2>
        <p><strong>CultureCompass</strong> is built by <strong>The Language Club Limited</strong>, United Kingdom. We focus on respectful, informed travel—no clutter, just the essentials.</p>
        <p>Support: <a href="mailto:support@culturecompass.app">support@culturecompass.app</a></p>
      </section>
    </div>
  </main>
  <footer role="contentinfo">
    <div class="wrap">
      <span>&copy; 2025 The Language Club Limited. All rights reserved.</span>
      &nbsp;•&nbsp; <a href="/privacy.html">Privacy Policy</a>
      &nbsp;•&nbsp; <a href="/terms.html">Terms</a>
    </div>
  </footer>
</body>
</html>`;

  const privacyHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Privacy Policy – CultureCompass</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Privacy Policy for CultureCompass by The Language Club Limited.">
  <style>
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; padding:24px; max-width: 900px; }
    h1,h2 { line-height:1.25 }
    a { color:#0b57d0; }
    @media (prefers-color-scheme: dark) { body { background:#0b1220; color:#e8eefc } a { color:#8ab4ff } }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p><strong>Effective date:</strong> 25 September 2025</p>
  <p><strong>CultureCompass</strong> is provided by <strong>The Language Club Limited</strong> ("we", "us", "our"), based in the United Kingdom. This policy explains what we collect, how we use it, and your choices.</p>

  <h2>Summary</h2>
  <ul>
    <li>We collect minimal personal data to operate the app (e.g., account email if you sign up).</li>
    <li>Your AI questions (prompts) are processed to generate answers; we do not use them to build advertising profiles.</li>
    <li>You can request access, deletion, or correction of your data at any time.</li>
  </ul>

  <h2>Data We Collect</h2>
  <ul>
    <li><strong>Account data:</strong> email, display name (if provided), and authentication tokens.</li>
    <li><strong>App usage:</strong> country guide views, badge progress, and basic diagnostic events (e.g., errors, crashes).</li>
    <li><strong>AI queries:</strong> the text you submit to the AI planner and the generated responses. We process these to deliver the feature and to prevent abuse.</li>
    <li><strong>Device data:</strong> app version, device model, OS version, and non-precise region/country (for localization). We do not collect precise location unless you explicitly enable a location feature.</li>
  </ul>

  <h2>How We Use Data</h2>
  <ul>
    <li>Provide and secure the service (authentication, fraud and abuse prevention).</li>
    <li>Deliver core features (country guides, dos & don'ts, AI planner, badges, offline caching).</li>
    <li>Understand and improve performance (aggregated analytics and diagnostics).</li>
    <li>Respond to support requests.</li>
  </ul>

  <h2>AI Processing</h2>
  <p>To provide AI responses, we send your prompts to third-party AI providers under contract. Where supported, prompts are not used to train public models. We apply retention limits and access controls appropriate to the service. Do not include sensitive personal data in prompts.</p>

  <h2>Legal Bases (UK & EU GDPR)</h2>
  <ul>
    <li><strong>Performance of a contract:</strong> to provide requested features.</li>
    <li><strong>Legitimate interests:</strong> to secure and improve the app (you may object at any time).</li>
    <li><strong>Consent:</strong> for optional features such as notifications or analytics where required.</li>
  </ul>

  <h2>Data Sharing</h2>
  <p>We share data with vendors who process it on our behalf (e.g., authentication, analytics, AI). We do not sell personal data.</p>

  <h2>International Transfers</h2>
  <p>Where data is transferred outside the UK/EU, we use appropriate safeguards (e.g., UK/EU Standard Contractual Clauses).</p>

  <h2>Retention</h2>
  <p>Account data is retained while your account is active. AI prompts may be retained for a limited period for service quality and abuse prevention, then deleted or anonymized. You can request deletion at any time.</p>

  <h2>Your Rights</h2>
  <p>Subject to law, you may request: access, correction, deletion, portability, restriction, and to object to certain processing. You may also withdraw consent where applicable.</p>

  <h2>Children</h2>
  <p>CultureCompass is not directed to children under 13 (or as defined by local law). We do not knowingly collect children's data.</p>

  <h2>Security</h2>
  <p>We use technical and organizational measures appropriate to the risk. No method is 100% secure.</p>

  <h2>Contact</h2>
  <p>The Language Club Limited (UK)<br>
     Email: <a href="mailto:privacy@culturecompass.app">privacy@culturecompass.app</a></p>

  <h2>Changes</h2>
  <p>We will update this policy as needed and indicate the effective date above.</p>
</body>
</html>`;

  const termsHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Terms of Service – CultureCompass</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Terms of Service for CultureCompass by The Language Club Limited.">
  <style>
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; padding:24px; max-width: 900px; }
    h1,h2 { line-height:1.25 }
    a { color:#0b57d0; }
    @media (prefers-color-scheme: dark) { body { background:#0b1220; color:#e8eefc } a { color:#8ab4ff } }
  </style>
</head>
<body>
  <h1>Terms of Service</h1>
  <p><strong>Effective date:</strong> 25 September 2025</p>

  <h2>1. Agreement</h2>
  <p>These Terms govern your use of the CultureCompass app and website ("Service"), provided by The Language Club Limited("we", "us"). By using the Service, you agree to these Terms.</p>

  <h2>2. Use of the Service</h2>
  <p>You must comply with applicable laws and not misuse the Service. You may not reverse engineer, scrape at scale, or interfere with security features.</p>

  <h2>3. Accounts</h2>
  <p>You are responsible for your account and keeping your credentials secure. If you use third-party sign-in, you must also comply with that provider's terms. If other sign-ins are offered, "Sign in with Apple" is available on iOS as required by Apple policy.</p>

  <h2>4. Content</h2>
  <p>The Service provides cultural information and AI-generated responses. We do not guarantee accuracy or completeness; use judgment and verify critical information.</p>

  <h2>5. Subscriptions & Payments</h2>
  <p>If subscriptions or in-app purchases are offered, pricing and terms will be displayed in the app and processed via Apple's in-app purchase system on iOS.</p>

  <h2>6. Acceptable Use</h2>
  <p>No unlawful, harmful, or abusive use. Do not submit sensitive personal data in AI prompts.</p>

  <h2>7. Intellectual Property</h2>
  <p>All rights in the Service, including text, design, and trademarks, are owned by The Language Club Limited or its licensors.</p>

  <h2>8. Disclaimers</h2>
  <p>The Service is provided "as is" without warranties. We disclaim implied warranties to the maximum extent permitted by law.</p>

  <h2>9. Limitation of Liability</h2>
  <p>To the extent permitted by law, we are not liable for indirect or consequential damages. Our aggregate liability for claims related to the Service will not exceed the amounts you paid in the prior 12 months.</p>

  <h2>10. Termination</h2>
  <p>We may suspend or terminate access for breach of these Terms or misuse of the Service.</p>

  <h2>11. Changes</h2>
  <p>We may update these Terms from time to time. Continued use after changes indicates acceptance.</p>

  <h2>12. Contact</h2>
  <p>The Language Club Limited<br>
     Email: <a href="mailto:support@culturecompass.app">support@culturecompass.app</a></p>
</body>
</html>`;

  const workerScript = `export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' ) {
      return new Response(INDEX_HTML, { headers: { 'content-type': 'text/html; charset=UTF-8' }});
    }
    if (url.pathname === '/privacy' || url.pathname === '/privacy.html') {
      return new Response(PRIVACY_HTML, { headers: { 'content-type': 'text/html; charset=UTF-8' }});
    }
    if (url.pathname === '/terms' || url.pathname === '/terms.html') {
      return new Response(TERMS_HTML, { headers: { 'content-type': 'text/html; charset=UTF-8' }});
    }
    // For all other requests, forward to the Base44 origin.
    // Ensure your Base44 app URL is set as the origin in your Cloudflare Worker settings.
    return fetch(request);
  }
}

// Paste your exact HTML content (template literals are used here for clarity):
const INDEX_HTML = \`${indexHtml.replace(/`/g, '\\`')}\`;
const PRIVACY_HTML = \`${privacyHtml.replace(/`/g, '\\`')}\`;
const TERMS_HTML  = \`${termsHtml.replace(/`/g, '\\`')}\`;
`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Cloudflare Worker for Apple Compliance</h1>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 text-left max-w-4xl mx-auto rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Cloud className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <strong>The ultimate solution for App Store compliance.</strong> This Cloudflare Worker will intercept requests for your homepage, privacy, and terms pages, serving static HTML that works without JavaScript. All other requests will pass through to your interactive Base44 app.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Complete Cloudflare Worker Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">Copy this entire script and paste it into a new Cloudflare Worker.</p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => copyToClipboard(workerScript, 'Cloudflare Worker script')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Full Script
                </button>
              </div>
              <div className="bg-slate-800 text-white p-4 rounded-lg max-h-[500px] overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">{workerScript}</pre>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">How to Deploy:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Log in to your Cloudflare account.</li>
              <li>Navigate to "Workers & Pages" and create a new Worker.</li>
              <li>Give it a name (e.g., `culturecompass-static-server`).</li>
              <li>Paste the complete script from above into the editor.</li>
              <li>Click "Deploy".</li>
              <li>Go to your Worker's settings, add a "Custom Domain" or "Route", and set it to handle traffic for `culturecompass.app/*`.</li>
              <li><strong>Important:</strong> Ensure your DNS for `culturecompass.app` points to Cloudflare.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
