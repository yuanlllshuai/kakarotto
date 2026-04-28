import { useState } from "react";

const Label = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};
export const Component = () => {
  const [id, setId] = useState(1);
  return (
    <>
      <button onClick={() => setId(1)}>1</button>
      <button onClick={() => setId(2)}>2</button>
      <button onClick={() => setId(3)}>3</button>
      <Label key={id} />
    </>
  );
};
