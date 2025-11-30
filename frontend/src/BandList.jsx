import { useEffect, useState } from "react";

export default function BandList() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/bands")
      .then((res) => res.json())
      .then(setBands)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Bandák listája</h2>
      <table border="1" cellPadding="6" style={{ marginTop: "12px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Műfaj</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b) => (
            <tr key={b.bandId}>
              <td>{b.bandId}</td>
              <td>{b.bandName}</td>
              <td>{b.playedGenre}</td>
              <td>{b.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
