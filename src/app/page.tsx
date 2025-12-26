import { Metadata } from "next";
import App from "@/app/app";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;

interface Props {
  searchParams: Promise<{
    t: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { t } = await searchParams; 
   const frame = {
    version: "next",
    imageUrl: t ? `${appUrl}/og?t=${t}` : `${appUrl}/og.png`,
    button: {
      title: "Open Year Progress",
      action: {
        type: "launch_frame",
        name: "Year Progress",
        url: `${appUrl}`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#333333",
      },
    },
  };

  return {
    title: "Year Progress",
    openGraph: {
      title: "Year Progress",
      description: "Track year progress on Farcaster",
      images: [
        {
          url: `${appUrl}/og.png`,
          width: 1200,
          height: 630,
          alt: "Year Progress",
        },
      ],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return (
      <App />
  );
}
