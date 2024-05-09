import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 30 },
];

const Demo = () => {
  const [selectedData, setSelectedData] = useState(data);

  const handleDataChange = (event) => {
    const newData = data.filter((item) => item.name === event.target.value);
    setSelectedData(newData);
  };

  return (
    <div>
      <select onChange={handleDataChange}>
        <option value="all">Tất cả</option>
        {data.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <LineChart width={600} height={300} data={selectedData}>
        <Line type="monotone" dataKey="value" stroke="#007bff" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  );
};

export default Demo;
