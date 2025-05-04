# How to run the project

## Set Current Directory

- make sure you set current directory as the `backend` folder directory

## Install uv

```shell
pip install uv
```

## Install Dependencies

```shell
uv sync
```

OR

```shell
uv pip install -r pyproject.toml
```

## Starting Server

- Before starting download the testing videos: [Google Drive Link](https://drive.google.com/drive/folders/1GA-4-yzoNd2tFcMz-pbcvQ3HvvgRj0B_)
- Put the downloaded videos (not folder) inside `./src/assets/videos/*`

```shell
uv run main.py
```
