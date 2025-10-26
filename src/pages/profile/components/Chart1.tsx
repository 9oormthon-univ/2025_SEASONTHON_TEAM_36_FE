import { useLayoutEffect, useRef, useState } from "react";
import { CartesianGrid, DotProps, LabelProps, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "9월 1주",
    달성률: 25,
  },
  {
    name: "9월 2주",
    달성률: 64,
  },
  {
    name: "9월 3주",
    달성률: 44,
  },
  {
    name: "9월 4주",
    달성률: 88,
  },
];

interface CustomDotProps {
  cx?: number;
  cy?: number;
  value?: number;
  index?: number;
  stroke?: string;
  fill?: string;
}

const Chart1 = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const CustomActiveDot = (props: CustomDotProps) => {
    const { cx, cy, index } = props;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // 같은 점을 다시 클릭하면 토글
      setActiveIndex(prev => (prev === index ? null : (index as number)));
    };

    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="white"
        stroke="red"
        strokeWidth={2}
        onClick={handleClick}
        style={{ cursor: "pointer", filter: "none" }}
      />
    );
  };

  const CustomLabel = ({ x, y, value, index }: LabelProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
    }, [value]);

    if (activeIndex !== index) {
      return null;
    }

    return (
      <foreignObject
        x={(x as number) - width / 2}
        y={(y as number) - 36} // 위쪽으로 이동
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <div
          ref={ref}
          style={{
            color: "var(--green-500)",
            fontSize: "var(--fs-md)",
            background: "white",
            border: "1px solid var(--green-500)",
            borderRadius: "7px",
            boxShadow:
              "-0.3px -0.3px 5px 0 var(--natural-color-natural-400, #D6D9E0), 0.3px 0.3px 5px 0 var(--natural-color-natural-400, #D6D9E0)",
            padding: "4px 21px",
            display: "inline-block",
          }}
        >
          {`${value}%`}
        </div>
      </foreignObject>
    );
  };
  return (
    <LineChart
      style={{
        width: "100%",
        aspectRatio: 1.618,
        maxWidth: 600,
        paddingRight: "16px",
      }}
      data={data}
    >
      <CartesianGrid stroke="rgba(0, 0, 42, 0.15)" strokeDasharray="3 3" vertical={false} />
      <defs>
        <filter id="dualShadow" x="-40%" y="-40%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur1" />
          <feOffset in="blur1" dx="3" dy="0" result="off1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur2" />
          <feOffset in="blur2" dx="-3" dy="0" result="off2" />
          <feFlood floodColor="#3CC3DF" floodOpacity="0.4" result="color2" />
          <feComposite in="color2" in2="off2" operator="in" result="shadow2" />
          <feMerge>
            <feMergeNode in="shadow1" />
            <feMergeNode in="shadow2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <XAxis
        dataKey="name"
        tickLine={false}
        tickMargin={4}
        interval={"preserveStartEnd"}
        padding={{ left: 35, right: 35 }}
        fontWeight={500}
        stroke="#6f737b"
        tick={{ fill: "#000", fontSize: 12, fontWeight: 500 }}
      />
      <YAxis
        axisLine={false}
        stroke="#6f737b"
        tickLine={false}
        ticks={[0, 20, 40, 60, 80, 100]}
        tick={({ x, y, payload }: { x: number; y: number; payload: { value: number } }) => {
          const value: number = payload.value;
          return (
            <text x={x - 28} y={y - 4} textAnchor="start" fill="#6f737b" fontSize={12}>
              {`${value}%`}
            </text>
          );
        }}
      />
      <Line
        dataKey="달성률"
        stroke="#0e7400"
        dot={{ strokeWidth: 2, style: { filter: "none" } }}
        activeDot={CustomActiveDot}
        label={CustomLabel}
        strokeLinecap="round"
        isAnimationActive={false}
        style={{ filter: "url(#dualShadow)" }}
      />
    </LineChart>
  );
};

export default Chart1;
