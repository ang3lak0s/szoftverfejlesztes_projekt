import { useEffect, useState } from "react";

export default function FullBandList() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/bands")
      .then((res) => res.json())
      .then(setBands)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Bandák – összes adat</h2>

      <table border="1" cellPadding="6" style={{ marginTop: "12px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Műfaj</th>
            <th>Telefon</th>
            <th>Email</th>
            <th>Óradíj</th>
            <th>Elfogad %-os fizetést</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b) => (
            <tr key={b.bandId}>
              <td>{b.bandId}</td>
              <td>{b.bandName}</td>
              <td>{b.playedGenre}</td>
              <td>{b.phoneNum}</td>
              <td>{b.email}</td>
              <td>{b.pricePerHour}</td>
              <td>{b.acceptsPercentage ? "Igen" : "Nem"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
