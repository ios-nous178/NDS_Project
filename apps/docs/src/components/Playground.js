import React, { useState } from "react";
import styles from "./Playground.module.css";

/**
 * 인터랙티브 Playground — props를 토글/선택하면서 컴포넌트를 실시간으로 확인.
 *
 * controls: [
 *   { name: "variant", type: "select", options: ["solid", "outlined"], default: "solid" },
 *   { name: "size", type: "select", options: ["lg", "md", "sm"], default: "lg" },
 *   { name: "disabled", type: "boolean", default: false },
 *   { name: "label", type: "text", default: "Button" },
 * ]
 */
export default function Playground({ controls = [], render, title = "Playground" }) {
  const initial = {};
  for (const c of controls) {
    initial[c.name] =
      c.default ?? (c.type === "boolean" ? false : c.type === "text" ? "" : c.options?.[0]);
  }
  const [values, setValues] = useState(initial);

  const update = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>&#9881;</span>
        {title}
      </div>
      <div className={styles.body}>
        <div className={styles.preview}>{render(values)}</div>
        <div className={styles.controls}>
          {controls.map((control) => (
            <div key={control.name} className={styles.control}>
              <label className={styles.label}>{control.name}</label>
              {control.type === "select" && (
                <div className={styles.selectGroup}>
                  {control.options.map((opt) => (
                    <button
                      key={opt}
                      className={`${styles.selectBtn} ${values[control.name] === opt ? styles.selectBtnActive : ""}`}
                      onClick={() => update(control.name, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {control.type === "boolean" && (
                <button
                  className={`${styles.toggle} ${values[control.name] ? styles.toggleOn : ""}`}
                  onClick={() => update(control.name, !values[control.name])}
                >
                  <span className={styles.toggleThumb} />
                </button>
              )}
              {control.type === "text" && (
                <input
                  type="text"
                  className={styles.textInput}
                  value={values[control.name]}
                  onChange={(e) => update(control.name, e.target.value)}
                  placeholder={control.placeholder ?? control.name}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.codeBar}>
        <code className={styles.codeOutput}>{generateCode(controls, values, render)}</code>
      </div>
    </div>
  );
}

function generateCode(controls, values, render) {
  // 컴포넌트 이름을 render 결과의 type에서 추출
  const el = render(values);
  const name = el?.type?.displayName || el?.type?.name || el?.type || "Component";

  const props = controls
    .filter((c) => {
      if (c.type === "boolean") return values[c.name];
      return values[c.name] !== c.default;
    })
    .map((c) => {
      if (c.type === "boolean") return c.name;
      return `${c.name}="${values[c.name]}"`;
    })
    .join(" ");

  const label = controls.find((c) => c.name === "label" || c.name === "children");
  const content = label ? values[label.name] || label.default : "";

  if (content) {
    return `<${name}${props ? " " + props : ""}>${content}</${name}>`;
  }
  return `<${name}${props ? " " + props : ""} />`;
}
