import React from "react";

export interface EditIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const EditIcon = React.forwardRef<SVGSVGElement, EditIconProps>(
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
      <g transform="translate(3 3)">
    <path id="Combined Shape" d="M12.2441 0.987377C13.561 -0.329033 15.6959 -0.329218 17.0126 0.987377C18.3293 2.30427 18.3295 4.44011 17.0126 5.75691L6.18941 16.5802C6.06701 16.7025 5.91296 16.7892 5.74507 16.8311L1.18745 17.9708C0.488232 18.1453 -0.145153 17.5118 0.0292514 16.8126L1.1689 12.255C1.21086 12.0872 1.29769 11.9339 1.41988 11.8116L12.2441 0.987377ZM2.95796 12.9727L2.26851 15.7305L5.02242 15.043L12.9375 7.128L10.871 5.0616L2.95796 12.9727ZM15.6621 2.33894C15.0912 1.76812 14.1655 1.76812 13.5947 2.33894L12.0849 3.84773L14.1513 5.91414L15.6621 4.40535C16.1916 3.87536 16.2293 3.03947 15.7753 2.46589L15.6621 2.33894Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

EditIcon.displayName = "EditIcon";
