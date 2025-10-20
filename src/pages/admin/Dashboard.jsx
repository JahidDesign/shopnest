// File: src/pages/admin/Dashboard.jsx
import { motion } from "framer-motion";
import HomeBannerAdminTable from './HomeBannerAdminTable';
import CategoryForm from './CategoryForm';
import CustomerTable from '../CustomerTable';
import HomeBannerForm from './HomeBannerForm';
import CategoryAdminTable from './CategoryAdminTable';
import BlogContactManager from "./adminContact";
import Subscribers from "./SubscribersMG";
import VisitorsForm from "./VisitorsForm";

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
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Welcome to the admin dashboard. Manage users, policies, blog posts, monitor transactions, and view analytics.
        </p>
      </motion.div>

      {/* Customer Management */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Customer Management</h2>
        <motion.div variants={sectionVariants}>
          <CustomerTable rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* Policies Management */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4"></h2>
        <motion.div variants={sectionVariants}>
          <HomeBannerForm rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* Application Management */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4"></h2>
        <motion.div variants={sectionVariants}>
          <div className="mt-4">
            <HomeBannerAdminTable rowVariants={rowVariants} />
          </div>
        </motion.div>
      </motion.section>
            {/* Category Dashboard */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4"></h2>
        <motion.div variants={sectionVariants}>
          <CategoryForm rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* CategoryAdminTable Overview */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4"></h2>
        <motion.div variants={sectionVariants}>
          <CategoryAdminTable rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* Subscribers Stats */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Subscribers Stats</h2>
        <motion.div variants={sectionVariants}>
          <Subscribers rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* Contact Manager */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <motion.div variants={sectionVariants}>
          <BlogContactManager rowVariants={rowVariants} />
        </motion.div>
      </motion.section>

      {/* Admin Metrics */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4"></h2>
        <motion.div variants={sectionVariants}>
          <VisitorsForm rowVariants={rowVariants} />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
