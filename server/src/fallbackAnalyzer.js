/**
 * PhishLens AI - Rule-Based Phishing & Social Engineering Fallback Analyzer
 *
 * Provides instant, highly accurate heuristic threat evaluation when the Gemini AI
 * service experiences 503 high demand, rate limits (429), or timeouts.
 */

// Heuristic pattern definitions
const THREAT_PATTERNS = [
  {
    id: 'urgency',
    title: 'Artificial Urgency & Time Pressure',
    weight: 20,
    regex: /\b(urgent(ly)?|immediately|within \d+ (hours?|mins?|minutes?|days?)|act now|action required|expires? (soon|today|in \d+)|time[- ]sensitive|right away|asap|promptly|final notice|24 hours?|12 hours?|immediate action)\b/i,
    explanation: 'Uses artificial deadlines and high-pressure phrasing to force a quick decision before the victim can verify authenticity.'
  },
  {
    id: 'suspension_threats',
    title: 'Account Suspension & Coercive Threats',
    weight: 25,
    regex: /\b(account (has been |is |was )?(suspended|locked|restricted|disabled|frozen|blocked|on hold|deactivated)|security (alert|breach|incident)|unauthorized (access|activity|login|transaction)|prevent (permanent )?suspension|terminate (your )?account|legal action|law enforcement|avoid penalty|account closure)\b/i,
    explanation: 'Threatens negative consequences (account closure, freeze, or legal penalties) to cause panic and compel immediate compliance.'
  },
  {
    id: 'credential_harvesting',
    title: 'Sensitive Credential & Identity Solicitation',
    weight: 25,
    regex: /\b(verify (your )?(identity|account|credentials?|details|login)|(confirm|update|enter|validate) (your )?(password|pin|passcode|otp|one-time code|social security|ssn|credit card|card details|billing details)|click here to (log in|login|verify|unlock)|authenticate your account|enter your credentials)\b/i,
    explanation: 'Directly requests sensitive authentication credentials, login verification, or personal identifiable information.'
  },
  {
    id: 'financial_manipulation',
    title: 'Financial Demand or Unconventional Payment',
    weight: 25,
    regex: /\b(gift cards?|apple gift cards?|scratch[- ]off|redemption codes?|wire transfer|western union|zelle|crypto(currency)?|bitcoin|unpaid (customs|shipping|duty|fee)|processing fee|billing (update|failure)|refund (claim|pending)|reimburse you|unpaid duty of \$\d+)\b/i,
    explanation: 'Solicits payments, wire transfers, unusual gift card scratch-off codes, or fake customs/shipping fees.'
  },
  {
    id: 'suspicious_links',
    title: 'Deceptive or Unverified Link Structure',
    weight: 25,
    test: (text) => {
      // Check for suspicious domains, IP addresses, or spoofed brand hyphens
      const urlRegex = /(https?:\/\/[^\s]+)/gi;
      const urls = text.match(urlRegex) || [];
      const suspiciousTlds = /\.(xyz|top|info|club|work|buzz|click|icu|gq|cf|tk|ml|ga|link|vip|ru|cn|cc|to)\b/i;
      const ipUrl = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;
      const hyphenBrand = /(chase|paypal|netflix|usps|apple|amazon|google|microsoft|dhl|fedex|wellsfargo)-[a-z0-9-]+\.[a-z]{2,}/i;
      const plainHttp = /http:\/\/[^\s]+/i;

      const hasSuspiciousTld = urls.some(u => suspiciousTlds.test(u));
      const hasIp = urls.some(u => ipUrl.test(u));
      const hasHyphenBrand = urls.some(u => hyphenBrand.test(u)) || hyphenBrand.test(text);
      const hasHttpWithAction = plainHttp.test(text) && /(verify|login|auth|update|track|secure)/i.test(text);

      return hasSuspiciousTld || hasIp || hasHyphenBrand || hasHttpWithAction;
    },
    explanation: 'Contains links pointing to suspicious top-level domains, unencrypted HTTP protocols, or hyphenated brand typosquatting (e.g. brand-verify.xyz).'
  },
  {
    id: 'authority_impersonation',
    title: 'Brand or Executive Authority Impersonation',
    weight: 20,
    test: (text) => {
      const brandRegex = /\b(Chase|Bank of America|Wells Fargo|Citibank|Capital One|PayPal|Venmo|Netflix|Apple|Amazon|Microsoft|USPS|FedEx|UPS|DHL|IRS|CEO|Chief Executive Officer|Executive Board|Talent HR)\b/i;
      if (!brandRegex.test(text)) return false;

      // Only flag as impersonation risk if paired with phishing action cues (e.g. links, urgency, payments, credentials)
      const actionContext = /\b(verify|suspend|locked|click|link|login|gift card|wire|urgent|pay|fee|duty|code|scratch|reply|reimburse|purchase|board meeting)\b/i;
      return actionContext.test(text);
    },
    explanation: 'Leverages trusted organizational brand names or executive seniority alongside actionable requests to create a false aura of legitimacy.'
  },
  {
    id: 'social_engineering_lures',
    title: 'Unsolicited Lure or Employment Fraud',
    weight: 25,
    regex: /\b(remote (data entry|customer assistant|job offer)|pay is \$\d+|\$\d+-\$\d+\/hour|no (prior )?experience (required|needed)|equipment check|lottery|winner|won \$|inheritance|unclaimed funds|secret shopper|whatsapp contact)\b/i,
    explanation: 'Promises unrealistic easy income, unsolicited jobs without required experience, or prizes to lure the recipient into advance-fee scams.'
  }
];

// Contextual recommendations generator
function generateRecommendations(triggeredIds, riskScore) {
  if (riskScore <= 15) {
    return [
      'This message does not present obvious deception indicators.',
      'Exercise normal digital hygiene: verify unexpected attachment sources before downloading.',
      'Always check that the sender email or phone number matches your organization’s known directory.'
    ];
  }

  const recs = [
    'Do not click any embedded links or open attachments from this message.',
    'Never provide passwords, 2FA/OTP codes, or banking credentials in response to an unverified message.'
  ];

  if (triggeredIds.includes('suspicious_links') || triggeredIds.includes('authority_impersonation')) {
    recs.push('Navigate independently to the company’s official website or mobile app rather than using links in the text.');
  }

  if (triggeredIds.includes('financial_manipulation')) {
    recs.push('Legitimate executives, banks, and government agencies will never ask for gift cards, crypto, or immediate wire transfers.');
  }

  if (triggeredIds.includes('suspension_threats')) {
    recs.push('Contact customer support using the verified phone number printed on your physical card or official statements.');
  }

  if (triggeredIds.includes('social_engineering_lures')) {
    recs.push('Legitimate employers never send checks to purchase home-office equipment before conducting verified interviews.');
  }

  // Ensure maximum 4 concise recommendations
  return recs.slice(0, 4);
}

// Categorization helper
function determineCategory(triggeredIds, riskScore) {
  if (riskScore <= 15) {
    return 'Legitimate Communication (Fallback Analysis)';
  }

  if (triggeredIds.includes('credential_harvesting') && triggeredIds.includes('suspicious_links')) {
    return 'Credential Phishing (Rule-Based Fallback)';
  }
  if (triggeredIds.includes('financial_manipulation') && triggeredIds.includes('authority_impersonation')) {
    return 'Business Email Compromise / Impersonation (Rule-Based Fallback)';
  }
  if (triggeredIds.includes('social_engineering_lures')) {
    return 'Employment Scam / Advance-Fee Fraud (Rule-Based Fallback)';
  }
  if (triggeredIds.includes('suspension_threats') && triggeredIds.includes('authority_impersonation')) {
    return 'Account Takeover / Smishing (Rule-Based Fallback)';
  }
  if (triggeredIds.includes('suspicious_links')) {
    return 'Suspicious URL Phishing (Rule-Based Fallback)';
  }

  return 'Social Engineering Lure (Rule-Based Fallback)';
}

/**
 * Analyzes text using heuristic cybersecurity rules.
 * @param {string} text - Message text to inspect
 * @returns {object} Formatted analysis result conforming to PhishLens AI schema
 */
function analyzeWithFallbackRules(text) {
  const triggeredIndicators = [];
  let rawScore = 0;

  for (const pattern of THREAT_PATTERNS) {
    let matched = false;
    if (pattern.regex && pattern.regex.test(text)) {
      matched = true;
    } else if (typeof pattern.test === 'function' && pattern.test(text)) {
      matched = true;
    }

    if (matched) {
      triggeredIndicators.push({
        id: pattern.id,
        title: pattern.title,
        explanation: pattern.explanation
      });
      rawScore += pattern.weight;
    }
  }

  // Cap score at 100 max
  const riskScore = Math.min(100, Math.max(0, rawScore));

  // Determine threat severity level
  let riskLevel = 'Safe';
  if (riskScore >= 85) {
    riskLevel = 'Critical';
  } else if (riskScore >= 65) {
    riskLevel = 'High';
  } else if (riskScore >= 35) {
    riskLevel = 'Medium';
  } else if (riskScore >= 15) {
    riskLevel = 'Low';
  }

  const triggeredIds = triggeredIndicators.map(i => i.id);
  const category = determineCategory(triggeredIds, riskScore);
  const recommendations = generateRecommendations(triggeredIds, riskScore);

  // Build clean summary clearly labeled as rule-based fallback
  let summary = '';
  if (riskScore >= 85) {
    summary = `[Rule-Based Fallback Analysis] High-severity phishing indicators detected: this message combines urgent pressure, threat narratives, and deceptive requests characteristic of an active attack.`;
  } else if (riskScore >= 65) {
    summary = `[Rule-Based Fallback Analysis] Significant social engineering markers detected: message exhibits unverified authority claims and suspicious calls to action.`;
  } else if (riskScore >= 35) {
    summary = `[Rule-Based Fallback Analysis] Suspicious elements identified that warrant caution before interacting or providing details.`;
  } else if (riskScore >= 15) {
    summary = `[Rule-Based Fallback Analysis] Low risk detected: message contains minor unsolicited or marketing traits without malicious payloads.`;
  } else {
    summary = `[Rule-Based Fallback Analysis] Evaluated with cybersecurity heuristic rules (AI temporarily unavailable). No common phishing, spoofing, or credential theft patterns were detected.`;
  }

  return {
    riskLevel,
    riskScore,
    summary,
    category,
    indicators: triggeredIndicators.map(({ title, explanation }) => ({ title, explanation })),
    recommendations,
    engine: 'Rule-based fallback analysis',
    isFallback: true
  };
}

module.exports = {
  analyzeWithFallbackRules
};
