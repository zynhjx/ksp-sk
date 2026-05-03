import type { ReactNode } from "react";
import PublicFooter from "@/components/PublicFooter";

const toc = [
  { id: "infocollect", num: "01", title: "What Information Do We Collect?" },
  { id: "infouse", num: "02", title: "How Do We Process Your Information?" },
  { id: "whoshare", num: "03", title: "When and With Whom Do We Share Your Personal Information?" },
  { id: "cookies", num: "04", title: "Do We Use Cookies and Other Tracking Technologies?" },
  { id: "inforetain", num: "05", title: "How Long Do We Keep Your Information?" },
  { id: "infosafe", num: "06", title: "How Do We Keep Your Information Safe?" },
  { id: "privacyrights", num: "07", title: "What Are Your Privacy Rights?" },
  { id: "DNT", num: "08", title: "Controls for Do-Not-Track Features" },
  { id: "clausea", num: "09", title: "User Submissions and Community Content" },
  { id: "policyupdates", num: "10", title: "Do We Make Updates to This Notice?" },
  { id: "contact", num: "11", title: "How Can You Contact Us About This Notice?" },
  { id: "request", num: "12", title: "How Can You Review, Update, or Delete the Data We Collect?" },
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

type EmailProps = {
  address: string;
};

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

const SectionTitle = ({ id, num, children }: SectionTitleProps) => (
  <h2
    id={id}
    className="flex items-baseline gap-3 text-xl font-bold text-slate-900 mt-12 mb-4 scroll-mt-24 border-b border-slate-200 pb-3"
  >
    <span className="text-xs font-mono font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded tracking-widest shrink-0">
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

const InShort = ({ children }: ChildrenProps) => (
  <div className="flex gap-2 mb-4 bg-teal-50/60 border border-teal-100 rounded-lg px-4 py-3">
    <span className="text-teal-500 shrink-0 mt-0.5">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
      </svg>
    </span>
    <p className="text-sm text-teal-800 italic leading-relaxed"><strong>In Short:</strong> {children}</p>
  </div>
);

const BulletList = ({ items }: BulletListProps) => (
  <ul className="space-y-2 mb-4 ml-1">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Email = ({ address }: EmailProps) => (
  <a
    href={`mailto:${address}`}
    className="text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors"
  >
    {address}
  </a>
);

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors"
  >
    {children}
  </a>
);

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 sm:p-12 mb-10 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative z-10">
            <p className="text-teal-200 text-xs font-mono tracking-widest uppercase mb-3">
              Last updated — April 15, 2026
            </p>
            <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-teal-100 text-sm leading-relaxed max-w-2xl">
              This Privacy Notice describes how Kabataan Statistical Profile (KSP) accesses, collects, stores, uses, and shares your personal information when you use our services.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["kabataanprofile.com", "Philippines", "12 Sections"].map((tag) => (
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
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-teal-50 group transition-colors"
                  >
                    <span className="text-xs font-mono text-teal-400 group-hover:text-teal-600 shrink-0 w-5">
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

              {/* Intro */}
              <P>
                This Privacy Notice for <strong>Kabataan Statistical Profile</strong> (doing business as <strong>KSP</strong>) ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
              </P>
              <BulletList items={[
                "Visit our website at kabataanprofile.com or any website of ours that links to this Privacy Notice.",
                "Use Kabataan Statistical Profile — a web-based platform designed to help youth organizations and local Sangguniang Kabataan (SK) units manage youth profiles, gather community insights and suggestions, and facilitate communication and participation in local programs and initiatives. Users may create accounts, submit feedback, and interact with features depending on their assigned roles.",
                "Engage with us in other related ways, including any marketing or events.",
              ]} />
              <P>
                <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <Email address="privacy@kabataanprofile.com" />.
              </P>

              {/* Summary of Key Points */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-8">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Summary of Key Points
                </h2>
                <p className="text-xs text-slate-500 italic mb-4">This summary provides key points from our Privacy Notice. Use the table of contents below to find the section you are looking for.</p>
                <div className="space-y-3">
                  {[
                    { q: "What personal information do we process?", a: "We may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use." },
                    { q: "Do we process any sensitive personal information?", a: "We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law." },
                    { q: "Do we collect any information from third parties?", a: "We do not collect any information from third parties." },
                    { q: "How do we process your information?", a: "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law." },
                    { q: "How do we keep your information safe?", a: "We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet can be guaranteed to be 100% secure." },
                    { q: "What are your rights?", a: "Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information." },
                    { q: "How do you exercise your rights?", a: <>Visit <ExternalLink href="https://kabataanprofile.com/data-request">kabataanprofile.com/data-request</ExternalLink> or contact us. We will consider and act upon any request in accordance with applicable data protection laws.</> },
                  ].map(({ q, a }, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-slate-700">{q} </span>
                        <span className="text-xs text-slate-500">{a}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1 */}
              <SectionTitle id="infocollect" num="01">What Information Do We Collect?</SectionTitle>
              <SubTitle>Personal information you disclose to us</SubTitle>
              <InShort>We collect personal information that you provide to us.</InShort>
              <P>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</P>
              <P><strong>Personal Information Provided by You.</strong> The personal information we collect may include the following:</P>
              <BulletList items={[
                "Names",
                "Phone numbers",
                "Email addresses",
                "Contact or authentication data",
                "Employment status",
                "Education level",
                "Date of birth",
              ]} />
              <SubTitle>Sensitive Information</SubTitle>
              <P>When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information:</P>
              <BulletList items={["Student data"]} />
              <P>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</P>

              {/* 2 */}
              <SectionTitle id="infouse" num="02">How Do We Process Your Information?</SectionTitle>
              <InShort>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</InShort>
              <P><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></P>
              <BulletList items={[
                "To facilitate account creation and authentication and otherwise manage user accounts — so you can create and log in to your account, as well as keep your account in working order.",
                "To deliver and facilitate delivery of services to the user — to provide you with the requested service.",
                "To respond to user inquiries/offer support to users — to respond to your inquiries and solve any potential issues you might have with the requested service.",
                "To send administrative information to you — to send you details about our products and services, changes to our terms and policies, and other similar information.",
                "To enable user-to-user communications — if you choose to use any of our offerings that allow for communication with another user.",
                "To request feedback — when necessary to request feedback and to contact you about your use of our Services.",
                "To protect our Services — as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.",
                "To evaluate and improve our Services, products, marketing, and your experience — to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services.",
                "To identify usage trends — to better understand how our Services are being used so we can improve them.",
                "To comply with our legal obligations — to respond to legal requests and exercise, establish, or defend our legal rights.",
              ]} />

              {/* 3 */}
              <SectionTitle id="whoshare" num="03">When and With Whom Do We Share Your Personal Information?</SectionTitle>
              <InShort>We may share information in specific situations described in this section and/or with the following third parties.</InShort>
              <P>We may need to share your personal information in the following situations:</P>
              <BulletList items={[
                "Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
              ]} />

              {/* 4 */}
              <SectionTitle id="cookies" num="04">Do We Use Cookies and Other Tracking Technologies?</SectionTitle>
              <InShort>We may use cookies and other tracking technologies to collect and store your information.</InShort>
              <P>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</P>
              <P>We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.</P>
              <P>
                Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice at{" "}
                <ExternalLink href="https://kabataanprofile.com/cookie-policy">kabataanprofile.com/cookie-policy</ExternalLink>.
              </P>

              {/* 5 */}
              <SectionTitle id="inforetain" num="05">How Long Do We Keep Your Information?</SectionTitle>
              <InShort>We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</InShort>
              <P>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</P>
              <P>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</P>

              {/* 6 */}
              <SectionTitle id="infosafe" num="06">How Do We Keep Your Information Safe?</SectionTitle>
              <InShort>We aim to protect your personal information through a system of organizational and technical security measures.</InShort>
              <P>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</P>
              <P>Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</P>

              {/* 7 */}
              <SectionTitle id="privacyrights" num="07">What Are Your Privacy Rights?</SectionTitle>
              <InShort>You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</InShort>
              <SubTitle>Withdrawing your consent</SubTitle>
              <P>If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us using the contact details provided in the section "How Can You Contact Us About This Notice?" below.</P>
              <P>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</P>
              <SubTitle>Account Information</SubTitle>
              <P>If you would at any time like to review or change the information in your account or terminate your account, you can:</P>
              <BulletList items={[
                "Log in to your account settings and update your user account.",
                "Contact us using the contact information provided.",
              ]} />
              <P>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</P>
              <SubTitle>Cookies and similar technologies</SubTitle>
              <P>
                Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. For further information, please see our Cookie Notice at{" "}
                <ExternalLink href="https://kabataanprofile.com/cookie-policy">kabataanprofile.com/cookie-policy</ExternalLink>.
              </P>
              <P>
                If you have questions or comments about your privacy rights, you may email us at <Email address="privacy@kabataanprofile.com" />.
              </P>

              {/* 8 */}
              <SectionTitle id="DNT" num="08">Controls for Do-Not-Track Features</SectionTitle>
              <P>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</P>

              {/* 9 */}
              <SectionTitle id="clausea" num="09">User Submissions and Community Content</SectionTitle>
              <P>Kabataan Profile provides features that allow users to submit suggestions, feedback, and other content to support community engagement and local planning. Information submitted through these features may be accessed and reviewed by authorized administrators, including Sangguniang Kabataan (SK) officials, for evaluation and response purposes.</P>
              <P>While some submissions may allow anonymity, any information voluntarily provided by users remains their responsibility. Users are advised not to include sensitive personal information in publicly visible submissions or feedback.</P>

              {/* 10 */}
              <SectionTitle id="policyupdates" num="10">Do We Make Updates to This Notice?</SectionTitle>
              <InShort>Yes, we will update this notice as necessary to stay compliant with relevant laws.</InShort>
              <P>We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</P>

              {/* 11 */}
              <SectionTitle id="contact" num="11">How Can You Contact Us About This Notice?</SectionTitle>
              <P>
                If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) by email at{" "}
                <Email address="drrw.delrosario@kabataanprofile.com" /> or contact us by post at:
              </P>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mt-2 mb-4">
                <p className="font-bold text-teal-900 text-sm">Kabataan Statistical Profile</p>
                <p className="text-teal-700 text-sm mt-1">Data Protection Officer</p>
                <p className="text-teal-700 text-sm">Purok Bagong Silang, Barangay San Miguel</p>
                <p className="text-teal-700 text-sm">Puerto Princesa City, Palawan 5300</p>
                <p className="text-teal-700 text-sm">Philippines</p>
                <a
                  href="mailto:drrw.delrosario@kabataanprofile.com"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  drrw.delrosario@kabataanprofile.com
                </a>
              </div>

              {/* 12 */}
              <SectionTitle id="request" num="12">How Can You Review, Update, or Delete the Data We Collect From You?</SectionTitle>
              <P>
                Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.
              </P>
              <P>
                To request to review, update, or delete your personal information, please visit:{" "}
                <ExternalLink href="https://kabataanprofile.com/data-request">
                  kabataanprofile.com/data-request
                </ExternalLink>.
              </P>

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
    <PublicFooter />
  );
}