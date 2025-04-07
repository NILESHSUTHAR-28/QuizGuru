import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeadContent from "./HeadContent";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);

    try {
      const response = await axios.post("http://localhost:8080/contact", formData);
      console.log("Response from backend:", response.data);

      toast.success("✅ Message sent successfully!", { position: "top-center" });

      setFormData({ name: "", email: "", phone: "", country: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);

      toast.error("❌ Error sending message. Please try again!", { position: "top-center" });
    }
  };

  return (
    <div>
      <HeadContent
        header={<h1 style={{ fontSize: 90, marginTop: -50 }}>Contact Us</h1>}
        Form={
          <>
            <div className="row">
              <div className="form-outline col mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="form-control anim"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-outline col mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="form-control anim"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="form-outline col mb-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="form-control anim"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-outline col mb-4">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="form-control anim"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-outline mb-4">
              <textarea
                name="message"
                className="form-control anim"
                placeholder="Describe your issue"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </>
        }
        Btn={
          <button
            type="submit"
            className="btn btn-dark btn-block mb-4 form-control anim"
            onClick={handleSubmit}
          >
            Send
          </button>
        }
        image={
          <img
            src="Assets/contactus3.png"
            style={{ width: 400, height: 400, marginRight: 200, marginBottom: 130 }}
            alt="image"
            className="anim"
          />
        }
      />
      <ToastContainer />
    </div>
  );
}
