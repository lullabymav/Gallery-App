import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("desc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams()
  //const [refresh, setRefresh] = useState(false)

  const fetchData = async () => {
		try {
			const response = await fetch("https://gallery-app-server.vercel.app/photos");
			const data = await response.json();
			setPhotos(data);
		} catch (err) {
			setError(err);
		}
		setLoading(false);
	};

  // const sortData = async () => {
	// 	try {
	// 		const response = await fetch(
	// 			`https://gallery-app-server.vercel.app/photos?_sort=id&_order=desc&q=test`
	// 		);
	// 		const data = await response.json();
	// 		setPhotos(data);
	// 	} catch (err) {
	// 		setError(err);
	// 	}
	// 	setLoading(false);
	// };

    const deletePhoto = async (id) => {
      await fetch(`https://gallery-app-server.vercel.app/photos/${id}`, {
        method: "DELETE"
      });
    }
    //setRefresh(true)
		// const data = await response.json();
		// const expectedCaptions = data
		// .filter((photo) => photo.id !== id)
    //   	.map((photo) => photo.captions)
		// setPhotos(await expectedCaptions)

  useEffect(() => {
		setLoading(true);
		deletePhoto(id);
	}, [id]);

  useEffect(() => {
		setLoading(true);
		fetchData();
	}, [sort, submited]);

  if (error) return <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }} >Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select
            onChange={(e) => {
              setSort(e.target.value)
              fetch(`https://gallery-app-server.vercel.app/photos?_sort${id}&_order${sort}`)
            }}
            data-testid="sort"
            className="form-select"
            style={{}}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
              fetch(`https://gallery-app-server.vercel.app/photos?q=${search}`)
            }}
          >
            <input
              type="text"
              data-testid="search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
            <input
              type="submit"
              value="Search"
              data-testid="submit"
              className="form-btn"
            />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              Loading...
            </h1>
          ) : (
            photos.map((photo) => {
              return (
                <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
