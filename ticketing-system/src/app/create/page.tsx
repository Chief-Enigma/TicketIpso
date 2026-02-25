import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CreateTicketForm from "./ticket-form";

export default async function CreateTicketPage() {
  const session = await getSession();
  const u = session.user;

  if (!u) redirect("/login?next=/create");

  return <CreateTicketForm />;
}