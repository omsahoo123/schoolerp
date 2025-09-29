import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M 10 25 C 10 10 25 10 25 25 C 25 40 10 40 10 25 Z M 20 25 C 20 15 30 15 30 25 C 30 35 20 35 20 25 Z"
        fill="url(#grad1)"
      />
      <text
        x="45"
        y="32"
        fontFamily="'PT Sans', sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        School ERP
      </text>
    </svg>
  );
}
