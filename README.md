# Package Rebuilder Status

## Dependencies

* yarnpkg (for building/development)
* caddy (for local development)
* tmux (running watchers)
* rubygem-sass
* nodejs

On Fedora

```
dnf install caddy tmux yarnpkg rubygem-sass nodejs
```

## Development

```
make
./scripts/startdevelop.sh
```

Open http://localhost:8881

## Deployment

Creating a distributable tarball can be done with:

```
make dist
```

## Licence

The source code is licensed MIT and is originally based Arch Linux Reproducible Builds Website [rebuilderd-website](https://gitlab.archlinux.org/archlinux/rebuilderd-website).
