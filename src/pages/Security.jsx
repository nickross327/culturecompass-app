import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Database, KeyRound, BookLock, ServerCog, Cloud, RefreshCw, Users, Lock, Link as LinkIcon, EyeOff, Globe, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const securityFeatures = [
    {
        category: "Infrastructure & Data Protection",
        icon: Cloud,
        items: [
            { title: "Enterprise-Grade Cloud Foundation", description: "Our platform is built on world-class, secure cloud infrastructure, ensuring high availability, scalability, and reliability for your organization." },
            { title: "Data Encryption at Rest & In-Transit", description: "All data, including user information and company content, is encrypted using industry-standard AES-256 at rest and TLS 1.3 in transit." },
            { title: "Isolated & Secure Databases", description: "Your company's data is logically isolated in a secure, multi-tenant database architecture, preventing any cross-customer data exposure." },
            { title: "Automated Backups & Disaster Recovery", description: "We perform regular, automated backups and have a robust disaster recovery plan to ensure business continuity and data integrity." }
        ]
    },
    {
        category: "Authentication & Access Control",
        icon: KeyRound,
        items: [
            { title: "Secure Authentication via Google SSO", description: "We leverage Google's secure and trusted OAuth 2.0 protocol for user authentication, reducing password-related risks." },
            { title: "Role-Based Access Control (RBAC)", description: "The platform distinguishes between B2B Admins and regular users, ensuring individuals only have access to the features relevant to their role." },
            { title: "Strict Data Segregation", description: "Our system enforces Row-Level Security (RLS), a database-level rule ensuring that users can only ever access their own data." },
            { title: "Enterprise SSO Integration", description: "For our corporate partners, we offer integration with identity providers like SAML, Okta, and Azure AD for seamless and secure user provisioning." }
        ]
    },
    {
        category: "Compliance & Privacy",
        icon: BookLock,
        items: [
            { title: "GDPR & Global Privacy Ready", description: "Our platform is designed with GDPR principles in mind, including built-in tools for data access and deletion requests to help you meet your compliance obligations." },
            { title: "Privacy by Design", description: "Features like anonymized chat profiles are intentionally designed to protect user privacy while fostering community engagement." },
            { title: "Secure International Data Centers", description: "Your data is hosted in secure, certified data centers that comply with rigorous international security and privacy standards." }
        ]
    },
    {
        category: "Application & Network Security",
        icon: ServerCog,
        items: [
            { title: "Protection Against Common Threats", description: "Our platform includes protections against common web vulnerabilities as defined by OWASP, including SQL injection and Cross-Site Scripting (XSS)." },
            { title: "DDoS Mitigation & Network Protection", description: "We employ robust network security measures, including DDoS mitigation and firewalls, to protect the service from malicious traffic and attacks." },
            { title: "Continuous Monitoring & Auditing", description: "Our systems are continuously monitored for security threats, and we maintain audit logs to track critical system activity." }
        ]
    }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Security & Trust</h1>
              <p className="text-slate-600">Our Commitment to Protecting Your Data</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Enterprise-Grade Security for Your Global Team</h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            At CultureCompass, we understand that trust is the foundation of any successful partnership. We are committed to protecting your organization's sensitive data with a multi-layered security approach, built on a robust, enterprise-grade platform. This overview details the measures we take to ensure the confidentiality, integrity, and availability of your information.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="space-y-12">
          {securityFeatures.map((category, index) => (
            <motion.section 
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{category.category}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <Card key={item.title} className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-800">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Have Specific Security Questions?</h3>
                <p className="text-blue-100 max-w-2xl">
                  Our team is ready to provide detailed documentation, answer security questionnaires, and discuss how we can meet your organization's specific compliance needs.
                </p>
              </div>
              <a href="mailto:security@culturecompass.com">
                <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold flex-shrink-0">
                  Request Security Packet
                </Button>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}