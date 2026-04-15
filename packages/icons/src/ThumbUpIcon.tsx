import React from "react";

export interface ThumbUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ThumbUpIcon = React.forwardRef<SVGSVGElement, ThumbUpIconProps>(
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
      <g transform="translate(3.5, 3.25)">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.67601 7.07109H5.08301V16.7491H2.67601C2.42239 16.7486 2.17136 16.6981 1.93727 16.6005C1.70318 16.5029 1.49063 16.3601 1.31176 16.1803C1.13288 16.0005 0.991203 15.7872 0.894815 15.5526C0.798427 15.318 0.74922 15.0667 0.750009 14.8131V9.00709C0.74922 8.75348 0.798427 8.50219 0.894815 8.2676C0.991203 8.03301 1.13288 7.81971 1.31176 7.63991C1.49063 7.46011 1.70318 7.31733 1.93727 7.21973C2.17136 7.12212 2.42239 7.07162 2.67601 7.07109Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.3246 7.07122H10.3476L10.8516 5.94722C11.2677 5.00958 11.2957 3.94538 10.9295 2.98714C10.5634 2.0289 9.83289 1.25453 8.89759 0.833223C8.7824 0.781794 8.65818 0.753622 8.53207 0.750327C8.40596 0.747031 8.28044 0.768677 8.16272 0.814019C8.04499 0.859362 7.93739 0.927509 7.84607 1.01455C7.75475 1.10159 7.68153 1.20581 7.63059 1.32122L5.08359 7.07122V16.7492H13.2576C14.1876 16.7492 14.9836 16.0832 15.1516 15.1652L16.2186 9.35822C16.271 9.07964 16.2615 8.79293 16.1905 8.51847C16.1196 8.24401 15.9891 7.98853 15.8083 7.77021C15.6275 7.55189 15.4009 7.37607 15.1444 7.25526C14.888 7.13445 14.6081 7.07162 14.3246 7.07122Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </g>
    </svg>
  )
);

ThumbUpIcon.displayName = "ThumbUpIcon";
