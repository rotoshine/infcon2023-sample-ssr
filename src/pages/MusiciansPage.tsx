import Layout from "../components/Layout";
import Musicians from "@/components/Musicians";

export default function MusiciansPage() {
  return (
    <Layout>
      <div className="min-h-screen container pt-4 mx-auto border-neutral-content">
        <Musicians />
      </div>
    </Layout>
  );
}
