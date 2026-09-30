import { useState } from "react";
import {
  Phone,
  Send,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./index.css";

function App() {
  const [formData, setFormData] = useState({
  phone: "",
  contact: "",
  message: "",
});

const [status, setStatus] = useState("");
const [phoneFocused, setPhoneFocused] = useState(false);
const [fieldErrors, setFieldErrors] = useState({
  phone: false,
  contact: false,
  message: false,
});

const [showConfetti, setShowConfetti] = useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "phone") {
    // Оставляем только цифры
    let digits = value.replace(/\D/g, "");

    // Убираем код страны, если пользователь его случайно ввёл
    if (digits.startsWith("7")) {
      digits = digits.slice(1);
    }

    // Максимум 10 цифр после +7
    digits = digits.slice(0, 10);

    let formatted = "+7";

    if (digits.length > 0) {
      formatted += ` (${digits.slice(0, 3)}`;

      if (digits.length >= 3) {
        formatted += ")";
      }
    }

    if (digits.length > 3) {
      formatted += ` ${digits.slice(3, 6)}`;
    }

    if (digits.length > 6) {
      formatted += `-${digits.slice(6, 8)}`;
    }

    if (digits.length > 8) {
      formatted += `-${digits.slice(8, 10)}`;
    }

    setFormData({
      ...formData,
      phone: formatted,
    });
    
    setFieldErrors((prev) => ({
  ...prev,
  phone: false,
  }));
    return;
  }

if (name === "contact") {
  const filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");

  setFormData({
    ...formData,
    contact: filteredValue,
  });
  

  setFieldErrors((prev) => ({
  ...prev,
  contact: false,
}));

  return;
}

setFormData({
  ...formData,
  [name]: value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault();
    const errors = {
      phone: formData.phone.replace(/\D/g, "").length !== 11,
      contact: !formData.contact.includes("@"),
      message: !formData.message.trim(),
    };

    setFieldErrors(errors);

    if (errors.phone || errors.contact || errors.message) {
      return;
    }

  setStatus("Отправка...");

  try {
    const response = await fetch("http://localhost:3001/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
  setShowConfetti(true);
  setStatus("");

  setTimeout(() => {
    setShowConfetti(false);
  }, 2500);

  setFieldErrors({
    phone: false,
    contact: false,
    message: false,
  });

  setFormData({
    phone: "",
    contact: "",
    message: "",
  });
}else {
      setStatus("");
    }
  } catch (error) {
    console.error(error);
    setStatus("");
  }
};
  return (
    <main className="page">

      {showConfetti && (
  <div className="celebration">
    <div className="cannon cannon-left">
      <div className="cannon-body" />
      <div className="cannon-particles">
        {Array.from({ length: 45 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>

    <div className="cannon cannon-right">
      <div className="cannon-body" />
      <div className="cannon-particles">
        {Array.from({ length: 45 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  </div>
)}
      <div className="glow glow-top"></div>

      <section className="form-section">
        <div className="spark">✦</div>

        <p className="subtitle">С О З Д А Н И Е&nbsp;&nbsp;С А Й Т О В</p>

        <h1>
          Оставьте заявку
          <br />
          на создание сайта
        </h1>

        <p className="description">
          Заполните форму, и я свяжусь с вами
          <br />
          в ближайшее время, чтобы обсудить
          <br />
          ваш проект.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-box">
            <Phone size={28} strokeWidth={1.5} />

            <div>
              <label>Ваш номер телефона</label>
              <div className="phone-field">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                placeholder={
                  phoneFocused
                    ? "+7 (___) ___-__-__"
                    : "Например: +7 700 123 45 67"
                } 
              />
              </div>
            </div>
          </div>

          <div className={`input-box ${fieldErrors.contact ? "input-box-error" : ""}`}>
          <Send size={28} strokeWidth={1.5} />
          

          <div className={fieldErrors.contact ? "input-wrapper input-wrapper-error" : "input-wrapper"}>
            <label>Ваш Telegram или E-mail</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Например: @username"
            />
          </div>
        </div>

          <div className="input-box textarea-box">
            <MessageCircle size={28} strokeWidth={1.5} />

            <div>
              <label>Что вы хотите?</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Кратко опишите ваш запрос"
              />
            </div>
          </div>

          <button type="submit">
            Отправить
            <ArrowRight size={25} strokeWidth={1.5} />
          </button>
        </form>
        
        {status && <div className="status">{status}</div>}

        <div className="security">
          <ShieldCheck size={20} strokeWidth={1.5} />
          <span>Ваши данные в безопасности</span>
        </div>

        <div className="spark-bottom">✦</div>
      </section>
    </main>
  );
}

export default App;