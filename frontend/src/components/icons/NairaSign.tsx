import { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NairaSign = forwardRef<SVGSVGElement, LucideProps>(({ className, ...props }, ref) => {
    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("lucide lucide-naira-sign", className)}
            {...props}
        >
            <path d="M4 18V6" />
            <path d="M4 6l16 12" />
            <path d="M20 6v12" />
            <line x1="2" x2="22" y1="10" y2="10" />
            <line x1="2" x2="22" y1="14" y2="14" />
        </svg>
    );
});
NairaSign.displayName = 'NairaSign';
