"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import axios from "axios";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phoneNo: z.string().min(10, "Enter a valid phone number").max(15),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.literal("contact"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const submitContact = async (data: ContactFormData) => {
  await axios.post("/api/contact-us", data);
};

const ContactUs = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNo: "",
    message: "",
    type: "contact",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setIsSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setError("");
    setIsSuccess(false);

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setIsPending(true);

      await submitContact(result.data);

      setIsSuccess(true);

      setFormData({
        name: "",
        email: "",
        phoneNo: "",
        message: "",
        type: "contact",
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  const field = (
    label: string,
    name: keyof ContactFormData,
    type = "text",
    placeholder = ""
  ) => (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all duration-300 ${
          errors[name]
            ? "border-red-500/50"
            : "border-white/5 focus:border-purple-500/50"
        }`}
      />

      {errors[name] && (
        <p className="text-red-400 text-xs ml-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 uppercase">
            Get in <br />
            <span className="text-purple-500">Touch</span>
          </h1>

          <p className="text-neutral-400 max-w-md text-lg font-light leading-relaxed mb-12">
            Have a question or want to work together? Fill out the form and
            we'll get back to you within 24 hours.
          </p>

          <div className="space-y-8">
            {[
              { icon: Mail, label: "Email Us", value: "clubexcel@nist.edu" },
              { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
              {
                icon: MapPin,
                label: "Visit Us",
                value: "NIST University, Berhampur, Odisha",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 group-hover:bg-purple-500/10">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>

                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
                    {label}
                  </p>

                  <p className="text-white text-lg font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-transparent blur-3xl -z-10 opacity-50" />

          <form
            onSubmit={handleSubmit}
            className="bg-[#080808] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-6 backdrop-blur-xl shadow-2xl"
          >
            {isSuccess && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                Thank you! We'll get back to you within 24 hours.
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {field("Full Name", "name", "text", "Your name")}
            {field("Email Address", "email", "email", "you@example.com")}
            {field("Phone Number", "phoneNo", "tel", "+91 00000 00000")}

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">
                Your Message
              </label>

              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all duration-300 resize-none ${
                  errors.message
                    ? "border-red-500/50"
                    : "border-white/5 focus:border-purple-500/50"
                }`}
              />

              {errors.message && (
                <p className="text-red-400 text-xs ml-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full group relative p-1 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="bg-[#080808] rounded-[0.9rem] py-4 flex items-center justify-center gap-3">
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-mono text-sm tracking-widest text-white uppercase">
                      Send Message
                    </span>
                    <Send className="w-4 h-4 text-white" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
