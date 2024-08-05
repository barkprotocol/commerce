"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

function Footer() {
  const path = usePathname();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const dataCompany = [
    { link: "/about_us", name: "About" },
    { link: "/contact-us", name: "Contact" },
    { link: "/faqs", name: "FAQ" },
    { link: "https://commerce.barkprotocol.net/docs", name: "Documentation" },
  ];

  const dataSocial = [
    { link: "https://x.com/bark_protocol", icon: <FaXTwitter size={24} aria-label="Twitter" /> },
    // { link: "https://github.com/barkprotocol", icon: <FaGithub size={24} aria-label="GitHub" /> },
    // { link: "https://linkedin.com/company/bark-protocol", icon: <FaLinkedinIn size={24} aria-label="LinkedIn" /> },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const PORTAL_ID = "3673064";
    const FORM_ID = "fb9dde82-00fd-46c3-b0d4-b71efe2785d5";

    if (!email) {
      console.error("Email is required");
      setMessage("Email is required");
      return;
    }

    const requestBody = {
      portalId: PORTAL_ID,
      formGuid: FORM_ID,
      fields: [{ name: "email", value: email }],
    };

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Form submission successful");
        setMessage("Subscription successful");
        setEmail("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.error("Form submission error");
        const responseData = await response.json();
        console.error(responseData);
        setMessage("Subscription failed");
      }
    } catch (error) {
      console.error("Error submitting the form", error);
      setMessage("Subscription failed");
    }
  };

  return (
    <footer className="flex justify-center items-center px-2 md:px-0">
      <div className="bg-black border-t-2 border-l-2 border-r-2 border-orange-500 p-10 w-full mt-24 rounded-t-xl">
        <div className="flex flex-wrap justify-between mb-8">
          <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
            <div className="flex flex-col">
              <p className="font-normal text-sm text-white leading-tight tracking-tight mt-4">
                Contact us directly
              </p>
              <p className="font-normal text-sm text-white leading-tight tracking-tight">
                with any questions.
              </p>
              <Link href="/contact-us" passHref>
                <motion.button
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  className="mt-4 text-orange-400 text-sm tracking-tight"
                  aria-label="Contact Form"
                >
                  Contact Form
                </motion.button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <h2 className="font-normal text-white text-sm tracking-tight leading-tight">
              The latest deals and savings, sent to your inbox.
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex mt-4 items-center bg-gray-900 rounded-full p-1 pr-1"
              aria-live="polite"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-2 text-orange-400 bg-gray-900 border-none outline-none rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address"
              />
              <button
                type="submit"
                className="bg-orange-400 text-black font-medium text-sm leading-tight tracking-tight px-4 py-2 rounded-full transform transition-transform duration-300 hover:scale-95"
              >
                Sign Up
              </button>
            </form>
            {message && (
              <p className="text-orange-400 text-sm mt-2">{message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center border-t-2 pt-4 border-orange-500">
          <p className="text-white text-sm">
            &copy; 2024 BARK Protocol. All rights reserved.
          </p>
          <div className="text-white text-xs flex space-x-4">
            <ul className="flex space-x-6">
              {dataSocial.map((item, index) => (
                <motion.li
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  key={index}
                >
                  <a
                    href={item.link}
                    className="text-white text-sm tracking-tight hover:text-orange-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${item.link}`}
                  >
                    {item.icon}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
