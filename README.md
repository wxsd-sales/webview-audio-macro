# Webview Audio Macro

This example Webex Device macro monitors when WebViews are visible on your Webex Device and ensures they output Audio to the Loudspeaker Output Group of your Device.

## Overview

Webex Rooms systems which are configured using Audio Console feature may not always be configured correctly or may get changed accidently causing WebViews not to output sound to the Loudspeaker Output groupa. This causes situations where WebRTC meetings or other WebViews don't output sound into the room.

This example macro monitors when WebViews are opened and checks the current audio configuration of your Webex Room device and then make corrective changes to ensure the WebView is outputting sound to the Loudspeaker.

Here are the actions the macro will take when it starts or when a new WebView becomes visible:

- Any Input Group found with a 'WebView.1' Connector attached:
  - Action: Ensure Input Group is linked to Loudspeaker Output Group
- Audio Input Group named 'Web' found with no 'WebView.1' Connector attached:
  - Action: Add the 'WebView.1' Connector to Input Group 'Web' and ensure its linked to Loudspeaker Output Group
- No WebView Input Group or Connector found:
  - Action: Create 'Web' Input Group, add 'WebView.1' Connector and link Input Group to Loudspeaker Output Group:
- WebView Input Group with Connector found and is linked to the Loudspeaker Output Group
  - Action: No changes made

## Setup

### Prerequisites & Dependencies: 

- RoomOS/CE 10.x or above Webex Room Series Device
- Web admin access to the device to upload the macro
- Ensure Audio Console is enabled and configured with a Output Group called 'Loudspeaker'

### Installation Steps:

1. Download the ``webview-audio-macro.js`` file and upload it to your Webex Room devices Macro editor via the web interface.
2. Enable the Macro on the editor.

## Validation

Validated Hardware:

* Room Kit Pro + Touch 10

This macro should work on other Webex Devices with Audio Console support but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).

## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions

Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=userguide-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
