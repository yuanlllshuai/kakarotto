import { useState, memo, useEffect } from "react";

const useName = () => {
  const [name, setName] = useState("");
  console.log(11);
  return { name, setName };
};

const Label = () => {
  const { name, setName } = useName();

  useEffect(() => {
    setName("李四");
  }, []);
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};
export const Component = () => {
  const [id, setId] = useState(1);
  const [name, setName] = useState("张三");
  return (
    <>
      <button onClick={() => setId(1)}>1</button>
      <button onClick={() => setId(2)}>2</button>
      <button onClick={() => setId(3)}>3</button>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label key={id} />
    </>
  );
};
