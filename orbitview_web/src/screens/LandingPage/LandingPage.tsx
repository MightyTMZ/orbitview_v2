import styles from "./LandingPage.module.css";
import OrbitButton from "@/components/OrbitButton/OrbitButton";
import { TbAugmentedReality2 } from "react-icons/tb";
import { MdCastForEducation } from "react-icons/md";
import { SiHandshakeProtocol } from "react-icons/si";
import ImmersiveText from "./ImmersiveText";
// import Footer from "@/app/home/oldLandingComponents/Footer";
// No footer for deployment (Dec 31, 2024)

export const LandingPage = () => {
  const iconSize = 30;

  return (
    <div
      className={`${styles.landingHero} min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 text-white`}
    >
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Welcome to <span className="text-yellow-300">OrbitView</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          The place to be for immersive media consumption, learning, and growth.
        </p>
        <div className={styles.getStartedDiv}>
          <OrbitButton
            text="Get Started"
            hoverText="Launch into orbit today!"
            endpoint="/login"
          />
        </div>
      </section>
      <div className={styles["cool-page-div"]}>
        <div className={styles["light-animation"]}></div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white text-gray-900">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{
            fontSize: "2rem",
            marginTop: "1.5rem",
          }}
        >
          Why Choose OrbitView?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <div>
              <TbAugmentedReality2 size={iconSize} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Augmented Media Experience
            </h3>
            <p>
              Experience content like never before with our innovative
              stereoscopic filters and AR-enhanced features.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <div>
              <MdCastForEducation size={iconSize} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Revolutionary Learning
            </h3>
            <p>
              Engage with tailored, interactive learning tools designed to make
              knowledge acquisition fun and effective.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <div>
              <SiHandshakeProtocol size={iconSize} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Genuine Connections (Coming Soon)
            </h3>
            <p>
              Join a thriving community of like-minded individuals and foster
              meaningful professional relationships.
            </p>
          </div>
        </div>
      </section>
      <ImmersiveText />

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Explore OrbitView?
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Sign up today to start your journey into the most immersive and
          connected learning experience ever created.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-8 py-4 bg-yellow-400 text-blue-900 font-semibold rounded-full shadow-lg hover:bg-yellow-300 transition"
          style={{
            background: "white",
            color: "black",
            padding: "10px 20px",
          }}
        >
          Get Started
        </button>
      </section>

      {/* Footer Section */}
    </div>
  );
};

export default LandingPage;
