import { Link } from "react-router-dom";
import React from "react";

import { cn } from "@/lib/utils";

const Skiper40 = () => {
  return (
    <section className="h-full snap-y snap-mandatory overflow-y-scroll">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
        <Link001 href="/citizen">Citizen Pre-Check</Link001>
        <Link002 href="/module">Module Curriculum</Link002>
        <Link003 href="/login">Officer Portal</Link003>
      </div>
    </section>
  );
};

export { Link000, Link001, Link002, Link003, Link004, Link005, Skiper40 };

const Link000 = ({
  children,
  href,
  className,
  role,
  onClick,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  role?: string;
  onClick?: () => void;
  'aria-label'?: string;
}) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const linkClasses = cn(
    "group relative inline-flex items-center",
    className,
    "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100",
  );

  if (isInternal && !href.startsWith("#")) {
    return (
      <Link to={href} className={linkClasses} role={role} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={linkClasses} role={role} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </a>
  );
};


const Link001 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const linkClasses = cn(
    "group relative inline-flex items-center",
    "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100",
    className,
  );

  const icon = (
    <svg
      className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
      fill="none"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  if (isInternal && !href.startsWith("#")) {
    return (
      <Link to={href} className={linkClasses}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <a href={href} className={linkClasses}>
      {children}
      {icon}
    </a>
  );
};

const Link002 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const linkClasses = cn(
    "group relative inline-flex items-center",
    className,
    "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "before:origin-left",
    "hover:before:origin-right hover:before:scale-x-100",
  );

  const icon = (
    <svg
      className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
      fill="none"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  if (isInternal && !href.startsWith("#")) {
    return (
      <Link to={href} className={linkClasses}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <a href={href} className={linkClasses}>
      {children}
      {icon}
    </a>
  );
};

const Link003 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const linkClasses = cn(
    "group relative inline-flex items-center",
    className,
    "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "before:origin-center",
    "hover:before:scale-x-100",
  );

  const icon = (
    <svg
      className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
      fill="none"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );

  if (isInternal && !href.startsWith("#")) {
    return (
      <Link to={href} className={linkClasses}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <a href={href} className={linkClasses}>
      {children}
      {icon}
    </a>
  );
};

const Link004 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center md:before:bottom-0",
        "before:z-1 px-2 before:h-0 before:scale-x-100 before:mix-blend-difference hover:before:h-[1.4em]",
      )}
    >
      {children}
    </a>
  );
};

const Link005 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        className,
        "group relative inline-flex items-center",
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left md:before:top-0",
        "before:z-1 px-2 before:h-full before:scale-x-0 before:mix-blend-difference hover:before:scale-x-100",
      )}
    >
      {children}
    </a>
  );
};
