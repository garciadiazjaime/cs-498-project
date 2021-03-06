# ETL for Youtube Captions

## TODO

- [ ] Create a small front-end (REST API endpoint)
    - Given one or more keywords
    - Returns (JSON) a list of matching videos

- [ ] make sure that the topics are meaningful

- ETL script
	- two files
		- txn file CSV file
			"videoId", "list of words"

- Create a small front-end (REST API endpoint)
	- Given one or more keywords
	- Returns (JSON) a list of matching videos

- [ ] Finalize the project report


This code helps to download captions from YouTube using YouTube Data API and save them locally in a dynamodb instance.

We use Docker and Docker-Compose to ensure that the environment is reproducible. Please make sure you have both Docker and Docker Compose installed on your local machine before proceeding further.

## 1. Build docker image

```bash
$./scripts/build_docker_image.sh
```

This creates 3 docker images

- cs498_etl:latest

  This image is used to perform ETL operations such as downloading YouTube video details and captions.

- cs498_ds:latest

  This image is used to perform data science activities such as training predictive model and inference.

- cs498_api:latest

  This image is used to provide REST API so that usres can query videos based on the labels.

## 2. Create tables in local dynamodb instance

```bash
$./scripts/create_tables.sh
```

This script create two tables in DynamoDB

- Table 'videos'

  This table is used during ETL operations to store list of YouTube videos to be processed.

- Table 'video_tags'

  This table is used during ETL, after model inference, to store the label and video relation information.

## 3. Download captions

In order to download video captions using Google YouTube Data api, you'll need to get an API key from google. Please refer to [YouTube Data API Overview](https://developers.google.com/youtube/v3/getting-started)

```bash
$./scripts/download_captions.sh [API_KEY] [PLAYLIST_ID]
```

This will save captions inside `./captions` folder.

`./etl_captions/main.py` has three variables you might want to adjust:

- `PLAYLIST_ID`

This is the Playlist ID you want to download videos from.

- `MAX_RESULTS`

The number of results whenever hitting youtube api (max value 50).

- `MAX_TRIES`

Maximum number of hits made to Youtube API (this is to avoid infinite loops).

#### Creating an unsupervised model

##### Explore data

We would like to find out what words occur in various transcriptions and which ones are relevant to the NLP based unsupervised learning.

In order to work towards the same, we first launch the jupyter notebook

```bash
$./scripts/explore_topic_models.sh
```

This will show on the console URL which can be used to connect with the notebook

```
[I 00:22:05.940 NotebookApp] Writing notebook server cookie secret to /root/.local/share/jupyter/runtime/notebook_cookie_secret
[I 00:22:08.484 NotebookApp] Serving notebooks from local directory: /app/notebooks
[I 00:22:08.484 NotebookApp] The Jupyter Notebook is running at:
[I 00:22:08.484 NotebookApp] http://(2e118104df80 or 127.0.0.1):8080/?token=28d18090a6c3ddfe2bf364b471cbc7ab70c7cadfe53231b2
[I 00:22:08.485 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[W 00:22:08.493 NotebookApp] No web browser found: could not locate runnable browser.
[C 00:22:08.493 NotebookApp]

    To access the notebook, open this file in a browser:
        file:///root/.local/share/jupyter/runtime/nbserver-1-open.html
    Or copy and paste one of these URLs:
        http://(2e118104df80 or 127.0.0.1):8080/?token=28d18090a6c3ddfe2bf364b471cbc7ab70c7cadfe53231b2
```

Use the URL to access the notebook and open test1.ipynb from notebooks folder.


##### Topic modeling

In order to build TFIDF based LSI model

```bash
$./scripts/build_topic_model.sh
```

#### Set Videos topics

This will use the output from *Topics modeling* (video_id:topics) and update videos table.
Ideally each video will have its own topics

```bash
$./build_topic_model.sh [NUM_TOPICS] [NUM_WORDS_IN_TOPIC]

$./scripts/set_topics.sh
```

#### Dynamodb Queries

note: [AWS-cli](https://aws.amazon.com/cli/) needs to be installed and dynamodb running.

- List Tables

`aws dynamodb list-tables --endpoint-url http://localhost:8000`

- Show Videos

`aws dynamodb scan --table-name videos --endpoint-url http://localhost:8000`

- Delete Videos Table

`aws dynamodb delete-table --table-name=videos --endpoint-url http://localhost:8000`
