import * as React from 'react';
import { SVGProps } from 'react';

interface iconIdProps extends SVGProps<SVGSVGElement> {
  iconid: number;
}

export default class IdIcons {
  static amount = 35;

  static Variable = (props: iconIdProps): JSX.Element => {
    switch (props.iconid) {
      case -2:
        return this.Icon3(props, '#fab700', '#d28f00');
      case 0:
        return this.Icon0(props);
      case 1:
        return this.Icon1(props);
      case 2:
        return this.Icon2(props);
      case 3:
        return this.Icon3(props, '#00ab36', '#006f0e');
      case 4:
        return this.Icon3(props, '#ab0036', '#6f000e');
      case 5:
        return this.Icon5(props);
      case 6:
        return this.Icon6(props);
      case 7:
        return this.Icon7(props);
      case 8:
        return this.Icon8(props);
      case 9:
        return this.Icon9(props);
      case 10:
        return this.Icon10(props);
      case 11:
        return this.Icon11(props);
      case 12:
        return this.Icon13(props);
      case 13:
        return this.Icon12(props);
      case 14:
        return this.Icon14(props);
      case 15:
        return this.Icon15(props);
      case 16:
        return this.Icon16(props);
      case 17:
        return this.Icon17(props);
      case 18:
        return this.Icon18(props);
      case 19:
        return this.Icon19(props);
      case 20:
        return this.Icon20(props);
      case 21:
        return this.Icon21(props);
      case 22:
        return this.Icon22(props);
      case 23:
        return this.Icon23(props);
      case 24:
        return this.Icon24(props);
      case 25:
        return this.Icon25(props);
      case 26:
        return this.Icon26(props);
      case 27:
        return this.Icon27(props);
      case 28:
        return this.Icon28(props);
      case 29:
        return this.Icon29(props);
      case 30:
        return this.Icon30(props);
      case 31:
        return this.Icon31(props);
      case 32:
        return this.Icon32(props);
      case 33:
        return this.Icon33(props);
      case 34:
        return this.Icon34(props);
      case 35:
        return this.Icon35(props);
      default:
        return this.defaultIcon(props);
    }
  };

  static defaultIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_1_svg__cls-2{fill:#ab0036}'}</style>
      </defs>
      <g id="Recurso_1_svg__Capa_2" data-name="Capa 2">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#c4c4c4',
          }}
          id="Recurso_1_svg__Capa_1-2"
          data-name="Capa 1"
        />
        <g id="Recurso_1_svg__Capa_2-2" data-name="Capa 2">
          <path
            className="Recurso_1_svg__cls-2"
            d="M72 29.57c-.64-10.32-10-20-20.31-21a22.5 22.5 0 0 0-24 17.2 1.39 1.39 0 0 0 1.52 1.69l1.81-.21a2.27 2.27 0 0 0 1.89-1.56A17.49 17.49 0 1 1 52 48.3a2.48 2.48 0 0 0-2.47 2.47V76h5V54a1.43 1.43 0 0 1 1.06-1.37A22.49 22.49 0 0 0 72 29.57Z"
          />
          <circle className="Recurso_1_svg__cls-2" cx={52} cy={86} r={4.5} />
        </g>
      </g>
    </svg>
  );

  static Icon0 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: 'none',
        }}
      />
      <path
        d="M97.5 50c0 26.23-21.27 47.5-47.5 47.5-63.01-2.5-62.99-92.51 0-95 26.23 0 47.5 21.27 47.5 47.5Z"
        style={{
          stroke: '#fff',
          strokeDasharray: '0 0 12.43 12.43',
          strokeMiterlimit: 10,
          strokeWidth: 5,
          fill: 'none',
        }}
      />
    </svg>
  );

  static Icon1 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_4_svg__e{fill:#ab0036}'}</style>
      </defs>
      <g id="Recurso_4_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#3b7c77',
          }}
          id="Recurso_4_svg__c"
        />
        <g id="Recurso_4_svg__d">
          <path className="Recurso_4_svg__e" d="m46.85 23.72-4.6 7h15.5l-4.6-7h-6.3z" />
          <path
            className="Recurso_4_svg__e"
            d="M72.44 18.71c-1.31-2.99-7.26-3.27-13.29-.62-6.02 2.65-9.84 7.22-8.53 10.21 1.31 2.99 7.26 3.27 13.29.62 6.02-2.65 9.84-7.22 8.53-10.21Zm-8.64 9.65c-4.72 2.15-9.49 1.99-10.66-.34s1.71-5.97 6.43-8.11 9.49-1.99 10.66.34-1.71 5.97-6.43 8.11Z"
          />
          <path
            className="Recurso_4_svg__e"
            d="M36.15 28.93c6.02 2.65 11.97 2.37 13.29-.62 1.31-2.99-2.5-7.56-8.53-10.21-6.02-2.65-11.97-2.37-13.29.62-1.31 2.99 2.5 7.56 8.53 10.21Zm-6.32-8.67c1.17-2.33 5.94-2.49 10.66-.34s7.6 5.78 6.43 8.11c-1.17 2.33-5.94 2.49-10.66.34-4.72-2.15-7.6-5.78-6.43-8.11Z"
          />
          <rect
            x={25}
            y={29.72}
            width={50}
            height={50}
            rx={3}
            ry={3}
            style={{
              fill: '#dbc583',
            }}
          />
          <path className="Recurso_4_svg__e" d="M75 47.22H57.5v-17.5h-15v17.5H25v15h17.5v17.5h15v-17.5H75v-15Z" />
        </g>
      </g>
    </svg>
  );

  static Icon2 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_7_svg__e{fill:#fff}.Recurso_7_svg__h{fill:#18bc65}.Recurso_7_svg__i{fill:#00ab36}'}</style>
      </defs>
      <g id="Recurso_7_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#3b7c77',
          }}
          id="Recurso_7_svg__c"
        />
        <g id="Recurso_7_svg__d">
          <path
            className="Recurso_7_svg__e"
            d="M38.66 19.85 16.5 43h67L61.34 19.85A6.013 6.013 0 0 0 57 18H42.98c-1.63 0-3.2.67-4.33 1.85Z"
          />
          <path
            style={{
              stroke: '#000',
              strokeMiterlimit: 10,
              strokeWidth: '.1px',
              fill: '#fff',
            }}
            d="m66.75 60.45 16.75-17.5h-67l16.75 17.5h33.5z"
          />
          <path
            className="Recurso_7_svg__i"
            d="M18.23 41.41h42.14c.83 0 1.5.67 1.5 1.5v18.78c0 .83-.67 1.5-1.5 1.5h-41.8c-.83 0-1.5-.67-1.5-1.5V42.58c0-.64.52-1.17 1.17-1.17Z"
            transform="rotate(-50 39.464 52.29)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={39.47}
            cy={52.3}
            rx={12.32}
            ry={6.53}
            transform="rotate(-50 39.464 52.29)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={45.75}
            cy={31.25}
            rx={1.12}
            ry={1.09}
            transform="rotate(-50 45.749 31.254)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={59.1}
            cy={42.45}
            rx={1.12}
            ry={1.09}
            transform="rotate(-50 59.102 42.454)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={33.18}
            cy={73.34}
            rx={1.12}
            ry={1.09}
            transform="rotate(-50 33.185 73.343)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={19.83}
            cy={62.14}
            rx={1.12}
            ry={1.09}
            transform="rotate(-50 19.832 62.143)"
          />
          <path
            className="Recurso_7_svg__i"
            d="M28.23 43.42h42.14c.83 0 1.5.67 1.5 1.5V63.7c0 .83-.67 1.5-1.5 1.5h-41.8c-.83 0-1.5-.67-1.5-1.5V44.59c0-.64.52-1.17 1.17-1.17Z"
            transform="rotate(-40 49.461 54.313)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={49.47}
            cy={54.31}
            rx={12.32}
            ry={6.53}
            transform="rotate(-40 49.461 54.313)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={59.31}
            cy={34.67}
            rx={1.12}
            ry={1.09}
            transform="rotate(-40 59.317 34.673)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={70.51}
            cy={48.02}
            rx={1.12}
            ry={1.09}
            transform="rotate(-40 70.514 48.02)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={39.62}
            cy={73.94}
            rx={1.12}
            ry={1.09}
            transform="rotate(-40 39.625 73.944)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={28.42}
            cy={60.59}
            rx={1.12}
            ry={1.09}
            transform="rotate(-40 28.428 60.597)"
          />
          <path
            className="Recurso_7_svg__i"
            d="M36.23 46.61h42.14c.83 0 1.5.67 1.5 1.5v18.78c0 .83-.67 1.5-1.5 1.5H36.56c-.83 0-1.5-.67-1.5-1.5V47.78c0-.64.52-1.17 1.17-1.17Z"
            transform="rotate(-30 57.473 57.5)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={57.47}
            cy={57.5}
            rx={12.32}
            ry={6.53}
            transform="rotate(-30 57.473 57.5)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={70.57}
            cy={39.87}
            rx={1.12}
            ry={1.09}
            transform="rotate(-30 70.577 39.87)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={79.28}
            cy={54.96}
            rx={1.12}
            ry={1.09}
            transform="rotate(-30 79.292 54.966)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={44.36}
            cy={75.13}
            rx={1.12}
            ry={1.09}
            transform="rotate(-30 44.37 75.129)"
          />
          <ellipse
            className="Recurso_7_svg__h"
            cx={35.65}
            cy={60.04}
            rx={1.12}
            ry={1.09}
            transform="rotate(-30 35.654 60.033)"
          />
          <path className="Recurso_7_svg__e" d="M66.75 60.5h-33.5L16.5 43v35h67V43L66.75 60.5z" />
          <path
            style={{
              fill: 'none',
              stroke: '#000',
              strokeMiterlimit: 10,
              strokeWidth: '.1px',
            }}
            d="M33.25 60.5 16.5 78h67L66.75 60.5h-33.5z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon3 = (props: SVGProps<SVGSVGElement>, color1: string, color2: string) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#22398e',
        }}
      />
      <path
        style={{
          fill: '#a67c52',
        }}
        d="M50 81.66 20 64.34v-30l30 17.32v30z"
      />
      <path
        style={{
          fill: color1,
        }}
        d="M50 70.66 20 53.34v-7l30 17.32v7z"
      />
      <path
        style={{
          fill: '#8c6239',
        }}
        d="m50 81.66 30-17.32v-30L50 51.66v30z"
      />
      <path
        style={{
          fill: color2,
        }}
        d="m50 70.66 30-17.32v-7L50 63.66v7z"
      />
      <path
        style={{
          fill: '#b0865a',
        }}
        d="M80 34.34 50 51.66 20 34.34l30-17.32 30 17.32z"
      />
      <path
        style={{
          fill: '#81ccdf',
        }}
        d="M66.76 26.7 36.77 44.02l-3.53-2.04 29.99-17.32 3.53 2.04z"
      />
    </svg>
  );

  static Icon5 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_10_svg__h{fill:#cbc852}'}</style>
      </defs>
      <g id="Recurso_10_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#54398e',
          }}
          id="Recurso_10_svg__c"
        />
        <g id="Recurso_10_svg__d">
          <path
            d="M29.58 4.36a50.232 50.232 0 0 0-7.57 4.2L48.82 55h10L29.58 4.36Z"
            style={{
              fill: '#00830e',
            }}
          />
          <path
            d="M69.75 4.06 39.18 57h10L77.37 8.17a49.98 49.98 0 0 0-7.63-4.11Z"
            style={{
              fill: '#00ab36',
            }}
          />
          <circle
            cx={50}
            cy={60}
            r={14}
            style={{
              fill: '#e9e666',
            }}
          />
          <path
            className="Recurso_10_svg__h"
            d="M50 47c7.17 0 13 5.83 13 13s-5.83 13-13 13-13-5.83-13-13 5.83-13 13-13m0-2c-8.28 0-15 6.72-15 15s6.72 15 15 15 15-6.72 15-15-6.72-15-15-15Z"
          />
          <path
            className="Recurso_10_svg__h"
            d="M45.73 59.03c2.2-1.18 4.04-2.94 5.32-5.09l-2.1-.57c-.08 4.33-1.2 8.66.61 12.8.24.56 1.06.68 1.54.4.57-.34.65-.98.4-1.54-1.59-3.64-.38-7.87-.31-11.67.02-1.13-1.53-1.51-2.1-.57a11.527 11.527 0 0 1-4.51 4.28c-1.28.68-.14 2.62 1.14 1.94Z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon6 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>
          {
            '.Recurso_11_svg__e{fill:#00ab36}.Recurso_11_svg__j,.Recurso_11_svg__k{stroke:#00830e;fill:none;stroke-miterlimit:10;stroke-width:.2px}.Recurso_11_svg__k{stroke:#005b00}'
          }
        </style>
      </defs>
      <g id="Recurso_11_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#c479b1',
          }}
          id="Recurso_11_svg__c"
        />
        <g id="Recurso_11_svg__d">
          <path
            style={{
              fill: '#00d35e',
            }}
            d="M64.07 44.16H15.32l21.11-12.19h48.75L64.07 44.16z"
          />
          <path className="Recurso_11_svg__e" d="M15.25 44.16h48.76v24.38H15.25z" />
          <ellipse
            className="Recurso_11_svg__e"
            cx={50.6}
            cy={38.06}
            rx={16.84}
            ry={3.24}
            transform="rotate(-1.42 50.776 38.158)"
          />
          <path
            style={{
              fill: '#00830e',
            }}
            d="M85.25 56.31 64.01 68.57V44.19l21.24-12.26v24.38z"
          />
          <path
            className="Recurso_11_svg__k"
            d="m63.99 50.81 21.24-12.26M63.99 51.51l21.24-12.27M63.99 52.2l21.24-12.26M63.99 52.9l21.24-12.27M63.99 53.6l21.24-12.27M63.99 54.29l21.24-12.26M63.99 50.11l21.24-12.26M63.99 49.42l21.24-12.27M63.99 48.72l21.24-12.26M63.99 48.02l21.24-12.26M63.99 47.33l21.24-12.27M63.99 46.63l21.24-12.26M63.99 45.93l21.24-12.26M63.99 45.24l21.24-12.27M63.99 60.56 85.23 48.3M63.99 61.26l21.24-12.27M63.99 61.95l21.24-12.26M63.99 62.65l21.24-12.26M63.99 63.35l21.24-12.27M63.99 64.04l21.24-12.26M63.99 59.87 85.23 47.6M63.99 65.44l21.24-12.27M63.99 66.13l21.24-12.26M63.99 66.83l21.24-12.26M63.99 67.53l21.24-12.27M63.99 68.22l21.24-12.26M63.99 64.74l21.24-12.26M63.99 59.17 85.23 46.9M63.99 58.47l21.24-12.26M63.99 57.78l21.24-12.27M63.99 57.08l21.24-12.27M63.99 56.38l21.24-12.26M63.99 55.69l21.24-12.27M63.99 54.99l21.24-12.27"
          />
          <path
            className="Recurso_11_svg__j"
            d="M15.25 50.77h48.76M15.25 51.47h48.76M15.25 52.17h48.76M15.25 52.86h48.76M15.25 53.56h48.76M15.25 54.25h48.76M15.25 50.08h48.76M15.25 49.38h48.76M15.25 48.68h48.76M15.25 47.99h48.76M15.25 47.29h48.76M15.25 46.59h48.76M15.25 45.9h48.76M15.25 45.2h48.76M15.25 60.52h48.76M15.25 61.22h48.76M15.25 61.92h48.76M15.25 62.61h48.76M15.25 63.31h48.76M15.25 64.01h48.76M15.25 59.83h48.76M15.25 65.4h48.76M15.25 66.1h48.76M15.25 66.79h48.76M15.25 67.49h48.76M15.25 68.19h48.76M15.25 64.7h48.76M15.25 59.13h48.76M15.25 58.43h48.76M15.25 57.74h48.76M15.25 57.04h48.76M15.25 56.34h48.76M15.25 55.65h48.76M15.25 54.95h48.76"
          />
          <path
            style={{
              fill: '#b0865a',
            }}
            d="M34.4 44.16h10.45v24.38H34.4z"
          />
          <path
            style={{
              fill: '#d8ae82',
            }}
            d="M44.74 44.16H34.3l21.11-12.19h10.45L44.74 44.16z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon7 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_14_svg__f{fill:#00ab36}'}</style>
      </defs>
      <g id="Recurso_14_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#374d9c',
          }}
          id="Recurso_14_svg__c"
        />
        <g id="Recurso_14_svg__d">
          <path
            style={{
              fill: '#dde900',
            }}
            d="m55.4 22.89.1.12-36 30.2 19.78 23.57 36-30.21-.1-.11 4.32-23.71-24.1.14z"
          />
          <path
            className="Recurso_14_svg__f"
            d="m44.26 51.13-5.21 4.37-4.37-5.21-.95.8 4.37 5.21-5.21 4.37.8.95 5.21-4.38 4.37 5.22.95-.8-4.38-5.21 5.21-4.37-.79-.95zM59.3 28.5l-.94.79-2.14 24.39.95-.79L59.3 28.5z"
          />
          <circle className="Recurso_14_svg__f" cx={49.3} cy={42.54} r={2.78} />
          <circle className="Recurso_14_svg__f" cx={66.23} cy={39.64} r={2.78} />
        </g>
      </g>
    </svg>
  );

  static Icon8 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_15_svg__g{fill:#00ab36}'}</style>
      </defs>
      <g id="Recurso_15_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#7890c9',
          }}
          id="Recurso_15_svg__c"
        />
        <g id="Recurso_15_svg__d">
          <path
            d="M47.5 99.95c.83.04 1.66.05 2.5.05s1.67-.02 2.5-.05V26h-5v73.95Z"
            style={{
              fill: '#ebebeb',
            }}
          />
          <rect
            x={15}
            y={33}
            width={70}
            height={23}
            rx={2.56}
            ry={2.56}
            style={{
              fill: '#d7d7d7',
            }}
          />
          <path
            className="Recurso_15_svg__g"
            d="M31.11 39.82c-.11-.11-.32-.26-.61-.44-.3-.18-.66-.37-1.08-.56-.42-.19-.88-.35-1.38-.48-.5-.13-1-.19-1.51-.19-.9 0-1.57.16-2.03.49s-.68.8-.68 1.42c0 .46.14.83.43 1.1.29.27.72.5 1.3.69.58.19 1.3.4 2.16.62 1.12.27 2.09.6 2.92.99.82.39 1.46.9 1.9 1.53.44.63.66 1.47.66 2.52 0 .89-.17 1.66-.5 2.29s-.8 1.16-1.38 1.56c-.58.41-1.26.7-2.02.88-.76.18-1.56.27-2.41.27s-1.7-.09-2.54-.26-1.66-.43-2.44-.76-1.5-.72-2.17-1.19l1.46-2.86c.14.14.4.33.77.56s.82.46 1.34.7c.53.23 1.1.43 1.73.59.62.16 1.26.24 1.9.24.91 0 1.59-.15 2.04-.44.45-.29.67-.72.67-1.29 0-.51-.18-.91-.54-1.21-.36-.29-.87-.55-1.52-.76s-1.43-.44-2.33-.68c-1.09-.3-1.99-.65-2.7-1.03-.71-.38-1.25-.86-1.61-1.42-.36-.57-.54-1.28-.54-2.14 0-1.16.28-2.14.84-2.93.56-.79 1.31-1.39 2.26-1.79.94-.41 1.99-.61 3.14-.61.8 0 1.56.09 2.27.26.71.18 1.38.41 2 .7.62.29 1.18.6 1.68.94l-1.46 2.69ZM39.92 35.36h3.36l6.26 17.04h-3.41l-1.42-4.25h-6.26l-1.42 4.25h-3.41l6.29-17.04Zm4.02 10.46-2.34-7.03-2.36 7.03h4.7ZM51.42 52.4V35.36h3.31V49.5h8.69v2.9h-12ZM77.27 49.5v2.9H65.44V35.36h11.62v2.9h-8.3v4.1h7.15v2.69h-7.15v4.44h8.52Z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon9 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_17_svg__h{fill:#1b1464}'}</style>
      </defs>
      <g id="Recurso_17_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#981869',
          }}
          id="Recurso_17_svg__c"
        />
        <g id="Recurso_17_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_17_svg__h"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <path d="M56.8 55.89c-.1-.07-.36-.25-.79-.52-.43-.28-.97-.56-1.62-.85-.65-.29-1.36-.53-2.12-.74-.77-.2-1.54-.31-2.3-.31-1.01 0-1.78.18-2.32.54s-.81.89-.81 1.58c0 .55.2 1 .61 1.35.41.35 1.01.65 1.8.9s1.76.53 2.92.85c1.63.46 3.04.99 4.23 1.6 1.19.61 2.11 1.4 2.77 2.36s.99 2.23.99 3.82c0 1.42-.27 2.63-.81 3.65s-1.26 1.84-2.16 2.45a9.18 9.18 0 0 1-3.06 1.33c-1.14.28-2.33.41-3.58.41s-2.52-.13-3.82-.4c-1.3-.26-2.55-.64-3.76-1.12-1.21-.48-2.32-1.03-3.33-1.66l2.59-5.18c.12.14.44.37.95.68.52.31 1.17.64 1.96.99s1.66.66 2.61.94c.95.28 1.91.41 2.9.41 1.08 0 1.87-.17 2.38-.52.5-.35.76-.82.76-1.42s-.27-1.12-.81-1.49-1.27-.71-2.2-1.01c-.92-.3-1.99-.62-3.19-.95-1.56-.5-2.85-1.05-3.87-1.64-1.02-.59-1.78-1.31-2.27-2.18-.49-.86-.74-1.93-.74-3.2 0-1.82.43-3.35 1.28-4.59.85-1.24 2-2.17 3.44-2.81 1.44-.64 3.01-.95 4.72-.95 1.22 0 2.39.14 3.51.43 1.12.29 2.16.65 3.13 1.08.97.43 1.83.88 2.57 1.33l-2.56 4.82Zm-7.92-11.23h2.59v6.37l-2.59.47v-6.84Zm0 26.53h2.59v7.2h-2.59v-7.2Zm.4-.68V52.08l1.76-.47v18.97l-1.76-.07Z" />
        </g>
      </g>
    </svg>
  );

  static Icon10 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_18_svg__h{fill:#fab700}.Recurso_18_svg__i{fill:#1b1464}'}</style>
      </defs>
      <g id="Recurso_18_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#d4bf00',
          }}
          id="Recurso_18_svg__c"
        />
        <g id="Recurso_18_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_18_svg__i"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <path
            className="Recurso_18_svg__h"
            d="M50.49 58.45 45.1 68.96c-.07.14-.11.29-.11.45v.68c0 .5.36.91.81.91.25 0 .49-.13.64-.35L55 58.1v-.09h-3.81c-.29 0-.55.17-.7.45Z"
          />
          <path className="Recurso_18_svg__h" d="m50.16 46-4.57 15h4.08l8.66-15h-8.17z" />
        </g>
      </g>
    </svg>
  );

  static Icon11 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_19_svg__i{fill:#1b1464}'}</style>
      </defs>
      <g id="Recurso_19_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#ea581c',
          }}
          id="Recurso_19_svg__c"
        />
        <g id="Recurso_19_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_19_svg__i"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <path
            d="M43 55h14c.55 0 1 .45 1 1v19c0 1.1-.9 2-2 2H44c-1.1 0-2-.9-2-2V56c0-.55.45-1 1-1Z"
            style={{
              fill: '#c4c4c4',
            }}
          />
          <path
            d="M54 48h-7c-1.1 0-2 .9-2 2v5h10v-6c0-.55-.45-1-1-1Zm-2 5h-4v-2h4v2Z"
            style={{
              fill: '#ea581c',
            }}
          />
        </g>
      </g>
    </svg>
  );

  static Icon12 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_20_svg__i{fill:#1b1464}'}</style>
      </defs>
      <g id="Recurso_20_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#324697',
          }}
          id="Recurso_20_svg__c"
        />
        <g id="Recurso_20_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_20_svg__i"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <path
            d="M56.92 66.74c-3.64 1.76-9.2-.56-12.57-5.31-3.21-4.51-3.31-9.63-.4-11.94l-4.58-6.09c-3.75 3.6-2.62 11.92 2.97 19.64C48.18 71.11 56.75 75.58 62 73.48l-5.08-6.75Z"
            style={{
              fill: '#324697',
            }}
          />
        </g>
      </g>
    </svg>
  );

  static Icon13 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>
          {
            '.Recurso_21_svg__f,.Recurso_21_svg__g{stroke:#28285b;stroke-miterlimit:10}.Recurso_21_svg__f{fill:#1caae2}.Recurso_21_svg__g{fill:none}.Recurso_21_svg__l{fill:#1b1464}'
          }
        </style>
      </defs>
      <g id="Recurso_21_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#1caae2',
          }}
          id="Recurso_21_svg__c"
        />
        <g id="Recurso_21_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_21_svg__l"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <circle
            cx={50}
            cy={56}
            r={13.5}
            style={{
              fill: '#1caae2',
            }}
          />
          <path
            d="M50 43c7.17 0 13 5.83 13 13s-5.83 13-13 13-13-5.83-13-13 5.83-13 13-13m0-1c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14-6.27-14-14-14Z"
            style={{
              fill: '#28285b',
            }}
          />
          <path
            className="Recurso_21_svg__f"
            d="M49.02 69.56c-1.32-1.67-4.01-5.56-4.61-11.17-.91-8.38 3.48-14.45 4.56-15.85M50.2 69.71c1.32-1.67 4.01-5.56 4.61-11.17.91-8.38-3.48-14.45-4.56-15.85"
          />
          <path className="Recurso_21_svg__g" d="M36.85 53.11h26.16M37.15 60.7h25.48" />
        </g>
      </g>
    </svg>
  );

  static Icon14 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>
          {'.Recurso_23_svg__e{fill:#dfa300}.Recurso_23_svg__g{fill:#ab0036}.Recurso_23_svg__i{fill:#1b1464}'}
        </style>
      </defs>
      <g id="Recurso_23_svg__b">
        <circle className="Recurso_23_svg__e" cx={50} cy={50} r={50} id="Recurso_23_svg__c" />
        <g id="Recurso_23_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_23_svg__i"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path className="Recurso_23_svg__g" d="M61 18h11v5H61z" />
          <path
            style={{
              fill: '#bf5c17',
            }}
            d="M54.5 45.5H57V53h-2.5z"
          />
          <path
            className="Recurso_23_svg__g"
            d="M49.38 43.83 35.69 56.67c-.6.57-.2 1.58.62 1.58H63.7c.83 0 1.23-1.01.62-1.58L50.63 43.83a.913.913 0 0 0-1.25 0Z"
          />
          <path className="Recurso_23_svg__e" d="m50 46.2-12.5 12h25L50 46.2zM37.5 58.2h25v17h-25z" />
          <path
            style={{
              fill: '#42210b',
            }}
            d="M47 64.2h6v11h-6z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon15 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_24_svg__g{fill:#00b0f0}.Recurso_24_svg__h{fill:#1b1464}'}</style>
      </defs>
      <g id="Recurso_24_svg__b">
        <circle className="Recurso_24_svg__g" cx={50} cy={50} r={50} id="Recurso_24_svg__c" />
        <g id="Recurso_24_svg__d">
          <path
            style={{
              fill: '#fff',
            }}
            d="M22.5 15h55v70h-55z"
          />
          <path
            className="Recurso_24_svg__h"
            d="M57 26v4H43v-4h14m.5-.5h-15v5h15v-5ZM72 26v4H58v-4h14m.5-.5h-15v5h15v-5ZM72 31v4H58v-4h14m.5-.5h-15v5h15v-5ZM57 31v4H43v-4h14m.5-.5h-15v5h15v-5ZM42 31v4H28v-4h14m.5-.5h-15v5h15v-5ZM42 26v4H28v-4h14m.5-.5h-15v5h15v-5Z"
          />
          <path
            style={{
              fill: '#ab0036',
            }}
            d="M61 18h11v5H61z"
          />
          <path
            className="Recurso_24_svg__g"
            d="M59.24 71.61c-2.11 5.1-7.96 7.52-13.06 5.41s-7.52-7.96-5.41-13.07l9.24-22.3 9.24 22.3c.97 2.36 1.06 5.11 0 7.66Z"
          />
        </g>
      </g>
    </svg>
  );

  static Icon16 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#d864a2',
        }}
      />
      <path
        d="M80 45c0 4.27-1.66 8.48-4.88 11.71l-1.66 1.71L50 81.88 26.54 58.42l-1.66-1.71c-6.49-6.45-6.49-16.97 0-23.42 3.22-3.27 7.49-4.88 11.71-4.88s8.48 1.61 11.76 4.88l1.66 1.66 1.66-1.66c6.49-6.49 17.02-6.49 23.46 0 3.22 3.22 4.88 7.44 4.88 11.71Z"
        style={{
          fill: '#fff',
        }}
      />
    </svg>
  );

  static Icon17 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <defs>
        <style>{'.Recurso_26_svg__h{fill:none;stroke:#e2de00;stroke-miterlimit:10}'}</style>
      </defs>
      <g id="Recurso_26_svg__b">
        <circle
          cx={50}
          cy={50}
          r={50}
          style={{
            fill: '#45b179',
          }}
          id="Recurso_26_svg__c"
        />
        <g id="Recurso_26_svg__d">
          <path
            d="M23.14 49.44h48.49v12.31c0 2.13-1.73 3.85-3.85 3.85H26.99c-2.13 0-3.85-1.73-3.85-3.85V49.44Z"
            style={{
              fill: '#2b3077',
            }}
          />
          <path
            style={{
              fill: '#2b4999',
            }}
            d="m89 46.21-40 10-40-10 40-10 40 10z"
          />
          <path className="Recurso_26_svg__h" d="m49 46.21 20.2 4.04M68.56 49.44V65.6" />
        </g>
      </g>
    </svg>
  );

  static Icon18 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#007dc9',
        }}
      />
      <circle
        cx={50}
        cy={50}
        r={32.5}
        style={{
          fill: '#54225d',
        }}
      />
      <circle
        cx={50}
        cy={50}
        r={15}
        style={{
          fill: '#ab0036',
        }}
      />
      <path d="m65.18 68.926 2.909-6.554 6.554 2.908-2.909 6.554zM69.536 62.989 85.91 25.935l3.658 1.617-16.373 37.053z" />
      <circle cx={50} cy={50} r={2.5} />
    </svg>
  );

  static Icon19 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#8e4a97',
        }}
      />
      <rect
        x={22.5}
        y={15}
        width={55}
        height={70}
        rx={5}
        ry={5}
        style={{
          fill: 'gray',
        }}
      />
      <rect
        x={27.5}
        y={20}
        width={45}
        height={55}
        rx={1}
        ry={1}
        style={{
          fill: '#fff',
        }}
      />
      <path d="M31 24h38v2H31zM31 28h12v2H31zM31 34h38v2H31zM31 38h18v2H31zM51 38h18v2H51zM31 42h38v2H31zM31 52h38v2H31zM31 56h32v2H31zM37 62h32v2H37zM65 56h4v2h-4zM31 62h4v2h-4zM31 68h38v2H31z" />
    </svg>
  );

  static Icon20 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_31_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_31_svg__cls-4{fill:#333}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#72b62b',
        }}
        id="Recurso_31_svg__Capa_1-2"
      />
      <g id="Recurso_31_svg__Capa_2-2">
        <rect
          x={22.5}
          y={22.5}
          width={55}
          height={55}
          rx={6}
          ry={6}
          style={{
            fill: '#4d4d4d',
          }}
        />
        <circle className="Recurso_31_svg__cls-4" cx={35} cy={35} r={7.5} />
        <circle className="Recurso_31_svg__cls-4" cx={50} cy={50} r={17.5} />
        <path
          d="M50 35h-.42c-.53.02-1.06.06-1.57.13l.13.99c.61-.08 1.24-.12 1.86-.12v-1Zm-3.95.53-.09.02h-.05v.02h-.06v.02h-.06v.02h-.06v.02h-.05l-.02.02c-.48.14-.95.31-1.4.5h-.02l-.02.02h-.02l-.02.02h-.03l.39.93c.57-.24 1.16-.45 1.76-.61l-.26-.96Zm-3.67 1.55-.06.04h-.02v.02h-.03v.02h-.02v.02h-.03v.02h-.03l-.02.02c-.25.16-.5.32-.75.49h-.02v.02h-.03v.02h-.03v.02h-.03v.02h-.02v.02h-.02v.02h-.03l-.02.03c-.17.12-.34.25-.5.38l.62.79c.49-.38 1.01-.74 1.54-1.05l-.51-.86Zm-3.13 2.47c-.17.18-.34.36-.5.54v.02h-.02v.02h-.02v.02h-.02v.02h-.02v.02h-.02v.02h-.01v.02h-.02v.02h-.01v.02h-.02v.02h-.01v.02h-.01v.02h-.02v.02h-.01v.02h-.01v.04h-.01v.02h-.02v.02h-.01v.02h-.02v.02h-.01l-.03.04s-.05.06-.08.1-.05.06-.08.1l-.02.02v.02h-.01v.02h-.01v.02h-.02v.02h-.01v.02h-.02v.02h-.02v.02h-.01v.02h-.01v.02h-.01v.04h-.01v.02h-.01v.02h-.01v.02h-.01v.03h-.01v.02h-.01l-.05.07.8.6c.37-.5.78-.98 1.21-1.42l-.72-.7Zm-2.38 3.2c-.17.3-.32.61-.47.92v.02l-.02.05v.1h-.01V43.95h-.01V44.06l-.02.05v.06l-.02.05-.02.04c-.04.09-.07.18-.11.27l.93.36c.22-.58.49-1.15.79-1.69l-.88-.48Zm-1.45 3.72c-.02.1-.05.19-.07.29V47.17l-.02.12v.07h-.01V48.42l.99.11c.06-.62.17-1.24.32-1.84l-.97-.23Zm.59 3.94-1 .03c.02.56.06 1.12.14 1.67v.3l.99-.15c-.1-.61-.16-1.24-.18-1.86Zm.6 3.67-.96.29V56.29l.91-.4c-.26-.56-.48-1.15-.66-1.74Zm1.55 3.38-.85.53c.09.14.18.28.27.41v.02h.01v.02h.02v.03h.01v.02h.01v.02h.02v.02h.01v.03h.01v.02h.02v.02h.01v.02h.01v.02h.01v.03h.02v.02h.01v.02h.01v.02h.02v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02H38v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.02h.01v.04h.02v.02h.01v.03h.01v.02h.01v.02h.01l.02.03.07.08.77-.64c-.4-.48-.77-.98-1.1-1.51Zm2.39 2.86-.68.74.28.25.02.02.02.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02v.02h.02l.02.03c.31.26.64.51.97.74l.57-.82c-.51-.35-1-.75-1.46-1.17Zm3.05 2.13-.46.89c.32.17.65.32.98.46h.02l.02.02h.03v.02h.04v.02h.04v.02h.04v.02h.04v.02h.04v.02h.04v.02h.04v.02h.04V64h.04v.02h.04v.02h.04v.02h.04v.02h.04l.02.02h.03v.02h.04l.02.02h.02l.02.02h.03v.02h.04l.34-.93c-.58-.21-1.16-.46-1.71-.74Zm3.51 1.25-.21.98c.35.07.71.14 1.07.18h.11v.02h.12c.23.04.45.06.68.08l.07-1c-.62-.05-1.24-.13-1.85-.26Zm5.57.05c-.61.12-1.23.19-1.85.23l.06 1h.23v-.02h.18l.02-.02h.16v-.02h.15v-.02h.14v-.02h.13v-.02h.12v-.02h.12v-.02h.11v-.02h.1v-.02h.1v-.02h.09v-.02h.09v-.02h.09v-.02h.08v-.02h.09l-.19-1Zm3.53-1.19c-.56.27-1.14.51-1.72.71l.32.95c.14-.05.29-.1.43-.15h.02l.02-.02h.03v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.04v-.02h.03l.02-.02h.03v-.02h.04v-.02h.04l.02-.02h.03v-.02h.04v-.02H56v-.02h.04v-.02h.04v-.02h.04v-.02h.03v-.02h.04v-.02h.03v-.02h.04v-.02h.03v-.02h.04l.02-.02h.02l.02-.02h.02c.07-.04.13-.07.2-.11l-.44-.9Zm3.09-2.08c-.46.41-.96.8-1.48 1.14l.56.83c.1-.07.2-.13.29-.2h.02l.02-.03h.02v-.02h.03l.02-.03h.02v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.02v-.02h.02v-.02h.03v-.02h.03v-.02h.03v-.02h.03v-.02h.02l.02-.02h.02l.02-.03h.02v-.02h.03l.02-.03h.02v-.02h.03l.02-.03h.02l.02-.03s.06-.06.1-.09c.15-.12.29-.25.44-.37l-.66-.75Zm2.44-2.82c-.34.52-.72 1.02-1.12 1.49l.76.65v-.02h.02v-.02h.02v-.02h.02v-.02h.01v-.02h.02v-.04h.01l.02-.02.29-.35.02-.02v-.02h.01v-.02h.02v-.02h.02v-.02h.01v-.02h.01v-.02h.01v-.02h.01v-.02h.01v-.04h.01v-.02h.01v-.02h.01V59h.02v-.02h.01v-.03h.01v-.02h.01v-.02H62c.19-.25.36-.5.53-.76l-.84-.55Zm1.61-3.36c-.19.59-.42 1.17-.69 1.73l.9.43v-.13h.01v-.13c.23-.51.44-1.04.61-1.59l-.95-.31Zm.66-3.66c-.03.62-.1 1.25-.21 1.85l.98.18c.06-.36.12-.72.16-1.09V50.78l-1-.05Zm.66-3.93-.98.22c.13.6.23 1.22.28 1.84l1-.09c0-.1-.02-.19-.03-.29v-.29c-.06-.47-.14-.93-.24-1.39Zm-1.38-3.74-.88.47c.29.55.55 1.12.76 1.7l.94-.35c-.02-.06-.05-.13-.07-.19v-.06h-.01V43.86h-.01v-.15h-.01V43.6H64v-.13l-.24-.48Zm-2.32-3.24-.73.68c.42.45.82.94 1.18 1.44l.81-.58c-.3-.42-.62-.82-.96-1.21v-.02h-.02v-.03h-.02v-.02h-.01v-.02h-.02v-.02h-.02v-.03h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02H61v-.02h-.02v-.02h-.02v-.02h-.03Zm-3.09-2.54-.52.85c.53.32 1.04.69 1.52 1.08l.63-.77h-.01v-.02h-.03l-.02-.03h-.02l-.02-.03-.02-.02h-.02l-.02-.03h-.02v-.02h-.03l-.02-.03h-.02v-.02h-.03l-.02-.03h-.02l-.02-.03h-.02v-.02h-.02v-.02h-.02v-.02h-.03v-.02h-.03v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.03v-.02h-.03v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.03v-.02h-.03v-.02h-.03l-.02-.03h-.02v-.02h-.03v-.02h-.02l-.02-.02h-.02v-.02h-.03v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.02v-.02h-.03v-.02h-.03v-.02h-.03v-.02h-.03v-.02h-.03v-.02h-.02l-.02-.02h-.02c-.06-.05-.13-.09-.19-.13Zm-3.65-1.62-.28.96c.59.17 1.18.39 1.75.64l.41-.91c-.4-.18-.8-.34-1.22-.48h-.04v-.02h-.04v-.02h-.05v-.02h-.05v-.02h-.03c-.15-.06-.3-.1-.44-.14Zm-3.94-.59-.02 1c.62.01 1.25.06 1.86.15l.15-.99c-.1-.01-.2-.03-.29-.04h-.12v-.02h-.13v-.02h-.14v-.02h-.15v-.02h-.18V35h-.2l-.02-.02H51c-.23-.02-.47-.03-.7-.03Z"
          style={{
            fill: '#fbb03b',
          }}
        />
        <circle
          cx={35}
          cy={35}
          r={4}
          style={{
            fill: '#ab0036',
          }}
        />
        <ellipse cx={50} cy={49} rx={10} ry={8} />
      </g>
    </svg>
  );

  static Icon21 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#3d57a3',
        }}
      />
      <path
        d="M10.5 38.56v22.88c0 1.41.92 2.56 2.06 2.56h25.3c.55 0 1.07-.27 1.46-.75l9.22-11.44c.81-1 2.11-1 2.92 0l9.22 11.44c.39.48.91.75 1.46.75h25.3c1.14 0 2.06-1.15 2.06-2.56V38.56c0-1.41-.92-2.56-2.06-2.56H12.56c-1.14 0-2.06 1.15-2.06 2.56Z"
        style={{
          fill: '#e2b88c',
        }}
      />
      <path
        d="M38.06 43H16.79c-.98 0-1.78.99-1.78 2.21v9.58c0 1.22.8 2.21 1.78 2.21H34.5c.54 0 1.05-.3 1.39-.83l3.56-5.52c.25-.39.39-.88.39-1.38v-4.06c0-1.22-.8-2.21-1.78-2.21Z"
        style={{
          fill: '#6bc6dd',
        }}
      />
      <path
        d="M61.94 43h21.27c.98 0 1.78.99 1.78 2.21v9.58c0 1.22-.8 2.21-1.78 2.21H65.5c-.54 0-1.05-.3-1.39-.83l-3.56-5.52c-.25-.39-.39-.88-.39-1.38v-4.06c0-1.22.8-2.21 1.78-2.21Z"
        style={{
          fill: '#e7265b',
        }}
      />
    </svg>
  );

  static Icon22 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_33_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_33_svg__cls-2{fill:#e9feff}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#373d91',
        }}
        id="Recurso_33_svg__Capa_1-2"
      />
      <g id="Recurso_33_svg__Capa_2-2">
        <path className="Recurso_33_svg__cls-2" d="m50 50.5 27.5-25h-55l27.5 25z" />
        <path className="Recurso_33_svg__cls-2" d="M48.5 48h3v34h-3z" />
        <path className="Recurso_33_svg__cls-2" d="M50 77.62 30 82h40l-20-4.38z" />
        <path
          style={{
            fill: '#904c98',
          }}
          d="m50 47 22.5-20h-45L50 47z"
        />
      </g>
    </svg>
  );

  static Icon23 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#1e8035',
        }}
      />
      <path
        d="M50 19c7.73 0 14 6.27 14 14v17H36V33c0-7.73 6.27-14 14-14Z"
        style={{
          fill: '#d32887',
        }}
      />
      <path
        d="M50 50c7.34 0 13.3 5.96 13.3 13.3V81H36.7V63.3C36.7 55.96 42.66 50 50 50Z"
        transform="rotate(180 50 65.5)"
        style={{
          fill: '#24378d',
        }}
      />
    </svg>
  );

  static Icon24 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_35_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_35_svg__cls-1{fill:#848484}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#8dbf35',
        }}
        id="Recurso_35_svg__Capa_1-2"
      />
      <g id="Recurso_35_svg__Capa_2-2">
        <path className="Recurso_35_svg__cls-1" d="M69.67 65.03h-40L23 33.92h53.33l-6.66 31.11z" />
        <path
          style={{
            fill: '#0d2a00',
          }}
          d="M80.17 33.73h.05l-7.64 33.71H26.76v-.02h-2.65l.56 2.61h50L83 31.14h-2.25l-.58 2.59z"
        />
        <circle
          cx={31.89}
          cy={73.92}
          r={4.44}
          style={{
            fill: '#ab0036',
          }}
        />
        <circle
          cx={67.44}
          cy={73.92}
          r={4.44}
          style={{
            fill: '#ab1739',
          }}
        />
        <circle className="Recurso_35_svg__cls-1" cx={31.89} cy={73.92} r={2.22} />
        <circle className="Recurso_35_svg__cls-1" cx={67.44} cy={73.92} r={2.22} />
      </g>
    </svg>
  );

  static Icon25 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_36_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>
          {
            '.Recurso_36_svg__cls-1{fill:#4594d1}.Recurso_36_svg__cls-2{fill:#3053a1}.Recurso_36_svg__cls-3{fill:#74d2ff}.Recurso_36_svg__cls-4{fill:#e9e341}.Recurso_36_svg__cls-6{fill:#283376}'
          }
        </style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#e9e200',
        }}
        id="Recurso_36_svg__Capa_1-2"
      />
      <g id="Recurso_36_svg__Capa_2-2">
        <rect className="Recurso_36_svg__cls-6" x={27.5} y={23} width={45} height={54} rx={2.69} ry={2.69} />
        <path className="Recurso_36_svg__cls-2" d="M27.5 57.5h45v5h-45zM27.5 37.5h45v5h-45z" />
        <path className="Recurso_36_svg__cls-1" d="M37 23h6v54h-6zM57 23h6v54h-6z" />
        <path className="Recurso_36_svg__cls-2" d="M27.5 27.5h45v5h-45zM27.5 47.5h45v5h-45zM27.5 67.5h45v5h-45z" />
        <path
          className="Recurso_36_svg__cls-3"
          d="M45.85 22h6.34c.73 0 1.13.84.67 1.41L49.93 27l-3.41 4.18a.87.87 0 0 1-1.34 0L41.77 27l-2.93-3.59c-.46-.56-.06-1.41.67-1.41h6.34Z"
        />
        <path
          className="Recurso_36_svg__cls-3"
          d="M53.85 22h6.34c.72 0 1.12.84.67 1.4L57.93 27l-3.41 4.18a.86.86 0 0 1-1.33 0L49.78 27l-2.93-3.6c-.46-.56-.06-1.4.67-1.4h6.34Z"
        />
        <path className="Recurso_36_svg__cls-6" d="M50 22h8.15l-4.07 3L50 28l-4.08-3-4.07-3H50z" />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={37} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={43} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={49} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={55} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={61} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={67} r={1} />
        <circle className="Recurso_36_svg__cls-4" cx={49} cy={73} r={1} />
      </g>
    </svg>
  );

  static Icon26 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_37_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_37_svg__cls-2{fill:#c9b500}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#ffb60a',
        }}
        id="Recurso_37_svg__Capa_1-2"
      />
      <g id="Recurso_37_svg__Capa_2-2">
        <path
          d="M77.5 43.49c0 12.25-7.21 22.7-17.41 26.94-1.76.73-2.85 2.5-2.85 4.41v4.35c0 2.67-2.16 4.83-4.83 4.83h-4.82c-2.67 0-4.83-2.16-4.83-4.83v-4.35c0-1.9-1.1-3.68-2.85-4.41C29.71 66.2 22.5 55.74 22.5 43.49c0-15.99 12.32-28.95 27.5-28.95s27.5 12.95 27.5 28.95Z"
          style={{
            fill: '#fff355',
          }}
        />
        <path className="Recurso_37_svg__cls-2" d="M45.66 43.49h2.89v40.53h-2.89zM51.45 43.49h2.89v40.53h-2.89z" />
        <path
          style={{
            fill: '#c4c4c4',
          }}
          d="M56.07 85.46H43.93l-1.89-8.68h15.92l-1.89 8.68z"
        />
      </g>
    </svg>
  );

  static Icon27 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_38_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_38_svg__cls-2{fill:#27ade4}.Recurso_38_svg__cls-4{fill:#c4c4c4}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#634092',
        }}
        id="Recurso_38_svg__Capa_1-2"
      />
      <g id="Recurso_38_svg__Capa_2-2">
        <path
          d="M79 54v6H21v-7c0-.55.45-1 1-1h1.5l1.23-9.81A2.496 2.496 0 0 1 27.21 40h32.54c.79 0 1.53.37 2 1L70 52h7c1.1 0 2 .9 2 2Z"
          style={{
            fill: '#f15a24',
          }}
        />
        <path className="Recurso_38_svg__cls-4" d="M20.5 57h6v2h-6c-.55 0-1-.45-1-1s.45-1 1-1Z" />
        <path
          className="Recurso_38_svg__cls-4"
          d="M74.5 57h6v2h-6c-.55 0-1-.45-1-1s.45-1 1-1Z"
          transform="rotate(-180 77 58)"
        />
        <circle cx={33} cy={61} r={5} />
        <circle className="Recurso_38_svg__cls-4" cx={33} cy={61} r={2} />
        <circle cx={67} cy={61} r={5} />
        <circle className="Recurso_38_svg__cls-4" cx={67} cy={61} r={2} />
        <path
          className="Recurso_38_svg__cls-2"
          d="M41.22 52H26.87c-.46 0-.83-.4-.78-.86l.84-8.43c.04-.4.38-.71.78-.71h13.51c.43 0 .78.35.78.78v8.43c0 .43-.35.78-.78.78ZM65.72 52H44.67a.67.67 0 0 1-.67-.67v-8.67c0-.37.3-.67.67-.67h14.99c.22 0 .42.11.55.28l6.07 8.67c.31.44 0 1.05-.55 1.05Z"
        />
      </g>
    </svg>
  );

  static Icon28 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_39_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>
          {
            '.Recurso_39_svg__cls-3{fill:#2c4b9b}.Recurso_39_svg__cls-4{fill:#94d9ff}.Recurso_39_svg__cls-5{fill:#c4c4c4}'
          }
        </style>
      </defs>
      <circle className="Recurso_39_svg__cls-3" cx={50} cy={50} r={50} id="Recurso_39_svg__Capa_1-2" />
      <g id="Recurso_39_svg__Capa_2-2">
        <path className="Recurso_39_svg__cls-5" d="M35 22h30v60H35z" />
        <path
          style={{
            fill: '#ab0036',
          }}
          d="M36 50h14v32H36z"
        />
        <path
          style={{
            fill: '#00942e',
          }}
          d="M50 50h14v32H50z"
        />
        <path d="M36 38h28v12H36z" />
        <path className="Recurso_39_svg__cls-4" d="M38 42h10v4H38zM52 42h10v4H52z" />
        <path className="Recurso_39_svg__cls-5" d="M34.5 81.5h31v1h-31z" />
        <path className="Recurso_39_svg__cls-3" d="M36 24h28v12H36z" />
      </g>
    </svg>
  );

  static Icon29 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#d4d91e',
        }}
      />
      <path
        style={{
          fill: '#c4c4c4',
        }}
        d="M48 52h4v48h-4z"
      />
      <path
        d="M60 36v14c0 5.52-4.48 10-10 10s-10-4.48-10-10V36c0-5.52 4.48-10 10-10s10 4.48 10 10Z"
        style={{
          fill: '#4ba2da',
        }}
      />
      <path
        d="M57.22 34c-.88-3.17-3.77-5.5-7.22-5.5s-6.35 2.33-7.22 5.5h14.44Z"
        style={{
          fill: '#aaf4ff',
        }}
      />
      <circle
        cx={54}
        cy={46}
        r={2}
        style={{
          fill: '#ab0036',
        }}
      />
    </svg>
  );

  static Icon30 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_41_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_41_svg__cls-2{fill:#c4c4c4}.Recurso_41_svg__cls-3{fill:#5ab679}'}</style>
      </defs>
      <circle className="Recurso_41_svg__cls-3" cx={50} cy={50} r={50} id="Recurso_41_svg__Capa_1-2" />
      <g id="Recurso_41_svg__Capa_2-2">
        <path className="Recurso_41_svg__cls-2" transform="rotate(43.78 48.616 49.451)" d="M45.62 25.94h6v47h-6z" />
        <circle className="Recurso_41_svg__cls-2" cx={67.14} cy={29.8} r={7} />
        <path
          className="Recurso_41_svg__cls-3"
          d="M67.11 26.22h6v5c0 1.66-1.34 3-3 3s-3-1.34-3-3v-5Z"
          transform="rotate(97.94 70.115 30.219)"
        />
        <circle className="Recurso_41_svg__cls-2" cx={32.81} cy={66.15} r={7} />
        <path
          className="Recurso_41_svg__cls-3"
          d="M26.81 61.95h6v5c0 1.66-1.34 3-3 3s-3-1.34-3-3v-5Z"
          transform="rotate(-86.28 29.808 65.953)"
        />
        <path
          transform="rotate(43.78 48.616 49.451)"
          style={{
            fill: '#848484',
          }}
          d="M48.12 33.44h1v32h-1z"
        />
      </g>
    </svg>
  );

  static Icon31 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_42_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>
          {'.Recurso_42_svg__cls-1{fill:#fff}.Recurso_42_svg__cls-3{fill:#27ade4}.Recurso_42_svg__cls-5{fill:#c4c4c4}'}
        </style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#e7225a',
        }}
        id="Recurso_42_svg__Capa_1-2"
      />
      <g id="Recurso_42_svg__Capa_2-2">
        <path
          d="M79 51v6H21v-7c0-.55.45-1 1-1h1.5l1.23-9.81A2.496 2.496 0 0 1 27.21 37h32.54c.79 0 1.53.37 2 1L70 49h7c1.1 0 2 .9 2 2Z"
          style={{
            fill: '#e8e100',
          }}
        />
        <path className="Recurso_42_svg__cls-5" d="M20.5 54h6v2h-6c-.55 0-1-.45-1-1s.45-1 1-1Z" />
        <path
          className="Recurso_42_svg__cls-5"
          d="M74.5 54h6v2h-6c-.55 0-1-.45-1-1s.45-1 1-1Z"
          transform="rotate(-180 77 55)"
        />
        <path
          className="Recurso_42_svg__cls-3"
          d="M41.22 49H26.87c-.46 0-.83-.4-.78-.86l.84-8.43c.04-.4.38-.71.78-.71h13.51c.43 0 .78.35.78.78v8.43c0 .43-.35.78-.78.78ZM65.72 49H44.67a.67.67 0 0 1-.67-.67v-8.67c0-.37.3-.67.67-.67h14.99c.22 0 .42.11.55.28l6.07 8.67c.31.44 0 1.05-.55 1.05Z"
        />
        <path
          className="Recurso_42_svg__cls-1"
          d="M39 53h2v2h-2zM35 53h2v2h-2zM31 53h2v2h-2zM41 55h2v2h-2zM37 55h2v2h-2zM45 55h2v2h-2zM49 55h2v2h-2zM53 55h2v2h-2zM57 55h2v2h-2zM61 55h2v2h-2zM43 53h2v2h-2zM47 53h2v2h-2zM51 53h2v2h-2zM55 53h2v2h-2zM59 53h2v2h-2zM63 53h2v2h-2zM67 53h2v2h-2z"
        />
        <circle cx={67} cy={58} r={5} />
        <circle className="Recurso_42_svg__cls-5" cx={67} cy={58} r={2} />
        <circle cx={33} cy={58} r={5} />
        <circle className="Recurso_42_svg__cls-5" cx={33} cy={58} r={2} />
      </g>
    </svg>
  );

  static Icon32 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_38_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_38_svg__cls-1{fill:#fff}.Recurso_38_svg__cls-3{fill:#f2f2f2}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#28285b',
        }}
        id="Recurso_38_svg__Capa_1-2"
      />
      <g id="Recurso_38_svg__Capa_2-2">
        <path
          className="Recurso_38_svg__cls-3"
          d="M21 64h-2.01c-.57 0-1.05-.42-1.12-.99l-.72-5.74c-.08-.67.44-1.27 1.12-1.27h3.44c.68 0 1.2.59 1.12 1.27l-.72 5.74c-.07.56-.55.99-1.12.99ZM39 64h-2.01c-.57 0-1.05-.42-1.12-.99l-.72-5.74c-.08-.67.44-1.27 1.12-1.27h3.44c.68 0 1.2.59 1.12 1.27l-.72 5.74c-.07.56-.55.99-1.12.99ZM63 64h-2.01c-.57 0-1.05-.42-1.12-.99l-.72-5.74c-.08-.67.44-1.27 1.12-1.27h3.44c.68 0 1.2.59 1.12 1.27l-.72 5.74c-.07.56-.55.99-1.12.99ZM81 64h-2.01c-.57 0-1.05-.42-1.12-.99l-.72-5.74c-.08-.67.44-1.27 1.12-1.27h3.44c.68 0 1.2.59 1.12 1.27l-.72 5.74c-.07.56-.55.99-1.12.99Z"
        />
        <path className="Recurso_38_svg__cls-1" d="M50 32 6.7 58h86.6L50 32zM50 68l-9.15 10h18.3L50 68z" />
        <rect className="Recurso_38_svg__cls-3" x={46.5} y={18} width={7} height={60} rx={3.5} ry={3.5} />
      </g>
    </svg>
  );

  static Icon33 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#a7b51a',
        }}
      />
      <path
        d="M30 45a9 9 0 0 1 9 9v17H21V54a9 9 0 0 1 9-9Z"
        style={{
          fill: '#b42518',
        }}
      />
      <path
        d="M70 57c2.48 0 4.5 2.02 4.5 4.5V70h-9v-8.5c0-2.48 2.02-4.5 4.5-4.5Z"
        style={{
          fill: '#5d4394',
        }}
      />
      <path
        style={{
          fill: '#343d91',
        }}
        d="m50 71 9-26H41l9 26z"
      />
      <ellipse
        cx={30}
        cy={36}
        rx={7}
        ry={8}
        style={{
          fill: '#9f6200',
        }}
      />
      <ellipse
        cx={50}
        cy={36}
        rx={7}
        ry={8}
        style={{
          fill: '#ffda9f',
        }}
      />
      <ellipse
        cx={69.91}
        cy={52}
        rx={4.09}
        ry={4}
        style={{
          fill: '#ffa63f',
        }}
      />
    </svg>
  );

  static Icon34 = (props: SVGProps<SVGSVGElement>) => (
    <svg
      id="Recurso_40_svg__Capa_2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      {...props}
    >
      <defs>
        <style>{'.Recurso_40_svg__cls-1{fill:#ff6}'}</style>
      </defs>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#574998',
        }}
        id="Recurso_40_svg__Capa_1-2"
      />
      <g id="Recurso_40_svg__Capa_2-2">
        <circle className="Recurso_40_svg__cls-1" cx={50} cy={50} r={28.5} />
        <path
          d="M50 23c14.89 0 27 12.11 27 27S64.89 77 50 77 23 64.89 23 50s12.11-27 27-27m0-3c-16.57 0-30 13.43-30 30s13.43 30 30 30 30-13.43 30-30-13.43-30-30-30Z"
          style={{
            fill: '#fc0',
          }}
        />
        <path className="Recurso_40_svg__cls-1" d="M48 20.07C32.36 21.1 20 34.1 20 50s12.36 28.9 28 29.93V20.07Z" />
        <text
          transform="translate(37.18 67.75)"
          style={{
            fontFamily: "MyriadPro-Regular,'Myriad Pro'",
            fontSize: 50,
            stroke: '#dfbc00',
            strokeMiterlimit: 10,
            fill: '#fc0',
          }}
        >
          <tspan x={0} y={0}>
            {'$'}
          </tspan>
        </text>
      </g>
    </svg>
  );

  static Icon35 = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#b49ecc',
        }}
      />
      <path
        d="M82 61c0 16-14.33 29-32 29S18 77 18 61c0-11.3 11.74-29.33 22.6-37.16.53-.38.62-1.14.17-1.61l-9.89-10.42c-.65-.68-.16-1.81.78-1.81h2c.33 0 .65.15.84.42.68.94 1.99 1.58 3.51 1.58s2.83-.64 3.51-1.58c.19-.27.51-.42.84-.42h3.3c.33 0 .65.15.84.42.68.94 1.99 1.58 3.51 1.58s2.83-.64 3.51-1.58c.19-.27.51-.42.84-.42h5.3c.33 0 .65.15.84.42.68.94 1.99 1.58 3.51 1.58s2.83-.64 3.51-1.58c.19-.27.51-.42.84-.42.94 0 1.42 1.12.78 1.81l-9.79 10.32c-.45.48-.36 1.23.17 1.61C71.03 32.04 82.01 52 82.01 61Z"
        style={{
          fill: '#dab081',
        }}
      />
      <path
        d="M40.38 24h19.47c-.12-.09-.23-.18-.35-.26-.53-.38-.62-1.14-.17-1.61l.12-.12H40.54l.21.23c.45.48.37 1.23-.17 1.61-.07.05-.14.11-.21.16Z"
        style={{
          fill: '#8a603b',
        }}
      />
      <text
        transform="translate(37.18 72.75)"
        style={{
          fill: '#00ab36',
          fontFamily: "MyriadPro-Regular,'Myriad Pro'",
          fontSize: 50,
          stroke: '#006837',
          strokeMiterlimit: 10,
        }}
      >
        <tspan x={0} y={0}>
          {'$'}
        </tspan>
      </text>
    </svg>
  );
}
