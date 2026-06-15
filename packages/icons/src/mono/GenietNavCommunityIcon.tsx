import React from "react";

export interface GenietNavCommunityIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietNavCommunityIcon = React.forwardRef<SVGSVGElement, GenietNavCommunityIconProps>(
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
      <path fill="currentColor" fillRule="evenodd" d="M16.736 3.2a4.87 4.87 0 0 1 4.871 4.87v5.594a4.871 4.871 0 0 1-4.87 4.871h-3.052l-.213.37-.946 1.638a.523.523 0 0 1-.905 0l-.946-1.638-.215-.37H7.27a4.87 4.87 0 0 1-4.87-4.87V8.07A4.87 4.87 0 0 1 7.27 3.2h9.466Zm-2.076 8.65H9.438a.75.75 0 0 0 0 1.5h5.222a.75.75 0 0 0 0-1.5Zm1.09-3.179H8.347a.75.75 0 0 0 0 1.5h7.401a.75.75 0 0 0 0-1.5Z" clipRule="evenodd"/>
    </svg>
  )
);

GenietNavCommunityIcon.displayName = "GenietNavCommunityIcon";
