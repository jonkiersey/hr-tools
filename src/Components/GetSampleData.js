import { sampleData } from "../utils/sampleData";

const GetSampleData = ({ setData }) => {
  const setSampleData = () => {
    setData(sampleData);
  };

  return (
    <div
      style={{
        border: "1px solid orange",
        margin: 16,
        padding: 8,
        maxWidth: 300,
        justifySelf: "center",
      }}
    >
      <p>
        Added this button to make sample data available because this tool isn't
        very intuitive without knowing what it expects.
      </p>
      <button onClick={setSampleData}>Get Sample Data</button>
      <p>
        The purpose of this tool was to speed up the process of taking employee
        sentiments collected through interviews and collate them into like ideas
      </p>
    </div>
  );
};

export default GetSampleData;
