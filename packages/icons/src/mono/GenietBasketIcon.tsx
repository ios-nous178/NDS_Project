import React from "react";

export interface GenietBasketIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietBasketIcon = React.forwardRef<SVGSVGElement, GenietBasketIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fill="currentColor" d="M10.1.466a1.102 1.102 0 0 1 1.8 0l4.536 6.427h4.432c.625 0 1.132.533 1.132 1.191 0 .097-.01.195-.033.289l-2.83 11.918c-.125.53-.578.902-1.097.902H3.962c-.52 0-.972-.372-1.098-.902L.034 8.373c-.151-.638.217-1.285.823-1.444.09-.024.182-.036.275-.036h4.433L10.101.466ZM4.383 19.543h13.236l2.613-11H1.77l2.61 11Zm4.565-8.88c1.31-.831 3.608-.86 5.165.516.36.315.382.844.053 1.188a.906.906 0 0 1-1.243.05c-.883-.78-2.261-.81-3.002-.344-.636.401-.988 1.082-1.003 1.92-.007.544.127 1.54 1.138 2.142.396.236.704.25 1.093.264.688.036 1.422-.257 1.602-.587a.861.861 0 0 0 .112-.465v-.086h-1.34c-.486 0-.883-.38-.883-.845 0-.465.397-.845.884-.846h2.223c.486 0 .883.38.883.846v.91a2.56 2.56 0 0 1-.307 1.26c-.539 1.01-1.894 1.512-3.017 1.512l-.015-.022h-.157c-.554-.021-1.213-.05-2.006-.515-1.819-1.068-1.992-2.873-1.977-3.596.023-1.397.675-2.6 1.797-3.303Zm-1.363-3.77h6.832L11 2.053l-3.416 4.84Z"/>
    </svg>
  )
);

GenietBasketIcon.displayName = "GenietBasketIcon";
