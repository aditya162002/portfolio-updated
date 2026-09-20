import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import useAlert from "../hooks/useAlert";
import { Alert } from "../components";
import { personalInfo } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Aditya Bhadauria",
          from_email: form.email,
          to_email: personalInfo.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          showAlert({
            show: true,
            text: "Thanks — I'll get back to you soon.",
            type: "success",
          });

          setTimeout(() => {
            hideAlert(false);
            setForm({ name: "", email: "", message: "" });
          }, 3000);
        },
        (error) => {
          setLoading(false);
          showAlert({
            show: true,
            text: `Failed to send: ${error.text || error.message || "try again"}`,
            type: "danger",
          });
        }
      );
  };

  return (
    <section
      className="relative flex lg:flex-row flex-col max-container items-start gap-12 lg:gap-20"
      style={{ background: "#050505", minHeight: "100vh" }}
    >
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col w-full">
        <Link
          to="/"
          className="text-gray-500 text-sm hover:text-sky-400 transition-colors mb-6 w-fit"
        >
          ← Back to portfolio
        </Link>

        <p className="text-sky-400/90 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Contact
        </p>
        <h1 className="head-text text-white">Get in Touch</h1>
        <p className="text-gray-400 mt-3 max-w-md leading-relaxed">
          Have a role, project, or idea? Drop a message — I usually reply within a
          day.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 mt-10"
        >
          <label className="text-gray-300 text-sm font-medium">
            Name
            <input
              type="text"
              name="name"
              className="dark-input"
              placeholder="Your name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label className="text-gray-300 text-sm font-medium">
            Email
            <input
              type="email"
              name="email"
              className="dark-input"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label className="text-gray-300 text-sm font-medium">
            Message
            <textarea
              name="message"
              rows="5"
              className="dark-input resize-y min-h-[120px]"
              placeholder="What are you working on?"
              required
              value={form.message}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="text-white px-6 py-3 rounded-xl font-medium border border-sky-400/30 bg-sky-500/15 hover:bg-sky-500/25 transition-all disabled:opacity-50 w-full sm:w-auto self-start"
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-2 text-sm text-gray-500">
          <a
            href={`mailto:${personalInfo.email}`}
            className="hover:text-gray-300 transition-colors w-fit"
          >
            {personalInfo.email}
          </a>
          <span>{personalInfo.phone}</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center min-h-[400px]">
        <div
          className="w-full max-w-md rounded-3xl p-10 border border-white/[0.06]"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(56,189,248,0.08), transparent 70%), rgba(255,255,255,0.02)",
          }}
        >
          <p className="text-white text-2xl font-poppins font-semibold leading-snug">
            Open to senior roles, consulting, and hard problems in AI &amp; systems.
          </p>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed">
            Currently shipping computer vision and full-stack product at Backgammon
            Galaxy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
