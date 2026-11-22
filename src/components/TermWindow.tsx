// ターミナルのウィンドウ風の枠。タイトルバー（色の付いた 3 つのドットとタイトル）と本文からなる。
// React の画面と、Astro の静的なページ（404 など）の両方で使う。
import type { HTMLAttributes, ReactNode, Ref } from "react";

type Props = {
  /** タイトルバーに出す文字。例: "~/tecupid" */
  title: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

export default function TermWindow({ title, children, className, ref, ...rest }: Props) {
  return (
    <div ref={ref} className={className ? `term ${className}` : "term"} {...rest}>
      <div className="term-titlebar" aria-hidden="true">
        <span className="term-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">{title}</span>
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}
