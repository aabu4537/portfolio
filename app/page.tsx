import { Suspense } from "react";
import Sprites from "@/components/Sprites";
import GameLayer from "@/components/GameLayer";
import ProLayer from "@/components/ProLayer";

export default function Home() {
  return (
    <>
      <Sprites />
      <Suspense fallback={null}>
        <GameLayer />
      </Suspense>
      <ProLayer />
    </>
  );
}
