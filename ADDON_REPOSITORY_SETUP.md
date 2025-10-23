# Setting Up Your Home Assistant Add-on Repository

To install this as a Home Assistant add-on, you need to create a **separate repository** that Home Assistant can read.

## Quick Setup Steps

### 1. Create a New GitHub Repository

Create a new repository called `home-assistant-addons` (or any name you prefer) at:
https://github.com/new

### 2. Add the Required Files

Create these files in your new `home-assistant-addons` repository:

#### `repository.json` (root of repo)
```json
{
  "name": "Home Assistant Matter Hub Add-ons",
  "url": "https://github.com/jimbolimbo3/home-assistant-addons",
  "maintainer": "jimbolimbo3"
}
```

#### `home-assistant-matter-hub/config.yaml`
```yaml
name: Home Assistant Matter Hub
version: "3.0.0-alpha.95"
slug: home-assistant-matter-hub
description: Connect your Home Assistant instance to Matter/Thread
url: https://github.com/jimbolimbo3/home-assistant-matter-hub
arch:
  - armhf
  - armv7
  - aarch64
  - amd64
  - i386
image: ghcr.io/jimbolimbo3/home-assistant-matter-hub-addon
startup: application
boot: auto
host_network: true
hassio_api: true
hassio_role: default
options:
  log_level: info
schema:
  log_level: list(silly|debug|info|warn|error)
  http_auth_username: str?
  http_auth_password: password?
  http_ip_whitelist: [str]?
  mdns_network_interface: str?
```

#### `home-assistant-matter-hub/README.md`
```markdown
# Home Assistant Matter Hub

Connect your Home Assistant instance to Matter/Thread ecosystems like Apple Home, Google Home, and Alexa.

## About

This add-on bridges your Home Assistant devices to Matter, allowing you to control them through any Matter-compatible smart home platform.

## Installation

1. Add this repository to your Home Assistant add-on store
2. Install the "Home Assistant Matter Hub" add-on
3. Configure your settings
4. Start the add-on
5. Check the logs for the pairing QR code

## Configuration

- **log_level**: Set the logging level (silly, debug, info, warn, error)
- **http_auth_username**: Optional HTTP basic auth username
- **http_auth_password**: Optional HTTP basic auth password
- **http_ip_whitelist**: Optional list of allowed IP addresses/CIDRs
- **mdns_network_interface**: Optional network interface for mDNS

## Documentation

Full documentation: https://github.com/jimbolimbo3/home-assistant-matter-hub
```

#### `home-assistant-matter-hub/icon.png`
Add an icon (512x512 PNG recommended)

#### `home-assistant-matter-hub/logo.png`
Add a logo (optional, but recommended)

### 3. Repository Structure

Your `home-assistant-addons` repository should look like:

```
home-assistant-addons/
├── repository.json
└── home-assistant-matter-hub/
    ├── config.yaml
    ├── README.md
    ├── icon.png
    └── logo.png
```

### 4. Add to Home Assistant

1. Open Home Assistant
2. Go to **Settings** → **Add-ons** → **Add-on Store**
3. Click the three dots (⋮) in the top-right corner
4. Select **Repositories**
5. Add your repository URL: `https://github.com/jimbolimbo3/home-assistant-addons`
6. Click **Add**
7. Refresh the add-on store
8. Your add-on should now appear!

## Automatic Updates

To automatically update the `config.yaml` version when you release, add this to your main repo's `.github/workflows/build-test-addon.yml`:

```yaml
- name: Update addon repository
  if: github.event.inputs.push_to_registry == 'true'
  env:
    GH_TOKEN: ${{ secrets.ADDON_REPO_PAT }}
    VERSION: ${{ steps.version.outputs.version }}
  run: |
    git clone https://github.com/jimbolimbo3/home-assistant-addons.git /tmp/addon-repo
    cd /tmp/addon-repo
    sed -i "s/^version: .*/version: \"$VERSION\"/" home-assistant-matter-hub/config.yaml
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add home-assistant-matter-hub/config.yaml
    git commit -m "Update Home Assistant Matter Hub to v$VERSION" || exit 0
    git push
```

You'll need to create a Personal Access Token (PAT) with `repo` permissions and add it as `ADDON_REPO_PAT` secret.

## Testing Without Building

If you just want to test with existing images, you can change the image in `config.yaml` to use the original:

```yaml
image: ghcr.io/t0bst4r/home-assistant-matter-hub-addon
```

But for your own builds, use:

```yaml
image: ghcr.io/jimbolimbo3/home-assistant-matter-hub-addon
```
