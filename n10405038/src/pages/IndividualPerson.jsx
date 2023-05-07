import { useSearchParams } from "react-router-dom";
import { useIndividualPerson } from "../utils";
import IndividualPersonTable from "../components/IndividualPersonTable";
import IndividualPersonChart from "../components/IndividualPersonChart";
import { useNavigate } from "react-router-dom";

export default function IndividualPerson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const key = searchParams.get("key");
  const { data: work } = useIndividualPerson(key ?? "") ?? {};

  return (
    <div>
      {work ? (
        <>
          <h1>{work.name}</h1>
          <h3>
            {work.birthYear} - {work.deathYear}
          </h3>
          <IndividualPersonTable data={work} />
          <IndividualPersonChart data={work} />
        </>
      ) : (
        title && <h1>{title}</h1>
      )}
    </div>
  );
}
