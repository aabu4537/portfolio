import { Suspense } from "react";
import Sprites from "@/components/Sprites";
import GameLayer from "@/components/GameLayer";
import ProLayer from "@/components/ProLayer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ play?: string }>;
}) {
  const params = await searchParams;
  const forcePlay = params.play === "1";
  return (
    <>
      <Sprites />
      <Suspense fallback={null}>
        <GameLayer forcePlay={forcePlay} />
      </Suspense>
      <ProLayer />
    </>
  );
}
