'use client'

import { useState, type ReactNode } from "react";

const toc = [
  { id: "services", num: "01", title: "Our Services" },
  { id: "ip", num: "02", title: "Intellectual Property Rights" },
  { id: "userreps", num: "03", title: "User Representations" },
  { id: "userreg", num: "04", title: "User Registration" },
  { id: "purchases", num: "05", title: "Purchases and Payment" },
  { id: "prohibited", num: "06", title: "Prohibited Activities" },
  { id: "ugc", num: "07", title: "User Generated Contributions" },
  { id: "license", num: "08", title: "Contribution License" },
  { id: "sitemanage", num: "09", title: "Services Management" },
  { id: "ppno", num: "10", title: "Privacy Policy" },
  { id: "copyrightno", num: "11", title: "Copyright Infringements" },
  { id: "terms", num: "12", title: "Term and Termination" },
  { id: "modifications", num: "13", title: "Modifications and Interruptions" },
  { id: "law", num: "14", title: "Governing Law" },
  { id: "disputes", num: "15", title: "Dispute Resolution" },
  { id: "corrections", num: "16", title: "Corrections" },
  { id: "disclaimer", num: "17", title: "Disclaimer" },
  { id: "liability", num: "18", title: "Limitations of Liability" },
  { id: "indemnification", num: "19", title: "Indemnification" },
  { id: "userdata", num: "20", title: "User Data" },
  { id: "electronic", num: "21", title: "Electronic Communications" },
  { id: "misc", num: "22", title: "Miscellaneous" },
  { id: "addclause", num: "23", title: "Role-Based Access" },
  { id: "addclauseb", num: "24", title: "User Submissions" },
  { id: "addclausec", num: "25", title: "Abuse Prevention" },
  { id: "addclaused", num: "26", title: "Platform Purpose" },
  { id: "addclausee", num: "27", title: "System Changes" },
  { id: "contact", num: "28", title: "Contact Us" },
];

type SectionTitleProps = {
  id: string;
  num: string;
  children: ReactNode;
};

type ChildrenProps = {
  children: ReactNode;
};

type ParagraphProps = {
  children: ReactNode;
  className?: string;
};

type BulletListProps = {
  items: string[];
};

const SectionTitle = ({ id, num, children }: SectionTitleProps) => (
  <h2
    id={id}
    className="flex items-center gap-3 text-xl font-bold text-slate-900 mt-12 mb-4 scroll-mt-24 border-b border-slate-200 pb-3"
  >
    <span className="text-xs font-mono font-semibold text-theme-dark-blue bg-theme-dark-blue/10 px-2 py-1 rounded tracking-widest shrink-0">
      {num}
    </span>
    <span>{children}</span>
  </h2>
);

const SubTitle = ({ children }: ChildrenProps) => (
  <h3 className="text-base font-semibold text-slate-800 mt-6 mb-2">{children}</h3>
);

const P = ({ children, className = "" }: ParagraphProps) => (
  <p className={`text-slate-600 leading-relaxed text-sm mb-3 ${className}`}>{children}</p>
);

const BulletList = ({ items }: BulletListProps) => (
  <ul className="space-y-2 mb-4 ml-1">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-theme-dark-blue shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Email = ({ address } : { address: string }) => (
  <a
    href={`mailto:${address}`}
    className="text-theme-dark-blue hover:underline font-medium transition-colors"
  >
    {address}
  </a>
);

export default function TermsAndConditions() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      {/* <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-teal-600 tracking-widest uppercase mb-0.5">
              Legal Document
            </p>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Kabataan Statistical Profile
            </h1>
          </div>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 px-3 py-2 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h8" />
            </svg>
            Contents
          </button>
        </div>

        
        {tocOpen && (
          <div className="absolute top-full right-0 left-0 bg-white border-b border-slate-200 shadow-lg z-40 max-h-80 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setTocOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-teal-50 group transition-colors"
                >
                  <span className="text-xs font-mono text-teal-500 group-hover:text-teal-700 shrink-0">
                    {item.num}
                  </span>
                  <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-tight">
                    {item.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="bg-linear-to-br from-theme-dark-blue/70 to-theme-dark-blue rounded-2xl p-8 sm:p-12 mb-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />
          <div className="relative z-10">
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-3">
              Last updated — April 15, 2026
            </p>
            <h1 className="text-3xl sm:text-4xl text-white font-black mb-4 leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-white text-sm leading-relaxed max-w-2xl">
              These terms govern your use of the Kabataan Statistical Profile (KSP) platform — a web-based system connecting youth and SK officials in the Philippines.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["kabataanprofile.com", "Philippines", "28 Sections"].map((tag) => (
                <span key={tag} className="bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 bg-white rounded-xl border border-slate-200 p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">
                Table of Contents
              </p>
              <nav className="space-y-0.5">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-theme-dark-blue/10 group transition-colors"
                  >
                    <span className="text-xs font-mono text-theme-dark-blue shrink-0 w-5">
                      {item.num}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-800 leading-tight transition-colors">
                      {item.title}
                    </span> 
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 sm:px-10 py-8">

              {/* Agreement Intro */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <div className="flex gap-3">
                  <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Agreement to Legal Terms</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      By accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE, YOU MUST DISCONTINUE USE IMMEDIATELY.
                    </p>
                  </div>
                </div>
              </div>

              <P>
                We are <strong>Kabataan Statistical Profile</strong>, doing business as <strong>KSP</strong>, a company registered in the Philippines at Purok Bagong Silang, Barangay San Miguel, Puerto Princesa City, Palawan 5300.
              </P>
              <P>
                We operate the website <a href="https://kabataanprofile.com" className="text-theme-dark-blue font-medium hover:underline">kabataanprofile.com </a> and related products and services (collectively, the &quot;Services&quot;).
              </P>
              <P>
                KSP is a web-based platform designed to connect youth and SK officials. It allows users to manage programs, submit suggestions, and view announcements. The platform aims to improve communication and engagement within the community.
              </P>
              <P>
                You can contact us by email at <Email address="support@kabataanprofile.com" /> or by mail at Purok Bagong Silang, Barangay San Miguel, Puerto Princesa City, Palawan 5300, Philippines.
              </P>
              <P>
                We will provide prior notice of any scheduled changes. Modified Legal Terms become effective upon posting or notification. Continued use after the effective date constitutes agreement to the modified terms.
              </P>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
                <p className="text-sm text-slate-600">
                  <strong>Age Requirement:</strong> The Services are intended for users at least 13 years of age. Minors must have parental or guardian permission. We recommend printing a copy of these Legal Terms for your records.
                </p>
              </div>

              {/* 1 */}
              <SectionTitle id="services" num="01">Our Services</SectionTitle>
              <P>The information provided when using the Services is not intended for distribution to any person or entity in any jurisdiction where such distribution or use would be contrary to law or regulation. Those who access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws.</P>

              {/* 2 */}
              <SectionTitle id="ip" num="02">Intellectual Property Rights</SectionTitle>
              <SubTitle>Our intellectual property</SubTitle>
              <P>We are the owner or licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (collectively, &quot;Content&quot;), as well as the trademarks, service marks, and logos (&quot;Marks&quot;).</P>
              <P>Our Content and Marks are protected by copyright and trademark laws and treaties around the world. They are provided &quot;AS IS&quot; for your personal, non-commercial use or internal business purpose only.</P>
              <SubTitle>Your use of our Services</SubTitle>
              <P>Subject to compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to:</P>
              <BulletList items={[
                "Access the Services",
                "Download or print a copy of any portion of the Content to which you have properly gained access — solely for personal, non-commercial use.",
              ]} />
              <P>No part of the Services, Content, or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, or licensed for any commercial purpose without our express prior written permission. Requests may be sent to <Email address="support@kabataanprofile.com" />.</P>
              <P>Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</P>
              <SubTitle>Your submissions and contributions</SubTitle>
              <P><strong>Submissions:</strong> By directly sending us any question, comment, suggestion, idea, feedback, or other information (&quot;Submissions&quot;), you agree to assign to us all intellectual property rights in such Submission. We shall own this Submission and be entitled to its unrestricted use for any lawful purpose without acknowledgment or compensation.</P>
              <P><strong>Contributions:</strong> The Services may invite you to create, submit, post, display, transmit, or broadcast content and materials (&quot;Contributions&quot;). Contributions may be viewable by other users. When you post Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, worldwide license to use, copy, reproduce, distribute, sell, publish, broadcast, reformat, translate, and exploit your Contributions for any purpose.</P>
              <P><strong>You are responsible for what you post or upload.</strong> By sending Submissions or posting Contributions you confirm you will not post content that is illegal, harassing, hateful, harmful, defamatory, obscene, abusive, discriminatory, threatening, sexually explicit, false, or misleading.</P>
              <P>We may remove or edit your content at any time without notice if we consider it harmful or in breach of these Legal Terms. We may also suspend or disable your account and report you to the authorities.</P>

              {/* 3 */}
              <SectionTitle id="userreps" num="03">User Representations</SectionTitle>
              <P>By using the Services, you represent and warrant that:</P>
              <BulletList items={[
                "All registration information you submit will be true, accurate, current, and complete.",
                "You will maintain the accuracy of such information and promptly update it as necessary.",
                "You have the legal capacity and agree to comply with these Legal Terms.",
                "You are not under the age of 13.",
                "You are not a minor in your jurisdiction, or if you are, you have received parental permission to use the Services.",
                "You will not access the Services through automated or non-human means, whether through a bot, script, or otherwise.",
                "You will not use the Services for any illegal or unauthorized purpose.",
                "Your use of the Services will not violate any applicable law or regulation.",
              ]} />
              <P>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services.</P>

              {/* 4 */}
              <SectionTitle id="userreg" num="04">User Registration</SectionTitle>
              <P>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</P>

              {/* 5 */}
              <SectionTitle id="purchases" num="05">Purchases and Payment</SectionTitle>
              <P>We accept the following forms of payment as applicable. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date.</P>
              <P>Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. We reserve the right to refuse any order placed through the Services and may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.</P>

              {/* 6 */}
              <SectionTitle id="prohibited" num="06">Prohibited Activities</SectionTitle>
              <P>You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree NOT to:</P>
              <BulletList items={[
                "Systematically retrieve data or other content from the Services to create a collection, compilation, database, or directory without written permission.",
                "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.",
                "Circumvent, disable, or otherwise interfere with security-related features of the Services.",
                "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.",
                "Use any information obtained from the Services in order to harass, abuse, or harm another person.",
                "Make improper use of our support services or submit false reports of abuse or misconduct.",
                "Use the Services in a manner inconsistent with any applicable laws or regulations.",
                "Engage in unauthorized framing of or linking to the Services.",
                "Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services.",
                "Engage in any automated use of the system, including using data mining, robots, or similar data gathering and extraction tools.",
                "Delete the copyright or other proprietary rights notice from any Content.",
                "Attempt to impersonate another user or person or use the username of another user.",
                "Upload or transmit any material that acts as a passive or active information collection mechanism (e.g., gifs, 1×1 pixels, web bugs, cookies, spyware).",
                "Interfere with, disrupt, or create an undue burden on the Services or the networks connected to the Services.",
                "Harass, annoy, intimidate, or threaten any of our employees or agents providing the Services.",
                "Attempt to bypass any measures of the Services designed to prevent or restrict access.",
                "Copy or adapt the Services' software, including Flash, PHP, HTML, JavaScript, or other code.",
                "Decipher, decompile, disassemble, or reverse engineer any software making up a part of the Services.",
                "Use, launch, develop, or distribute any automated system including any spider, robot, cheat utility, or scraper.",
                "Use a buying agent or purchasing agent to make purchases on the Services.",
                "Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users for sending unsolicited email.",
                "Use the Services as part of any effort to compete with us or for any revenue-generating endeavor or commercial enterprise.",
                "Sell or otherwise transfer your profile.",
                "Use the Services to advertise or offer to sell goods and services.",
                "Impersonate another user.",
                "Submit false or misleading information.",
                "Post offensive, abusive, or inappropriate content.",
                "Attempt to access unauthorized areas.",
                "Upload malicious code or try to hack the system.",
                "Misuse the suggestion system.",
              ]} />

              {/* 7 */}
              <SectionTitle id="ugc" num="07">User Generated Contributions</SectionTitle>
              <P>The Services may invite you to create, submit, post, display, transmit, or broadcast content and materials (&quot;Contributions&quot;). Contributions may be viewable by other users and through third-party websites. When you create or make available any Contributions, you represent and warrant that:</P>
              <BulletList items={[
                "The creation, distribution, transmission, public display, or performance of your Contributions does not infringe the proprietary rights of any third party.",
                "You are the creator and owner of or have the necessary licenses, rights, consents, and permissions.",
                "You have the written consent, release, and/or permission of each identifiable individual person in your Contributions.",
                "Your Contributions are not false, inaccurate, or misleading.",
                "Your Contributions are not unsolicited or unauthorized advertising, spam, mass mailings, or other forms of solicitation.",
                "Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable.",
                "Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.",
                "Your Contributions are not used to harass or threaten any other person or to promote violence.",
                "Your Contributions do not violate any applicable law, regulation, or rule.",
                "Your Contributions do not violate the privacy or publicity rights of any third party.",
                "Your Contributions do not violate any applicable law concerning child pornography.",
                "Your Contributions do not include any offensive comments connected to race, national origin, gender, sexual preference, or physical handicap.",
                "Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms.",
              ]} />
              <P>Any use of the Services in violation of the foregoing may result in termination or suspension of your rights to use the Services.</P>

              {/* 8 */}
              <SectionTitle id="license" num="08">Contribution License</SectionTitle>
              <P>By posting your Contributions to any part of the Services, you automatically grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, publicly perform, publicly display, reformat, translate, transmit, excerpt, and distribute such Contributions for any purpose, including commercial and advertising purposes, and to prepare derivative works of, or incorporate into other works, such Contributions.</P>
              <P>This license will apply to any form, media, or technology now known or hereafter developed. You waive all moral rights in your Contributions. We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights associated with them.</P>
              <P>We have the right, in our sole and absolute discretion, to (1) edit, redact, or otherwise change any Contributions; (2) re-categorize any Contributions; and (3) pre-screen or delete any Contributions at any time and for any reason, without notice.</P>

              {/* 9 */}
              <SectionTitle id="sitemanage" num="09">Services Management</SectionTitle>
              <P>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who violates the law or these Legal Terms, including reporting such user to law enforcement; (3) refuse, restrict access to, limit the availability of, or disable any of your Contributions; (4) remove from the Services or otherwise disable all files and content that are excessive in size or burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property.</P>

              {/* 10 */}
              <SectionTitle id="ppno" num="10">Privacy Policy</SectionTitle>
              <P>We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy posted on the Services. The Services are hosted in the Philippines. If you access the Services from any other region with differing personal data laws, through your continued use you are transferring your data to the Philippines and expressly consent to have your data transferred to and processed in the Philippines.</P>

              {/* 11 */}
              <SectionTitle id="copyrightno" num="11">Copyright Infringements</SectionTitle>
              <P>We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us at <Email address="support@kabataanprofile.com" />. A copy of your Notification will be sent to the person who posted or stored the material addressed. Please be advised that pursuant to applicable law you may be held liable for damages if you make material misrepresentations in a Notification.</P>

              {/* 12 */}
              <SectionTitle id="terms" num="12">Term and Termination</SectionTitle>
              <P>These Legal Terms shall remain in full force and effect while you use the Services. WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS.</P>
              <P>If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party. We reserve the right to take appropriate legal action, including pursuing civil, criminal, and injunctive redress.</P>

              {/* 13 */}
              <SectionTitle id="modifications" num="13">Modifications and Interruptions</SectionTitle>
              <P>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</P>
              <P>We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance, resulting in interruptions, delays, or errors. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.</P>

              {/* 14 */}
              <SectionTitle id="law" num="14">Governing Law</SectionTitle>
              <P>These Legal Terms shall be governed by and defined following the laws of the Philippines. Kabataan Statistical Profile and yourself irrevocably consent that the courts of the Philippines shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</P>

              {/* 15 */}
              <SectionTitle id="disputes" num="15">Dispute Resolution</SectionTitle>
              <SubTitle>Informal Negotiations</SubTitle>
              <P>To expedite resolution and control the cost of any Dispute, the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.</P>
              <SubTitle>Binding Arbitration</SubTitle>
              <P>Any dispute arising out of or in connection with these Legal Terms shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to the Rules of this ICAC. The number of arbitrators shall be one (1). The seat of arbitration shall be Manila, Philippines. The language of the proceedings shall be English. The governing law shall be substantive law of the Philippines.</P>
              <SubTitle>Restrictions</SubTitle>
              <P>Any arbitration shall be limited to the Dispute between the Parties individually. No arbitration shall be joined with any other proceeding, and there is no right or authority for any Dispute to be arbitrated on a class-action basis.</P>
              <SubTitle>Exceptions to Informal Negotiations and Arbitration</SubTitle>
              <P>The following Disputes are not subject to the above provisions: (a) any Disputes seeking to enforce or protect any of the intellectual property rights of a Party; (b) any Dispute related to allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief.</P>

              {/* 16 */}
              <SectionTitle id="corrections" num="16">Corrections</SectionTitle>
              <P>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</P>

              {/* 17 */}
              <SectionTitle id="disclaimer" num="17">Disclaimer</SectionTitle>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4">
                <P className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2">Important Disclaimer</P>
                <P className="text-xs leading-relaxed text-slate-600!">THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES&apos; CONTENT. WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR INACCURACIES OF CONTENT; PERSONAL INJURY OR PROPERTY DAMAGE; ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS; ANY INTERRUPTION OR CESSATION OF TRANSMISSION; ANY BUGS, VIRUSES, OR TROJAN HORSES TRANSMITTED THROUGH THE SERVICES; OR ANY ERRORS OR OMISSIONS IN ANY CONTENT.</P>
              </div>

              {/* 18 */}
              <SectionTitle id="liability" num="18">Limitations of Liability</SectionTitle>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4">
                <P className="text-xs leading-relaxed text-slate-600!">IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES — IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU.</P>
              </div>

              {/* 19 */}
              <SectionTitle id="indemnification" num="19">Indemnification</SectionTitle>
              <P>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys&apos; fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including intellectual property rights; or (6) any overt harmful act toward any other user of the Services.</P>

              {/* 20 */}
              <SectionTitle id="userdata" num="20">User Data</SectionTitle>
              <P>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption.</P>

              {/* 21 */}
              <SectionTitle id="electronic" num="21">Electronic Communications, Transactions, and Signatures</SectionTitle>
              <P>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS. You hereby waive any rights or requirements under any statutes, regulations, rules, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records.</P>

              {/* 22 */}
              <SectionTitle id="misc" num="22">Miscellaneous</SectionTitle>
              <P>These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. If any provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision is deemed severable and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment, or agency relationship created between you and us as a result of these Legal Terms.</P>

              {/* 23 */}
              <SectionTitle id="addclause" num="23">Role-Based Access</SectionTitle>
              <P>Users may only access features allowed for their role (youth, SK, admin). Accessing features or data beyond your assigned role is a violation of these Legal Terms and may result in suspension or termination of your account.</P>

              {/* 24 */}
              <SectionTitle id="addclauseb" num="24">User Submissions</SectionTitle>
              <P>Users are responsible for content they submit. No false or misleading information may be submitted through the platform. By submitting content, you affirm that the information is accurate, honest, and compliant with these Legal Terms.</P>

              {/* 25 */}
              <SectionTitle id="addclausec" num="25">Abuse Prevention</SectionTitle>
              <P>No impersonation of officials or users is permitted. No system manipulation or unauthorized access is allowed. Violations will result in immediate account suspension and may be reported to relevant authorities.</P>

              {/* 26 */}
              <SectionTitle id="addclaused" num="26">Platform Purpose</SectionTitle>
              <P>KSP is a community engagement and information platform, not a marketplace. It is intended solely for connecting youth and SK officials, managing programs, submitting suggestions, and viewing announcements. Any commercial use of the platform is strictly prohibited.</P>

              {/* 27 */}
              <SectionTitle id="addclausee" num="27">System Changes</SectionTitle>
              <P>Features may be updated or removed anytime at the sole discretion of Kabataan Statistical Profile. We are not liable for any inconvenience or loss resulting from the addition, modification, or removal of any features or functionality of the Services.</P>

              {/* 28 */}
              <SectionTitle id="contact" num="28">Contact Us</SectionTitle>
              <P>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</P>
              <div className="bg-theme-dark-blue/10 border border-theme-dark-blue/30 rounded-xl p-5 mt-2">
                <p className="font-bold text-theme-dark-blue text-sm">Kabataan Statistical Profile</p>
                <p className="text-theme-dark-blue text-sm mt-1">Purok Bagong Silang, Barangay San Miguel</p>
                <p className="text-theme-dark-blue text-sm">Puerto Princesa City, Palawan 5300</p>
                <p className="text-theme-dark-blue text-sm">Philippines</p>
                <a
                  href="mailto:support@kabataanprofile.com"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-theme-dark-blue hover:underline transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@kabataanprofile.com
                </a>
              </div>

              {/* Footer note */}
              <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Last updated: April 15, 2026</span>
                <span>Kabataan Statistical Profile © 2026</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}