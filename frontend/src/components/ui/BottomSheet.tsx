import { AnimatePresence, motion } from "framer-motion";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Optional title - rendered above children if provided */
  title?: string;
  /** Optional anchor position for action-sheet variant (future use) */
  anchorPosition?: { x: number; y: number };
  className?: string;
};

export function BottomSheet({
  open,
  onClose,
  children,
  title,
  className,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="bottom-sheet-content"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-0 right-0 bottom-0 z-50 w-full max-w-2xl mx-auto rounded-t-[2rem] p-4 sm:p-6 max-h-[85vh] overflow-y-auto border-t border-border bg-background/95 backdrop-blur-xl relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
          >
            <div className="scroll-edge-top absolute top-0 left-0 right-0 h-12 z-[1] pointer-events-none" aria-hidden />
            {title && (
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
                {title}
              </h2>
            )}
            <div className={className ?? ""}>{children}</div>
            <div className="scroll-edge-bottom absolute bottom-0 left-0 right-0 h-12 z-[1] pointer-events-none" aria-hidden />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
