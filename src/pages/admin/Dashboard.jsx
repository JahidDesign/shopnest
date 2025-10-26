// File: src/pages/admin/Dashboard.jsx
import { motion } from "framer-motion";
import HomeBannerAdminTable from "./HomeBannerAdminTable";
import CategoryForm from "./CategoryForm";
import AdminDashboard from "./AdminDashboard";
import CustomerTable from "../CustomerTable";
import FeatureFormProAdvanced from "./ManageSection/FeatureFormProAdvanced";
import HomeBannerForm from "./HomeBannerForm";
import CategoryAdminTable from "./CategoryAdminTable";
import BlogContactManager from "./adminContact";
import Subscribers from "./SubscribersMG";
import VisitorsForm from "./VisitorsForm";
import AddTourForm from "./AddTourForm";
import TourTable from "./TableTours";

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50 space-y-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage users, categories, policies, banners, subscribers, and more.
        </p>
      </motion.header>

      {/* Customer Management */}
      <Section title="Customer Management">
        <CustomerTable rowVariants={rowVariants} />
      </Section>

      {/* Feature Management */}
      <Section title="Feature Management">
        <FeatureFormProAdvanced rowVariants={rowVariants} />
      </Section>

      {/* Admin Metrics */}
      <Section title="Admin Overview">
        <AdminDashboard rowVariants={rowVariants} />
      </Section>

      {/* Home Banner Creation */}
      <Section title="Home Banner Creator">
        <HomeBannerForm rowVariants={rowVariants} />
      </Section>

      {/* Home Banner Management */}
      <Section title="Home Banner Manager">
        <HomeBannerAdminTable rowVariants={rowVariants} />
      </Section>

      {/* Category Management */}
      <Section title="Add New Category">
        <CategoryForm rowVariants={rowVariants} />
      </Section>

      {/* Category Overview */}
      <Section title="Category Overview">
        <CategoryAdminTable rowVariants={rowVariants} />
      </Section>

      {/* Subscribers */}
      <Section title="Subscribers Overview">
        <Subscribers rowVariants={rowVariants} />
      </Section>

      {/* Contact Messages */}
      <Section title="Contact Manager">
        <BlogContactManager rowVariants={rowVariants} />
      </Section>

      {/* Visitors */}
      <Section title="Visitors Analytics">
        <VisitorsForm rowVariants={rowVariants} />
      </Section>
      {/* AddTourForm */}
      <Section title="Visitors Analytics">
        <AddTourForm rowVariants={rowVariants} />
      </Section>
      {/* AddTourForm */}
      <Section title="Visitors Analytics">
        <TourTable rowVariants={rowVariants} />
      </Section>
    </div>
  );
};

// ✅ Reusable Section Wrapper with Motion
const Section = ({ title, children }) => (
  <motion.section
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
  >
    {title && (
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
        {title}
      </h2>
    )}
    <motion.div variants={sectionVariants}>{children}</motion.div>
  </motion.section>
);

export default Dashboard;
