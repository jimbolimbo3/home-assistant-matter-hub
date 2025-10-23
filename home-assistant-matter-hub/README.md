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