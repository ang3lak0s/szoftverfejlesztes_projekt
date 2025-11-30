import { useEffect, useState } from "react";

export default function LocationList() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Helyszínek listája</h2>
      <table border="1" cellPadding="6" style={{ marginTop: "12px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Cím</th>
            <th>Email</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((l) => (
            <tr key={l.locationId}>
              <td>{l.locationId}</td>
              <td>{l.locationName}</td>
              <td>{l.address}</td>
              <td>{l.email}</td>
              <td>{l.phoneNum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
