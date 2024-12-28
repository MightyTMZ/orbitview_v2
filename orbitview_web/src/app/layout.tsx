"use client";

// import type { Metadata } from "next";
import localFont from "next/font/local";
import AppContainer from "./AppContainer";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { Provider } from "react-redux";
import Spinner from "@/components/Spinner/Spinner";
// importing the additional fonts that we support here on OrbitView
import {
  Poppins,
  Roboto,
  Lato,
  EB_Garamond,
  Baskervville,
  Bodoni_Moda,
  Oswald,
  Montserrat,
  Courier_Prime,
  IBM_Plex_Sans,
  Lexend,
  Orbitron,
  Raleway,
  Fredericka_the_Great,
} from "next/font/google";
// import { Poppins } from '@next/font/google';
import "./globals.css";
import "./normalize.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600", "700", "800"],
});

const baskervville = Baskervville({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baskervville",
  weight: ["400"],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni", // got rid of the "moda"
  weight: ["400", "500", "600", "700", "800", "900"],
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const courier = Courier_Prime({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier",
  weight: ["400", "700"],
});

const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const fredericka_the_great = Fredericka_the_Great({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredericka-the-great",
  weight: ["400"],
});

/*export const metadata: Metadata = {
  title: "OrbitView",
  description: "Where Learning, Connections, Growth Take Flight",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${poppins.variable} 
          ${roboto.variable} 
          ${lato.variable} 
          ${garamond.variable}
          ${baskervville.variable}
          ${bodoni.variable}
          ${oswald.variable}
          ${montserrat.variable}
          ${courier.variable}
          ${ibm_plex_sans.variable}
          ${lexend.variable}
          ${orbitron.variable}
          ${raleway.variable}
          ${fredericka_the_great.variable}
          
          
          `}
      >
        <Provider store={store}>
          <PersistGate loading={<Spinner />} persistor={persistor}>
            <AppContainer> {children}</AppContainer>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
