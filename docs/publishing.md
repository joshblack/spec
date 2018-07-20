# Publishing

## Prereleases

```bash
./tasks/publish.sh \
  -m "chore(release): publish %s" \
  --exact \
  --npm-tag=next \
  --cd-version=prerelease \
  --force=*
```
