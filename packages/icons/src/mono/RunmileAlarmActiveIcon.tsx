import React from "react";

export interface RunmileAlarmActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileAlarmActiveIcon = React.forwardRef<SVGSVGElement, RunmileAlarmActiveIconProps>(
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
      <g transform="translate(2.4336 1.9992)">
    <path id="Union" d="M12.5658 18.3076C12.5656 19.7116 11.2223 20.8494 9.56577 20.8496C7.90903 20.8496 6.56596 19.7118 6.56577 18.3076H12.5658ZM9.56577 0C14.0529 0.000263058 17.6908 3.63785 17.6908 8.125V11.3193C17.6908 11.9104 17.7956 12.4973 18.0003 13.0518L19.0677 15.9434C19.3088 16.5963 18.8262 17.2899 18.1302 17.29H1.00034C0.304389 17.2899 -0.178274 16.5963 0.0628358 15.9434L1.13022 13.0518C1.33499 12.4973 1.44075 11.9104 1.44077 11.3193V8.125C1.44077 3.63769 5.07845 0 9.56577 0Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

RunmileAlarmActiveIcon.displayName = "RunmileAlarmActiveIcon";
