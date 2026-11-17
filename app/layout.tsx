import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "SS Photo & Films | Capturing Timeless Stories",
  description: "SS Photo & Films is a premium photography studio specializing in Wedding, Maternity, and Corporate events. Capturing raw, unscripted, and authentic moments since 2017.",
};
import { AuthProvider } from "@/lib/authContext";
import { CmsProvider } from "@/lib/CmsContext";
import CmsEditor from "@/components/CmsEditor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PRJQ599G" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
        {/* End Google Tag Manager */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&family=Elsie:wght@400;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground font-manrope selection:bg-gold selection:text-white">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PRJQ599G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          <CmsProvider>
            <CmsEditor />
            {children}
            <Analytics />
          </CmsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
