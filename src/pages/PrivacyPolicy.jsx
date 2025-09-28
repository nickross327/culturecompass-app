import React from 'react';

const PrivacyPolicyContent = () => {
  const privacyPolicyHtml = `
    <style>
      .privacy-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
        color: #1e293b;
        background: #ffffff;
      }
      .privacy-container h1 {
        color: #1e40af;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 15px;
        margin-bottom: 30px;
        font-size: 2.5rem;
      }
      .privacy-container h2 {
        color: #1e40af;
        margin-top: 40px;
        margin-bottom: 20px;
        font-size: 1.5rem;
        border-left: 4px solid #3b82f6;
        padding-left: 15px;
      }
      .privacy-container p {
        margin-bottom: 15px;
        font-size: 1rem;
      }
      .privacy-container ul {
        margin-bottom: 20px;
        padding-left: 25px;
      }
      .privacy-container li {
        margin-bottom: 8px;
      }
      .privacy-container strong {
        color: #1e40af;
        font-weight: 600;
      }
      .privacy-container a {
        color: #2563eb;
        text-decoration: underline;
      }
      .privacy-container a:hover {
        color: #1d4ed8;
      }
      .effective-date {
        background: #f1f5f9;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
        margin-bottom: 30px;
      }
      @media (prefers-color-scheme: dark) {
        .privacy-container {
          background: #0f172a;
          color: #e2e8f0;
        }
        .privacy-container h1,
        .privacy-container h2,
        .privacy-container strong {
          color: #93c5fd;
        }
        .effective-date {
          background: #1e293b;
          border-left-color: #3b82f6;
        }
      }
    </style>
    
    <div class="privacy-container">
      <div class="effective-date">
        <p><strong>Effective date:</strong> <span id="date">January 25, 2025</span></p>
        <p><strong>CultureCompass</strong> is provided by <strong>The Language Club Limited</strong> ("we", "us", "our"), based in the United Kingdom.</p>
      </div>

      <h1>Privacy Policy</h1>

      <h2>Summary</h2>
      <ul>
        <li>We collect minimal personal data to operate the app (e.g., account email if you sign up).</li>
        <li>Your AI questions (prompts) are processed to generate answers; we do not use them to build advertising profiles.</li>
        <li>You can request access, deletion, or correction of your data at any time.</li>
        <li>We never sell your personal information to third parties.</li>
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
      
      <div style="margin-top: 60px; padding: 30px; background: #f8fafc; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 0.9rem;">
          © 2025 The Language Club Limited • United Kingdom<br>
          This page works without JavaScript for accessibility and compliance.
        </p>
      </div>
    </div>
  `;

  return <div dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />;
};

// Add noscript fallback
const NoScriptPrivacyPolicy = () => (
  <noscript>
    <PrivacyPolicyContent />
  </noscript>
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <NoScriptPrivacyPolicy />
      <div className="prose lg:prose-xl max-w-4xl mx-auto p-6">
        <PrivacyPolicyContent />
      </div>
    </>
  );
}