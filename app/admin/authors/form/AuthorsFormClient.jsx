import AuthorsFormClient from "./AuthorsFormClient";

// ✅ Purely server side page just renders client component
export default function Page() {
  return <AuthorsFormClient />;
}
