"use client";

import { cn } from "../../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { PulseBeams, BeamPath } from "./pulse-beams";

interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
    </>
  );
};

const sidebarBeams: BeamPath[] = [
  {
    path: "M 32 0 V 1000",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "0%" },
      animate: { x1: "0%", x2: "0%", y1: ["0%", "100%"], y2: ["0%", "100%"] },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 0.5,
      },
    },
    connectionPoints: [
      { cx: 32, cy: 100, r: 1.5 },
      { cx: 32, cy: 300, r: 1.5 },
      { cx: 32, cy: 600, r: 1.5 },
    ],
  },
  {
    path: "M 44 0 V 1000",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "0%" },
      animate: { x1: "0%", x2: "0%", y1: ["0%", "100%"], y2: ["0%", "100%"] },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        delay: 2,
      },
    },
  },
  {
    path: "M 260 0 Q 150 300 260 600",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "0%" },
      animate: { x1: "0%", x2: "0%", y1: ["0%", "100%"], y2: ["0%", "100%"] },
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 1,
      },
    },
  },
];

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col bg-transparent w-[300px] flex-shrink-0 relative overflow-hidden",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <PulseBeams
          beams={sidebarBeams}
          width={300}
          height={1000}
          baseColor="rgba(255,255,255,0.03)"
          accentColor="rgba(56,189,248,0.2)"
          className="h-full w-full bg-transparent items-start justify-start"
          background={
             /* Transparent gradient for legibility without opaque block */
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          }
        />
      </div>
      <div className="relative z-10 flex flex-col h-full px-4 py-4">
        {children}
      </div>
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-transparent w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col justify-between overflow-hidden md:hidden",
                className
              )}
            >
               <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <PulseBeams
                  beams={sidebarBeams}
                  width={400}
                  height={1000}
                  baseColor="rgba(255,255,255,0.05)"
                  accentColor="rgba(56,189,248,0.2)"
                  className="h-full w-full bg-transparent items-start justify-start"
                />
              </div>
              <div className="relative z-10 flex flex-col h-full p-8 pt-16">
                <div
                  className="absolute left-4 top-4 z-50 flex items-center gap-2 text-neutral-200 cursor-pointer hover:text-white p-2"
                  onClick={() => setOpen(false)}
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span className="text-lg font-medium">Back</span>
                </div>
                <div
                  className="absolute right-4 top-4 z-50 text-neutral-200 cursor-pointer hover:text-white p-2"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                   {children}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { open, animate, setOpen } = useSidebar();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (link.onClick) {
          e.preventDefault();
          link.onClick();
      }
      // Close sidebar on link click (especially important for mobile)
      setOpen(false);
      
      if (props.onClick) {
        props.onClick(e);
      }
  }

  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};