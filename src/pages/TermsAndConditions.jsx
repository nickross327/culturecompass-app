import React from 'react';

const TermsContent = () => {
  const termsOfServiceHtml = `
    <style>
      .terms-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
        color: #1e293b;
        background: #ffffff;
      }
      .terms-container h1 {
        color: #1e40af;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 15px;
        margin-bottom: 30px;
        font-size: 2.5rem;
      }
      .terms-container h2 {
        color: #1e40af;
        margin-top: 40px;
        margin-bottom: 20px;
        font-size: 1.5rem;
        border-left: 4px solid #3b82f6;
        padding-left: 15px;
      }
      .terms-container p {
        margin-bottom: 15px;
        font-size: 1rem;
      }
      .terms-container ul {
        margin-bottom: 20px;
        padding-left: 25px;
      }
      .terms-container li {
        margin-bottom: 8px;
      }
      .terms-container strong {
        color: #1e40af;
        font-weight: 600;
      }
      .terms-container a {
        color: #2563eb;
        text-decoration: underline;
      }
      .terms-container a:hover {
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
        .terms-container {
          background: #0f172a;
          color: #e2e8f0;
        }
        .terms-container h1,
        .terms-container h2,
        .terms-container strong {
          color: #93c5fd;
        }
        .effective-date {
          background: #1e293b;
          border-left-color: #3b82f6;
        }
      }
    </style>
    
    <div class="terms-container">
      <div class="effective-date">
        <p><strong>Effective date:</strong> <span id="date">January 25, 2025</span></p>
      </div>

      <h1>Terms of Service</h1>

      <h2>1. Agreement</h2>
      <p>These Terms govern your use of the CultureCompass app and website ("Service"), provided by The Language Club Limited ("we", "us"). By using the Service, you agree to these Terms.</p>

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

      <div style="margin-top: 60px; padding: 30px; background: #f8fafc; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 0.9rem;">
          © 2025 The Language Club Limited • United Kingdom<br>
          This page works without JavaScript for accessibility and compliance.
        </p>
      </div>
    </div>
  `;

  return <div dangerouslySetInnerHTML={{ __html: termsOfServiceHtml }} />;
};

// Add noscript fallback
const NoScriptTerms = () => (
  <noscript>
    <TermsContent />
  </noscript>
);

export default function TermsAndConditionsPage() {
  return (
    <>
      <NoScriptTerms />
      <div className="prose lg:prose-xl max-w-4xl mx-auto p-6">
        <TermsContent />
      </div>
    </>
  );
}