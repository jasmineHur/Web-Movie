import "../css/main.css";
import mainImage from "../images/movie-main.jpeg";

export default function Home() {
  return (
    <div className="content">
      <h1 className="home-p">Justin Suh's Fabulour Movie Searching Website</h1>
      <h3 className="home-p">Fabulous Movie Searching Website</h3>
      <img src={mainImage} alt="movie-popcorn" className="img" />
      <h2 className="home-p">I wish you find the movie you’re after!</h2>
    </div>
  );
}

//https://iowacity.momcollective.com/2017/06/30/free-cheap-summer-movies-in-the-iowa-city-area-free-printable/
