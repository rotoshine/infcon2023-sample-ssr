import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Musician from "@/components/Musician";

export default function MusicianDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();

  return (
    <Layout>
      <Musician slug={slug} />
    </Layout>
  );
}
