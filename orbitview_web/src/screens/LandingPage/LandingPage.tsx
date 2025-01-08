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
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-white text-gray-900">
        {/*<h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800"
          style={{
            fontSize: "2.5rem",
            marginTop: "1.5rem",
          }}
        >
          Why Choose OrbitView?
        </h2>*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="text-blue-600 mb-6">
              <TbAugmentedReality2 size={50} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Augmented Media Experience
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Experience content like never before with our innovative
              stereoscopic filters and AR-enhanced features.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="text-green-600 mb-6">
              <MdCastForEducation size={50} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Revolutionary Learning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Engage with tailored, interactive learning tools designed to make
              knowledge acquisition fun and effective.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="text-indigo-600 mb-6">
              <SiHandshakeProtocol size={50} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Genuine Connections (Coming Soon)
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Join a thriving community of like-minded individuals and foster
              meaningful professional relationships.
            </p>
          </div>
        </div>
      </section>

      <ImmersiveText />

      {/* Call to Action Section */}
      <section
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white"
        style={{ paddingTop: "3rem" }}
      >
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-6"
          style={{ fontSize: "2.5rem" }}
        >
          Ready to Explore OrbitView?
        </h2>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
          style={{ marginBottom: "1.5rem" }}
        >
          Sign up today to start your journey into the most immersive and
          connected learning experience ever created.
        </p>
        <OrbitButton
          text="Get Started"
          hoverText="Get Started"
          endpoint="/join"
        />
      </section>

      {/* Footer Section */}
    </div>
  );
};

export default LandingPage;
