import { Form, InputGroup, Button } from "react-bootstrap";
import { useState } from "react";

export default function SearchBar({ publishYear, search, page, submitSearch }) {
  const [innerSearch, setInnerSearch] = useState(search);
  const [innerYear, setInnerYear] = useState(publishYear);
  const [innerPage, setInnerPage] = useState(page);

  const submitHandle = () => {
    setInnerPage(1);
    submitSearch([innerSearch, innerYear]);
  };

  const increasePageHandle = () => {
    setInnerPage(innerPage + 1);
    submitSearch([innerSearch, innerYear, innerPage]);
  };
  return (
    <div style={{ margin: "10px 0" }}>
      <InputGroup size="lg" className="input-form">
        <InputGroup.Text id="inputGroup-sizing-lg">Search: </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="e.g: Titanic"
          value={innerSearch}
          className="form-field"
          onChange={(e) => setInnerSearch(e.target.value)}
        />
        <InputGroup.Text id="inputGroup-sizing-lg">Year: </InputGroup.Text>
        <Form.Control
          type="number"
          placeholder="e.g: 2000"
          value={innerYear}
          className="form-field"
          onChange={(e) => setInnerYear(e.target.value)}
          // onChange={(e) =>
          //   setPublishYear((old) => ({ ...old, publishYear: e.target.value }))
          // }
        />

        <Button className="button" onClick={submitHandle}>
          Submit
        </Button>
      </InputGroup>
      <div>
        <InputGroup.Text id="inputGroup-sizing-lg">
          More Movies?
        </InputGroup.Text>

        <Button className="button more-btn" onClick={increasePageHandle}>
          Show More
        </Button>
      </div>
      {/* <InputGroup size="lg" className="input-form">
        <InputGroup.Text id="inputGroup-sizing-lg">
          Released Year
        </InputGroup.Text>
        <Form.Control
          type="number"
          placeholder="2000"
          value={publishYear}
          className="form-field"
          onChange={(e) =>
            setPublishYear((old) => ({ ...old, publishYear: e.target.value }))
          }
        />
      </InputGroup> */}
    </div>
  );
}
