## LFS 사용방법

### git-lfs 설치

| os | |
|--|--|
| debian | `apt-get install git-lfs` |
| redhat | `dnf install git-lfs` |
| mac | `brew install git-lfs` |

```
git lfs install

git lfs track "*.zip"

git config lfs.url "https://your-lfs-server.com/your-endpoint"

git add .gitattributes
```
