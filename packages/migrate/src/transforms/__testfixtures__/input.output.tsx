import { Input } from "@nudge-design/react";
export function Form() {
  return (
    <div>
      <Input type="text" placeholder="이름" value={name} onChange={onName} />
      <Input type="email" disabled />
      <input type="checkbox" checked={agree} />
      <input type="file" />
      <input type="text" size={20} />
    </div>
  );
}
