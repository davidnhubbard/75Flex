import { notFound } from "next/navigation";
import DevTestingClient from "./testing-client";

export default function DevTestingPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DevTestingClient />;
}
