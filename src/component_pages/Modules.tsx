
import Navbar from "@/components/Navbar";
import ModulesFeatures from "@/components/ModulesFeatures";
import Footer from "@/components/Footer";

const Modules = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ModulesFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Modules;
