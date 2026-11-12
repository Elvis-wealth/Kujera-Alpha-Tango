"use client";

import {
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, Eye, EyeOff } from "lucide-react";

type View = "signup" | "login" | "forgot";

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "var(--font-size-label-large)",
  lineHeight: "var(--line-height-label-large)",
  fontWeight: "var(--font-weight-label-large)",
  letterSpacing: "var(--letter-spacing-label-large)",
  color: "var(--on-surface)",
  marginBottom: "var(--spacing-50)",
};

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-200)",
  maxWidth: 400,
};

const submitStyle: CSSProperties = {
  width: "100%",
  height: "var(--control-height-expanded)",
  borderRadius: "var(--radius-medium)",
  border: "none",
  fontSize: "var(--font-size-label-large)",
  lineHeight: "var(--line-height-label-large)",
  fontWeight: "var(--font-weight-label-large)",
  letterSpacing: "var(--letter-spacing-label-large)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const switchLinkStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  fontSize: "var(--font-size-body-medium)",
  lineHeight: "var(--line-height-body-medium)",
};

const backLinkStyle: CSSProperties = {
  position: "absolute",
  top: "var(--spacing-200)",
  left: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--spacing-50)",
  fontSize: "var(--font-size-body-medium)",
  lineHeight: "var(--line-height-body-medium)",
};

const passwordWrapperStyle: CSSProperties = {
  position: "relative",
};

const eyeButtonStyle: CSSProperties = {
  position: "absolute",
  right: "var(--spacing-100)",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "var(--on-surface-variant)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const errorTextStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--spacing-50)",
  fontSize: "var(--font-size-body-small)",
  lineHeight: "var(--line-height-body-small)",
  color: "var(--error)",
  marginTop: "var(--spacing-50)",
};

const hintTextStyle: CSSProperties = {
  fontSize: "var(--font-size-label-medium)",
  lineHeight: "var(--line-height-label-medium)",
  fontWeight: "var(--font-weight-label-medium)",
  letterSpacing: "var(--letter-spacing-label-medium)",
  color: "var(--on-surface-variant)",
  marginTop: "var(--spacing-50)",
};

const passwordRequirements: { label: string; test: RegExp }[] = [
  { label: "Uppercase", test: /[A-Z]/ },
  { label: "Lowercase", test: /[a-z]/ },
  { label: "Number", test: /[0-9]/ },
  { label: "Special Character", test: /[^A-Za-z0-9]/ },
];

const footerTextStyle: CSSProperties = {
  textAlign: "center",
  fontSize: "var(--font-size-body-medium)",
  lineHeight: "var(--line-height-body-medium)",
  color: "var(--on-surface-variant)",
};

const termsTextStyle: CSSProperties = {
  textAlign: "left",
  fontSize: "var(--font-size-body-small)",
  lineHeight: "var(--line-height-body-small)",
  color: "var(--outline)",
};

const successStyle: CSSProperties = {
  backgroundColor: "var(--success-container)",
  color: "var(--on-success-container)",
  padding: "var(--spacing-250)",
  borderRadius: "var(--radius-medium)",
  textAlign: "center",
};

function Field({
  label,
  id,
  validate,
  liveValidate,
  ...inputProps
}: {
  label: string;
  id: string;
  validate?: (value: string) => string | undefined;
  liveValidate?: (value: string) => string | undefined;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [touched, setTouched] = useState(false);

  const rawValue = inputProps.value;
  const value = typeof rawValue === "string" ? rawValue : "";

  const liveError = liveValidate ? liveValidate(value) : undefined;

  let blurError: string | undefined;
  if (touched) {
    if (value === "") {
      blurError = "This field must not be empty";
    } else if (validate) {
      blurError = validate(value);
    }
  }

  const errorMessage = blurError ?? liveError;
  const hasError = Boolean(errorMessage);

  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        id={id}
        className="auth-input"
        {...inputProps}
        onBlur={() => setTouched(true)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError && (
        <p id={`${id}-error`} style={errorTextStyle}>
          <CircleAlert size={16} aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  id,
  value,
  onChange,
  minLength,
  action,
  hint,
  liveValidate,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  action?: ReactNode;
  hint?: boolean;
  liveValidate?: (value: string) => string | undefined;
}) {
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);

  const emptyError = touched && value === "" ? "This field must not be empty" : undefined;
  const liveError = liveValidate ? liveValidate(value) : undefined;
  const errorMessage = emptyError ?? liveError;
  const hasError = Boolean(errorMessage);
  const showHint = Boolean(hint) && value !== "" && !hasError;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "var(--spacing-50)",
        }}
      >
        <label htmlFor={id} style={{ ...labelStyle, marginBottom: 0 }}>
          {label}
        </label>
        {action}
      </div>
      <div style={passwordWrapperStyle}>
        <input
          id={id}
          className="auth-input"
          type={show ? "text" : "password"}
          placeholder="••••••••••"
          value={value}
          minLength={minLength}
          onChange={onChange}
          required
          onBlur={() => setTouched(true)}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hasError ? `${id}-error` : showHint ? `${id}-hint` : undefined
          }
          style={{ paddingRight: "var(--spacing-500)" }}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? "Hide password" : "Show password"}
          style={eyeButtonStyle}
        >
          {show ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
      {hasError ? (
        <p id={`${id}-error`} style={errorTextStyle}>
          <CircleAlert size={16} aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      ) : showHint ? (
        <p id={`${id}-hint`} style={hintTextStyle}>
          {passwordRequirements.map((req, index) => (
            <span key={req.label}>
              <span style={{ color: req.test.test(value) ? "var(--success)" : "inherit" }}>
                {req.label}
              </span>
              {index < passwordRequirements.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function SignupForm({ onSwitch }: { onSwitch: (view: View) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid =
    fullName.trim().split(/\s+/).length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 10 &&
    retypePassword === password;

  if (submitted) {
    return (
      <div style={successStyle}>
        <p style={{ fontSize: "var(--font-size-title-small)", lineHeight: "var(--line-height-title-small)", fontWeight: "var(--font-weight-title-small)", letterSpacing: "var(--letter-spacing-title-small)" }}>
          Check your email to confirm your space.
        </p>
        <p
          style={{
            fontSize: "var(--font-size-body-small)",
            lineHeight: "var(--line-height-body-small)",
            marginTop: "var(--spacing-50)",
          }}
        >
          We sent a single-use confirmation link to <strong>{email}</strong>. It remains valid for
          24 hours.
        </p>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} style={{ ...formStyle, gap: "var(--spacing-150)" }}>
      <Field
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="e.g. Amaka Eze"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        minLength={2}
        validate={(value) => {
          const words = value.trim().split(/\s+/);
          return words.length < 2 ? "Enter your first and last name" : undefined;
        }}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        placeholder="amaka@example.ng"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        liveValidate={(value) => {
          if (value === "") return undefined;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? undefined
            : "Enter a valid email address";
        }}
      />
      <PasswordField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={10}
        hint
      />
      <PasswordField
        id="retypePassword"
        label="Retype Password"
        value={retypePassword}
        onChange={(e) => setRetypePassword(e.target.value)}
        minLength={10}
        liveValidate={(value) => {
          if (value === "") return undefined;
          return value === password ? undefined : "Password does not match";
        }}
      />
      <button type="submit" className="btn-filled" style={submitStyle} disabled={!isFormValid}>
        Get Started
      </button>
      <p style={termsTextStyle}>
        By clicking Get Started, you agree to all our terms and conditions.
      </p>
      <p style={footerTextStyle}>
        Already have an account?{" "}
        <button type="button" className="auth-link" style={switchLinkStyle} onClick={() => onSwitch("login")}>
          Log in
        </button>
      </p>
    </form>
  );
}

function LoginForm({ onSwitch }: { onSwitch: (view: View) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoginValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Sign-in is handled by the server later; no client-side action yet.
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <Field
        id="email"
        label="Email address"
        type="email"
        placeholder="amaka@example.ng"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PasswordField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        action={
          <button type="button" className="auth-link" style={switchLinkStyle} onClick={() => onSwitch("forgot")}>
            Forgot password?
          </button>
        }
      />
      <button type="submit" className="btn-filled" style={submitStyle} disabled={!isLoginValid}>
        Log In
      </button>
      <p style={footerTextStyle}>
        Don&apos;t have an account?{" "}
        <button type="button" className="auth-link" style={switchLinkStyle} onClick={() => onSwitch("signup")}>
          Sign up
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onSwitch }: { onSwitch: (view: View) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={successStyle}>
        <p style={{ fontSize: "var(--font-size-title-small)", lineHeight: "var(--line-height-title-small)", fontWeight: "var(--font-weight-title-small)", letterSpacing: "var(--letter-spacing-title-small)" }}>
          If that email has a Kujera login, we&apos;ve sent a reset link.
        </p>
        <button
          type="button"
          className="auth-link"
          style={{ ...switchLinkStyle, marginTop: "var(--spacing-150)" }}
          onClick={() => onSwitch("login")}
        >
          Back to log in
        </button>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <Field
        id="email"
        label="Email address"
        type="email"
        placeholder="amaka@example.ng"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="btn-filled" style={submitStyle}>
        Send reset link
      </button>
      <p style={footerTextStyle}>
        <button type="button" className="auth-link" style={switchLinkStyle} onClick={() => onSwitch("login")}>
          Back to log in
        </button>
      </p>
    </form>
  );
}

const pageStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  maxWidth: 1024,
  margin: "0 auto",
  paddingTop: "var(--spacing-800)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 350,
  backgroundColor: "var(--surface-container-lowest)",
  border: "var(--border-hairline) solid var(--outline-variant)",
  borderRadius: "var(--radius-xl)",
  padding: "var(--card-padding-expanded)",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: 350,
};

const headingStyle: CSSProperties = {
  fontSize: "var(--font-size-headline-small)",
  lineHeight: "var(--line-height-headline-small)",
  fontWeight: "var(--font-weight-headline-small)",
  letterSpacing: "var(--letter-spacing-headline-small)",
  color: "var(--on-surface)",
  marginBottom: "var(--spacing-50)",
};

const subtitleStyle: CSSProperties = {
  fontSize: "var(--font-size-body-medium)",
  lineHeight: "var(--line-height-body-medium)",
  color: "var(--on-surface-variant)",
  marginBottom: "var(--spacing-300)",
};

const content: Record<View, { title: string; subtitle: string }> = {
  signup: { title: "Sign up your space", subtitle: "Start your 30-day free trial." },
  login: { title: "Log In", subtitle: "Sign in to manage your space." },
  forgot: { title: "Forgot password", subtitle: "Enter your email and we'll send a reset link." },
};

export function AuthView({ initialView }: { initialView?: string }) {
  const [view, setView] = useState<View>(() => {
    if (initialView === "signup" || initialView === "login" || initialView === "forgot") {
      return initialView;
    }
    return "login";
  });

  return (
    <div style={pageStyle}>
      <Link href="/" className="auth-link" style={backLinkStyle}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>

      <div style={contentStyle}>
        <h1 style={headingStyle}>{content[view].title}</h1>
        <p style={subtitleStyle}>{content[view].subtitle}</p>

        <div style={cardStyle}>
          {view === "signup" && <SignupForm onSwitch={setView} />}
          {view === "login" && <LoginForm onSwitch={setView} />}
          {view === "forgot" && <ForgotForm onSwitch={setView} />}
        </div>
      </div>
    </div>
  );
}
