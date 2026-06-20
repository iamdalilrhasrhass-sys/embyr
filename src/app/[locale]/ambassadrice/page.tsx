import { redirect } from "next/navigation";
import { noindexMetadata } from "@/seo/noindex";

export const metadata = noindexMetadata;


export default function AmbassadricePage() {
  redirect("/");
}
