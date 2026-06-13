export function Form() {
  return (
    <div>
      <input type="text" placeholder="이름" value={name} onChange={onName} />
      <input type="email" disabled />
      <input type="checkbox" checked={agree} />
      <input type="file" />
      <input type="text" size={20} />
    </div>
  );
}
