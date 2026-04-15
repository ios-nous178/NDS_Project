import React from "react";

export interface TestIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TestIcon = React.forwardRef<SVGSVGElement, TestIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M13.2773 3C13.5639 2.99974 13.8475 3.05806 14.1123 3.1709C14.3773 3.28384 14.6185 3.44925 14.8213 3.6582L19.3594 8.3418C19.7686 8.76334 19.9995 9.33514 20 9.93164V18.75C20 19.3467 19.7695 19.9189 19.3604 20.3408C18.9513 20.7626 18.3968 20.9999 17.8184 21H6.18164C5.60299 21 5.04784 20.7628 4.63867 20.3408C4.22958 19.9189 4 19.3467 4 18.75V5.25C4 4.65332 4.22958 4.08112 4.63867 3.65918C5.04784 3.23722 5.60299 3 6.18164 3H13.2773ZM8.5 14.5C7.94773 14.5 7.50003 14.9477 7.5 15.5C7.5 16.0521 7.94696 16.4997 8.49902 16.5H15.499C16.0513 16.5 16.5 16.0523 16.5 15.5C16.5 14.9479 16.052 14.5003 15.5 14.5H8.5ZM8.5 10C7.94773 10 7.50003 10.4477 7.5 11C7.5 11.5521 7.94696 11.9997 8.49902 12H15.499C16.0513 12 16.5 11.5523 16.5 11C16.5 10.4479 16.052 10.0003 15.5 10H8.5Z" fill="currentColor"/>
    </svg>
  )
);

TestIcon.displayName = "TestIcon";
