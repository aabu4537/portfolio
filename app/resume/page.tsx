import type { Metadata } from "next";
import Sprites from "@/components/Sprites";
import ProLayer from "@/components/ProLayer";

export const metadata: Metadata = {
  title: "Resume | Alam Bushara",
  description:
    "Alam Bushara: Quality Data Engineer. Palantir Foundry, Python, SQL, and production data pipelines.",
};

export default function ResumePage() {
  return (
    <>
      <Sprites />
      <ProLayer />
    </>
  );
}
