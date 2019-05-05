import 'isomorphic-unfetch'
import LazyLoad from 'react-lazyload';

function renderTopics(topics) {
  if (!topics || !topics.length) {
    return ""
  }
  return topics.map(topic => <li key={topic}>{topic}</li>)
}

function renderVideos(videos) {
  if (!videos || !videos.length) {
    return <div>No Videos, try again later</div>
  }
  return videos.map(video =>
    <li key={video.videoId}>
      <LazyLoad>
        <img src={video.thumbnail} alt={video.title} />
      </LazyLoad>
      <div className="info">
        <h2>{video.title}</h2>
        <ul class="topics">{renderTopics(video.topics)}</ul>
        <a href={`https://www.youtube.com/watch?v=${video.videoId}`} title={video.title} target="_blank">Ver Video</a>
      </div>
    </li>
  )
}

function Home({ videos }) {
  return (
    <div>
      <h1>Las mañaneras</h1>
      <ul className="list-videos">
        {renderVideos(videos)}
      </ul>
      <style global jsx>{`
        body {
          font-family: "Helvetica Neue";
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          background: #012a33;
          color: white;
          font-weight: normal;
          margin: 0;
          padding: 12px;
        }
        h2 {
          margin: 0;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        a {
          text-decoration: none;
        }

        ul.list-videos img {
          display: block;
          height: auto;
          width: 100%;
        }
        .info {
          background: #eeefe299;
          padding: 12px 12px 20px;
        }
        .info .topics {
          overflow: hidden;
          padding: 12px 0;
        }
        .info .topics li {
          float: left;
        }
        .info .topics li:after {
          content: ' ';
          display: inline-block;
          padding-right: 12px;
        }
        .info a {
          background: #012a33;
          border-radius: 5px;
          color: #FFF;
          display: block;
          text-align: center;
          border: 1px solid;
          margin-top: 12px;
          padding: 6px;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  const res = await fetch('https://dh6hruuuma.execute-api.us-east-1.amazonaws.com/default/listVideos')
  const videos = await res.json()
  return { videos }
}

export default Home
